from django.urls import path, include

from HRDL import api, viewsets

from rest_framework import routers
from django.urls import path, include

app_name = 'HRDL'

# returns all URLs for backend, including those in the routers file
urlpatterns = [
    path('api/get-exchanges/', api.get_exchanges, name='get exchanges'),
    path('api/', include(('HRDL.routers', 'HRDL'), namespace='HRDL-api')),
]