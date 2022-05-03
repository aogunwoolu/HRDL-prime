from django.http import JsonResponse
import ccxt

# return all exchanges from ccxt
def get_exchanges(request):
    return JsonResponse({
        'exchanges': ccxt.exchanges 
    })
