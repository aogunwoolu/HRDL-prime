from django.contrib import admin
from .models import User, TradingBot, TradingPair

# models that the admin can edit on the admin page

## user model registered (id, username, email)
@admin.register(User)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email']

## trading bot model registered (pair, exchange)
@admin.register(TradingBot)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ['pair', 'exchange']

## trading pair model registered (pair name, full pair name)
@admin.register(TradingPair)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ['pairName', 'fullNamePair']