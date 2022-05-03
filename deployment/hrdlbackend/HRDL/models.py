from typing_extensions import Required
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.base import Model
from binance import Client
import torch
from django.contrib.staticfiles import finders
import pandas as pd
import numpy as np
from celery.utils.log import get_task_logger
from sklearn.preprocessing import MinMaxScaler
from torch.autograd import Variable

from .MLmodels import LSTM
from HRDLbackend.celery import app

import ccxt
import Coinpaprika
from datetime import datetime, timedelta
from django.core.cache import cache, caches  
from hashlib import sha256
import json

# model for managing users, extended from BaseUserManager
class UserManager(BaseUserManager):

    # create normal user
    def create_user(self, username, email, password=None, **kwargs):
        if username is None:
            raise TypeError('Users must have a username.')
        if email is None:
            raise TypeError('Users must have an email.')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)

        return user

    # create superuser, such as admins
    # sets is_staff & is_superuser to true
    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Superusers must have a password.')
        if email is None:
            raise TypeError('Superusers must have an email.')
        if username is None:
            raise TypeError('Superusers must have an username.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user

# trading pair model
# unused in this iteration of HRDL
class PairModel(models.Model):
    lastTrained = models.DateField()

    def __str__(self):
        return f"{self.pairName}"

# trading pair model
# for each pair, store long + short names and coinpaprika ids
class TradingPair(models.Model):
    pairName = models.CharField(db_index=True, max_length=255, unique=True)
    fullNamePair = models.CharField(max_length=255, unique=True)
    modelPath = models.URLField(null=True)
    lastTrained = models.DateField()

    @property
    def shortnames(self):
        return self.pairName.split("/")
    
    @property
    def longnames(self):
        return self.fullNamePair.split("/")
    
    @property
    def paprika_coin_id(self):
        return f"{self.shortnames[0].lower()}-{self.longnames[0].replace(' ','-').lower()}"

    def __str__(self):
        return f"{self.pairName}"

# exchange information model
# stores exchange information for exchange creation
class Exchange(models.Model):
    name = models.CharField(db_index=True, max_length=255)
    api_key = models.CharField(db_index=True, max_length=255)
    api_secret = models.CharField(db_index=True, max_length=255)

# user model
# stores user information
# verifies email is the identifier
# uses custom user manager
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255)
    email = models.EmailField(db_index=True, unique=True,  null=True, blank=True)
    firstName = models.CharField(db_index=True, max_length=255)
    lastName = models.CharField(db_index=True, max_length=255)
    investmax = models.IntegerField(default=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    @property
    def tradingPairs(self):
        TBs = [bot.coin for bot in self.bots.all()]
        return TBs

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"

# trading bot model
# stores bot information
# some information is not utilised in this iteration of HRDL
class TradingBot(models.Model):
        exchange = models.ForeignKey(Exchange, related_name="bots", on_delete=models.CASCADE)
        pair = models.ForeignKey(TradingPair, related_name="bots", on_delete=models.CASCADE)
        user = models.ForeignKey(User, related_name="bots", on_delete=models.CASCADE)
        active = models.BooleanField(default=False)
        #1 = selling, 2 = buying, 3 = none
        status = models.IntegerField(default=0)
        history = models.CharField(max_length=255, default="[]")
        profit = models.IntegerField(default=0)
        stopLoss = models.IntegerField(default=30)
        takeProfit = models.IntegerField(default=30)
        maxInvestPercentage = models.IntegerField(default=30)
        playground = models.IntegerField(default=30)

        # get daily data
        def get_daily(self, coin, api_client ):
            WOHLC = api_client.coins.historical_OHLC(
                coin_id=coin.paprika_coin_id,
                start=datetime.now() - timedelta(weeks=1),
                end=datetime.now(),
            )
            return WOHLC

        # get daily/hourly data from cache
        def get_from_cache(self, coin, daily=True):
            cache_key = coin.pairName+('_daily' if daily else '_hourly')

            return cache.get(cache_key) 

        # get associated coin data through trading bot
        @property
        def coin(self):
            coin = TradingPair.objects.get(id = self.pair.id)
            shortnames = coin.shortnames
            longnames = coin.longnames
            paprika_coin_id = coin.paprika_coin_id
            api_client = Coinpaprika.Client()

            try:
                coin_data = api_client.coins.with_id(paprika_coin_id)
            except:
                paprika_coin_id += "-coin"
                coin_data = api_client.coins.with_id(paprika_coin_id)

            WOHLC = self.get_from_cache(coin, True)
            concat_list = self.get_from_cache(coin, False)

            useful_data = {
                'active': self.active,
                'history': self.history,
                'botid': self.id,

                'name': coin_data['name'],
                'symbol': coin_data['symbol'],
                'tags': coin_data['tags'],
                'links': coin_data['links'],
                'whitepaper': coin_data['whitepaper'],
                'weekly': WOHLC[1:],
                'hourly': concat_list,
            }

            return {
                'primary': [shortnames[0], longnames[0]],
                'secondary': [shortnames[1], longnames[1]],
                'primaryinfo': json.dumps(useful_data, default=str),
            }

        # get path of trading bot's model
        @property
        def PATH(self):
            return f"./models/{self.pair}_SD.pth"

        # get active client from exchange
        @property
        def client(self):
            exchange_class = getattr(ccxt, self.exchange.name)
            exchange = exchange_class({
                'apiKey': f'{self.exchange.api_key}', 
                'secret': f'{self.exchange.api_secret}'
            })

            #! DEBUG MODE - change for no sandbox mode
            exchange.set_sandbox_mode(True)

            return exchange

        # get hourly date (not from cache)
        def klines(self, symbol, tf, from_timestamp, end):
            data = []
            exchange = self.client
            from_timestamp = exchange.parse8601(from_timestamp)
            end = exchange.parse8601(end)

            data = exchange.fetch_ohlcv(symbol, tf)
            return data

        # get model from disk
        @property
        def lstm(self):
            input_size = 5; hidden_size = 2;num_layers = 1;num_classes = 5

            lstm =  LSTM(num_classes,input_size,hidden_size,num_layers)
            lstm.load_state_dict(torch.load(finders.find(self.PATH)))
            lstm.eval()

            return lstm

        #! get prediction from model (depreciated)
        @property
        def predictions(self):
            data = pd.DataFrame(self.klines).iloc[495:,:]
            recent = pd.DataFrame(data)
            df = pd.DataFrame({
                "volume": recent.iloc[:, 5],
                "open": recent.iloc[:, 1],
                "high": recent.iloc[:, 2],
                "low": recent.iloc[:, 3],
                "close": recent.iloc[:, 4]
            })
            arr = df.values.tolist()
            sc = MinMaxScaler()
            x = sc.fit_transform(arr)
            dataX = Variable(torch.Tensor(np.array([x])))
            predict = self.lstm(dataX)
            data_predict = sc.inverse_transform(predict.data.numpy())

            return data_predict[0]