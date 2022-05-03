from celery import shared_task
from celery.utils.log import get_task_logger
from binance import Client
import torch
import ccxt
import Coinpaprika
from datetime import datetime, timedelta
from django.core.cache import cache
import pandas as pd
from django.contrib.staticfiles import finders
from sklearn.preprocessing import MinMaxScaler
from torch.autograd import Variable
import numpy as np
import time

from .MLmodels import LSTM
from .models import Exchange, TradingBot, TradingPair

# actual keys
api_key = ""
api_secret = ""

# test keys
t_api_key = ""
t_api_secret = ""

# define bianance client & logger
client = Client(t_api_key, t_api_secret)
logger = get_task_logger(__name__)

# predict the next price using neural network (not background task)
def predict_next_hour(current_OHLCV, pair):

    pathName = pair.pairName.replace("/","")
    PATH = f"./models/{pathName}_SD.pth"

    input_size = 5
    hidden_size = 2
    num_layers = 1
    num_classes = 5


    # load model state from file
    lstm = LSTM(num_classes,input_size,hidden_size,num_layers)
    lstm.load_state_dict(torch.load(finders.find(PATH)))
    lstm.eval()

    sc = MinMaxScaler()

    # min max scale the data
    current_OHLCV = sc.fit_transform(current_OHLCV)

    # gets last 5 hours of data
    data = pd.DataFrame(current_OHLCV).tail(5)

    recent = pd.DataFrame(data)

    recent = Variable(torch.Tensor(np.array(recent)))

    # predict the next price
    predict = lstm(recent.unsqueeze(0))

    # undo min max scaling
    data_predict = sc.inverse_transform(predict.data.numpy())

    # return the predicted price
    return data_predict[0]

# get the daily candlesticks for the given pair
# using coninpaprika api
# (saves to cache)
@shared_task
def get_daily(**kwargs):
    tradingpair = kwargs['TradingPairID']

    tp = TradingPair.objects.get(id=tradingpair)
    cache_key = tp.pairName+'_daily'
    api_client = Coinpaprika.Client()

    WOHLC = api_client.coins.historical_OHLC(
        coin_id=tp.paprika_coin_id,
        start=datetime.now() - timedelta(weeks=1),
        end=datetime.now(),
    )

    cache.set(cache_key, WOHLC, None)

    tp.save()

# get the hourly twitter data for the given pair
# using coninpaprika api
# (saves to cache)
@shared_task
def get_twitter(**kwargs):
    tradingpair = kwargs['TradingPairID']

    tp = TradingPair.objects.get(id=tradingpair)
    cache_key = tp.pairName+'_social'
    api_client = Coinpaprika.Client()

    try:
        twitter = api_client.coins.twitter(tp.paprika_coin_id)
    except:
        twitter = api_client.coins.twitter(tp.paprika_coin_id+ "-coin")

    cache.set(cache_key, twitter, None)

    tp.save()

# get the hourly candlestick data for the given pair
# using CCXT api
# (saves to cache)
def get_candlesticks(tp, exchange, from_timestamp, end):
    tf_multi = 60 * 60 * 1000
    symbol = tp.pairName
    tf = '1h'
    hold = 1
    data = []

    candle_no = (int(end) - int(from_timestamp)) / tf_multi + 1
    exchanges_names = ccxt.exchanges
    exchanges = [exchange, ccxt.coinbase(), ccxt.bitmex(), ccxt.bitfinex(), ccxt.huobipro()]

    exchange_pos = 0
    # while the timestamp is less than the end timestamp
    while from_timestamp < end:
        tryingexchange = exchanges[exchange_pos]
        try:
            ohlcvs = tryingexchange.fetch_ohlcv(symbol, tf, from_timestamp)
            from_timestamp += len(ohlcvs) * tf_multi + 1
            data += ohlcvs
            exchange_pos = 0
        except (ccxt.ExchangeError, ccxt.AuthenticationError, ccxt.ExchangeNotAvailable, ccxt.RequestTimeout) as error:
            # if error: change exchange to try
            print('Got an error', type(error).__name__, error.args, ', retrying in', hold, 'seconds...')
            exchange_pos += 1
            time.sleep(hold)

    myorder = [ 0, 1, 2, 3 ]
    hourly = [{'x': kline[0],'y': [kline[1:][i] for i in myorder],} for kline in data]

    # return the hourly candlesticks
    return hourly

# trading action, buy or sell
def action(previous, predicted, status, playground, symbol, client):
    response = None

    try:
        # force-preload markets first
        client.load_markets()  

        # testing purposes
        client.verbose = True 

        # set to market trade
        # init to buy
        type = 'market'
        side = 'buy'

        # if predicted is below previous close price
        # change to sell
        # set playground to other side
        if (predicted[3] - previous[-1][3] < 0):
            side = 'sell'
            other = symbol.split('/')[0]
            playground = client.fetch_balance()[other]['free']

        # amount to trade calculated (rudamentary)
        amount = playground * (abs(predicted[3] - previous[-1][3])/previous[-1][3])
        # no specified price means any price
        price = None

        try:
            print("MAKING TRADE")
            response = client.create_order(symbol, type, side, amount, price)
            print("TRADE MADE")

        except Exception as e:
            print('Failed to create order with', client.id, type(e).__name__, str(e))

    except Exception as e:
        print('Failed to load markets from', client.id, type(e).__name__, str(e))

    #client.close()
    return response

# trading background task
# includes NN prediction, trading action, and logging
@shared_task
def trade(**kwargs):
    pk = kwargs['pk']

    TB = TradingBot.objects.get(id=pk)
    exchange = TB.exchange
    tp = TB.pair

    cache_key = tp.pairName+('_hourly')

    # get past hour from cache (set from get_hourly)
    pasthour = cache.get(cache_key)

    # reformat to be used by NN + trading
    pasthour = [[i_pasthour["x"]] + i_pasthour["y"]
                     for i_pasthour in pasthour]

    # call NN prediction
    prediction = predict_next_hour(pasthour, tp)

    # actual trading action
    res = action(pasthour, prediction, TB.status, TB.playground, tp.pairName, TB.client)

    return res

# get hourly candlesticks background task
@shared_task
def get_hourly(**kwargs):
    tradingpair = kwargs['TradingPairID']

    tp = TradingPair.objects.get(id=tradingpair)
    cache_key = tp.pairName+'_hourly'

    exchange_class = getattr(ccxt, 'binance')
    exchange = exchange_class({
        'apiKey': t_api_key, 
        'secret': t_api_secret
    })
    #! DEBUG MODE - change for no sandbox mode
    exchange.set_sandbox_mode(True)

    from_timestamp = exchange.parse8601(f'{datetime.now() - timedelta(days=3)}')
    end = exchange.parse8601(f'{datetime.now().isoformat()}')
    
    hourly = get_candlesticks(tp, exchange, from_timestamp, end)

    # set cache
    cache.set(cache_key, hourly, None)