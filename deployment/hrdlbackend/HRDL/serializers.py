from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models.functions import Lower

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist

from .models import User, TradingPair, TradingBot

# translates trading pair model to json
class TradingPairSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradingPair
        fields = ['id','pairName', 'fullNamePair']#, 'created', 'updated']

# translates user model to json
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'firstName', 'lastName', 'is_active','tradingPairs','bots']#, 'created', 'updated']
        read_only_field = ['is_active']#, 'created', 'updated']

# uses token to authenticate user
class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data

# redefines create method to create user
class RegisterSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True, max_length=128)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_active', 'created', 'updated']

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
        except ObjectDoesNotExist:
            user = User.objects.create_user(**validated_data)
        return user

# translates trading bot model to json
class TradingBotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradingBot
        fields = ['exchange', 'pair', 'user']