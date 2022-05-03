# /social/viewsets.py

from django.http.response import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from django.shortcuts import get_object_or_404
from django.contrib.staticfiles import finders

from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .serializers import LoginSerializer, RegisterSerializer

from django.contrib.auth.hashers import make_password

from django.shortcuts import get_object_or_404, render, redirect

from django.contrib.staticfiles import finders

from django_celery_beat.models import IntervalSchedule
from celery import shared_task
from celery.utils.log import get_task_logger
from django_celery_beat.models import PeriodicTask, IntervalSchedule, CrontabSchedule

import ccxt
import json
import base64
from PIL import Image
from io import BytesIO
import os
from datetime import date

from .serializers import UserSerializer, TradingPairSerializer, TradingBotSerializer
from .models import User, TradingPair, Exchange, TradingBot
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

appname = "HRDL - your personal crypto trader"

# User viewset (utilises the User model + serializer)
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    # requires login to be accessed
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated']
    ordering = ['-updated']

    # get all users if user is superuser
    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()

    # get one user, available to any logged in user
    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = User.objects.get(id=lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj

# TradingPair viewset (utilises the TradingPair model + serializer)
class TradingPairViewSet(viewsets.ModelViewSet):
    serializer_class = TradingPairSerializer
    http_method_names = ['get']

    # get all trading pairs
    def get_queryset(self):
        return TradingPair.objects.all()

    # get one trading pair
    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = TradingPair.objects.get(id=lookup_field_value)

        return obj

# Login viewset, used to verify login credentials
class LoginViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    # allows any user (authenticated or not)
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    # default post method, returns 200 if successful
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            print("valid")
        except TokenError as e:
            print("except")
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

# Trading bot viewset (utilises the TradingBot model + serializer)
class TradingBotViewSet(viewsets.ModelViewSet):
    http_method_names = ['put']
    serializer_class = TradingBotSerializer
    # requires login to be accessed
    permission_classes = (IsAuthenticated,)

    # start trading bot
    def update(self, request, pk):

        reqBool = json.loads(request.body)

        TB = TradingBot.objects.get(id=pk)

        # if trading bot background task does not exist, create it
        if (PeriodicTask.objects.filter(name = f"{self.request.user}-{pk}-trade").count() == 0):
            schedule = CrontabSchedule.objects.create(
                minute='59', 
                hour='*',
                day_of_week='*',
                day_of_month='*',
                month_of_year='*',
            ) 
            task = PeriodicTask.objects.create(
                crontab=schedule, 
                name=f"{self.request.user}-{pk}-trade",  
                task='HRDL.tasks.trade',
                kwargs=json.dumps({'pk': pk})
            ) 
            # set trading bot status to running
            task.enabled = False
            TB.active = False
            task.save()
            TB.save()
        else:
            # get specific task related to the requested trading bot
            task = PeriodicTask.objects.get(name = f"{self.request.user}-{pk}-trade")
            if (task.enabled != reqBool and TB.active != reqBool):
                # activate/deactivate the trading bot
                task.enabled = json.loads(request.body)
                TB.active = json.loads(request.body)
                task.save()
                TB.save()
        
        return Response(status=status.HTTP_200_OK)

# Registration viewset, used to register new users
class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    # allows any user (authenticated or not)
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        data =request.data

        # data example:

        #{'userName': 'admin@gmail.com', 'first-name': '', 
        #'last-name': '', 'password': 'password123', 'repassword': '',
        #'email': '', 'exchange': 'None', 'e-key': 'admin@gmail.com',
        #'secret': 'password123', 'currencies': [], 'stop-loss': 30,
        #'take-profit': 30, 'amount-to-invest': 100, 'fullwidths': 
        #[{'currency': 6, 'width': 16}, {'currency': 7, 'width': 33}
        #, {'currency': 8, 'width': 35}, {'currency': 10, 'width': 16}]}

        # create new user and their associated bots
        try:
            new_User = User.objects.create(
                username = data['userName'],
                email = data['email'],
                firstName = data['first-name'],
                lastName = data['last-name'],
                password = make_password(data['password']),
                is_active = True,
                is_staff = False
            )

            # creates new exchange
            user_Exchange = Exchange.objects.create(
                name = data['exchange'],
                api_key = data['e-key'],
                api_secret = data['secret'],
            )

            # creates exchange using ccxt
            exchange_class = getattr(ccxt, user_Exchange.name)
            exchange = exchange_class({
                'apiKey': f'{user_Exchange.api_key}', 
                'secret': f'{user_Exchange.api_secret}'
            })

            #! DEBUG
            exchange.set_sandbox_mode(True)

            # gets free balance of USDT
            balance = exchange.fetch_balance()['USDT']['free']

            # creates new trading bots
            for coin in data['currencies']:
                tp = TradingPair.objects.get(id=coin['id'])

                MIP = list(filter(lambda currency: 
                currency['currency'] == coin['id'], data['fullwidths']))

                user_trading_bot = TradingBot.objects.create(
                    exchange = user_Exchange,
                    pair = tp,
                    user = new_User,
                    active = False,
                    status = 3,
                    history = "[]",
                    profit = 0,
                    stopLoss = data['stop-loss'],
                    takeProfit = data['take-profit'],
                    maxInvestPercentage = MIP[0]['width'],
                    playground = balance/MIP[0]['width']
                )

                user_trading_bot.save()
        except Exception as e:
            return Response({'exception': str(e)}, status = status.HTTP_400_BAD_REQUEST)
        new_User.save()
        user_Exchange.save()

        refresh = RefreshToken.for_user(new_User)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        serializer = UserSerializer(new_User)

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)

# Refresh token viewset, used to refresh tokens
class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # if refresh token is valid
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        # respond with new access token
        return Response(serializer.validated_data, status=status.HTTP_200_OK)