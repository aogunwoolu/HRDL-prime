from traceback import print_tb
from django.test import TestCase, Client
from HRDL.models import User, TradingPair, Exchange, TradingBot
from HRDL.viewsets import UserViewSet, TradingPairViewSet, TradingBotViewSet
from django.core.management import call_command
import json
import time
import ccxt
from django.core.cache import cache
from .tasks import get_daily, get_hourly, get_twitter, trade

from django.db.utils import IntegrityError
from django.contrib.auth.hashers import make_password

c = Client()

# test keys
t_api_key = ""
t_api_secret = ""

# define bianance client & logger
client = Client(t_api_key, t_api_secret)

# Create your tests here.

# test users can sign in with a unique email
class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create(
            username="test1",
            email="test1@mail.com",
            firstName="test1",
            lastName="test1",
            password=make_password("test1")
        )
        User.objects.create(
            username="test2",
            email="test2@mail.com",
            firstName="test2",
            lastName="test2",
            password=make_password("test2")
        )

        call_command('loaddata', 'initialdata.yaml', verbosity=0)

        # for tp in TradingPair.objects.all():
        #         #print(tp.pairName)
        #         cache_key = tp.pairName+('_daily')

        #         is_in_cache = cache.get(cache_key)

        #         if (is_in_cache is None):
        #             get_daily(TradingPairID = tp.id)
        #             get_hourly(TradingPairID = tp.id)
        #             get_twitter(TradingPairID = tp.id)

    
    def test_same_email(self):
        """Check that users cannot have the same email"""

        with self.assertRaises(IntegrityError):
            User.objects.create(
                username="test3",
                email="test2@mail.com",
                firstName="test3",
                lastName="test3",
                password=make_password("test3")
            )

    # def test_user_account_creation(self):
    #     """Check if user can sign up"""
    #
    #     response = c.post('/api/auth/register/', data=json.dumps({
    #         'userName': 'newUser', 'first-name': 'user', 
    #         'last-name': 'lastname', 'password': 'password123', 
    #         'repassword': 'password123','email': 'test12345@gmail.com', 
    #         'exchange': 'binance',
    #         'e-key': 'GxE5pFRZ6wKei541KAKNUNqQLC43TwMD9aw952IUkewTMSDbXjTe65Av8JmyBTaB',
    #         'secret': 'GL3hpjbGkPH7K6m8dXFVUCNhuNbC9hcKEsqlYWiwDci8WaYkLh7lBtNZVDs72eL8',
    #         'currencies': [
    #             {'id': 6, 'fullNamePair': 'XRP/Tether'}, 
    #             {'id': 7, 'fullNamePair': 'Polkadot/Tether'},
    #             {'id': 8, 'fullNamePair': 'Dogecoin/Tether'},
    #             {'id': 10, 'fullNamePair': 'Dai/Tether'}
    #         ], 
    #         'stop-loss': 30, 'take-profit': 30, 'amount-to-invest': 100, 
    #         'fullwidths': 
    #             [
    #                 {'currency': 6, 'width': 16}, 
    #                 {'currency': 7, 'width': 33},
    #                 {'currency': 8, 'width': 35},
    #                 {'currency': 10, 'width': 16}
    #             ]
    #     }), content_type='application/json')

    #     self.assertEqual(response.status_code, 201)

    def test_same_email(self):
        """Check that users cannot have the same email"""

    def test_get_currencies(self):
        """Check that users can sign up with a key and private key"""
        
        response = c.get('/api/currencies/')

        data = json.loads(response.content)

        self.assertGreater(len(data), 0)

    def test_login_time(self):
        """Check that login time is under 1 minute"""

        t1 = time.perf_counter()

        response = c.post('/api/auth/login/', data=json.dumps({
            'email': 'test1@mail.com', 'password': 'test1'
        }), content_type='application/json')

        t2 = time.perf_counter()

        t = t2 - t1

        self.assertLess(t, 5.0)

class ExchangeTestCase(TestCase):
    def test_get_exchanges_timing(self):
        """Check that users can sign up with a key and private key"""
        
        t1 = time.perf_counter()

        response = c.get('/api/get-exchanges/')

        t2 = time.perf_counter()

        t = t2 - t1

        self.assertLess(t, 3)

    def test_get_exchanges(self):
        """Check that users can sign up with a key and private key"""
        
        response = c.get('/api/get-exchanges/')

        data = json.loads(response.content)

        self.assertGreater(len(data['exchanges']), 0)

class TasksTestCase(TestCase):
    def setUp(self):
        t_user = User.objects.create(
            username="test1",
            email="test1@mail.com",
            firstName="test1",
            lastName="test1",
            password=make_password("test1")
        )

        call_command('loaddata', 'initialdata.yaml', verbosity=0)

        tp = TradingPair.objects.get(id=1)

        user_Exchange = Exchange.objects.create(
            name = 'binance',
            api_key = t_api_key,
            api_secret = t_api_secret,
        )

        #t_api_key, t_api_secret
        exchange_class = getattr(ccxt, user_Exchange.name)
        exchange = exchange_class({
            'apiKey': t_api_key, 
            'secret': t_api_secret
        })

        #! DEBUG
        exchange.set_sandbox_mode(True)

        balance = exchange.fetch_balance()['USDT']['free']

        user_trading_bot = TradingBot.objects.create(
            id=1,
            exchange = user_Exchange,
            pair = tp,
            user = t_user,
            active = False,
            status = 3,
            history = "[]",
            profit = 0,
            stopLoss = 30,
            takeProfit = 30,
            maxInvestPercentage = 80,
            playground = balance
        )

        user_trading_bot.save()

        get_hourly(TradingPairID = tp.id)

    # def test_daily_task(self):
    #     for tp in TradingPair.objects.all():
    #         cache_key = tp.pairName+('_daily')

    #         is_in_cache = cache.get(cache_key)

    #         self.assertIsNone(is_in_cache)

    #         get_daily(TradingPairID = tp.id)

    #         is_in_cache = cache.get(cache_key)

    #         self.assertIsNotNone(is_in_cache)

    # def test_hourly_task(self):
    #     for tp in TradingPair.objects.all():
    #         cache_key = tp.pairName+('_hourly')

    #         is_in_cache = cache.get(cache_key)

    #         self.assertIsNone(is_in_cache)

    #         get_hourly(TradingPairID = tp.id)

    #         is_in_cache = cache.get(cache_key)

    #         self.assertIsNotNone(is_in_cache)

    def test_trade(self):
        self.assertIsNotNone(trade(pk=1))
