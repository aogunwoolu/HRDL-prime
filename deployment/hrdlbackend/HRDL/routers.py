from rest_framework.routers import SimpleRouter
from .viewsets import UserViewSet, LoginViewSet, RegistrationViewSet, RefreshViewSet, TradingPairViewSet, TradingBotViewSet

routes = SimpleRouter()

# PRE-AUTHENTICATION
routes.register(r'currencies', TradingPairViewSet, basename='auth-login')

# AUTHENTICATION
routes.register(r'auth/login', LoginViewSet, basename='auth-login')
routes.register(r'auth/register', RegistrationViewSet, basename='auth-register')
routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'user', UserViewSet, basename='user')

# MAIN
routes.register(r'bot', TradingBotViewSet, basename='bot')

urlpatterns = [
    *routes.urls
]