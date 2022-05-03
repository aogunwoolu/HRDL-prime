from django.apps import AppConfig
from django.core.cache import cache
from django.db.utils import OperationalError
import json

# set up HRDL cache and background services on server startup
class HrdlConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'HRDL'

    def ready(self):
        try:
            from .models import TradingBot, TradingPair
            from .tasks import get_daily, get_hourly, get_twitter, trade
            from django_celery_beat.models import PeriodicTask, CrontabSchedule


            for tp in TradingPair.objects.all():
                cache_key = tp.pairName+('_daily')

                is_in_cache = cache.get(cache_key)

                # verify information is not in cache
                if (is_in_cache is None):
                    # get data (daily/hourly/twitter)
                    get_daily(TradingPairID = tp.id)
                    get_hourly(TradingPairID = tp.id)
                    get_twitter(TradingPairID = tp.id)

                    # setup background tasks (daily/hourly/twitter)
                    if (PeriodicTask.objects.filter(name = f"{tp.pairName} hourly").count() == 0):
                        schedule = CrontabSchedule.objects.create(
                            minute='58', 
                            hour='*',
                            day_of_week='*',
                            day_of_month='*',
                            month_of_year='*',
                        ) # To create a schedule to run on the 58th minute of every hour
                        task = PeriodicTask.objects.create(
                            crontab=schedule, 
                            name=f"{tp.pairName} hourly", 
                            task='HRDL.tasks.get_hourly',
                            kwargs=json.dumps({'TradingPairID': tp.id})
                        ) 

                    if (PeriodicTask.objects.filter(name = f"{tp.pairName} daily").count() == 0):
                        schedule = CrontabSchedule.objects.create(
                            minute='0', 
                            hour='0',
                            day_of_week='*',
                            day_of_month='*',
                            month_of_year='*',
                        ) # To create a schedule to run on the 58th minute of every hour
                        task = PeriodicTask.objects.create(
                            crontab=schedule, 
                            name=f"{tp.pairName} daily", 
                            task='HRDL.tasks.get_daily',
                            kwargs=json.dumps({'TradingPairID': tp.id})
                        ) 

                    if (PeriodicTask.objects.filter(name = f"{tp.pairName} social").count() == 0):
                        schedule = CrontabSchedule.objects.create(
                            minute='0', 
                            hour='0',
                            day_of_week='*',
                            day_of_month='*',
                            month_of_year='*',
                        ) # To create a schedule to run on the 58th minute of every hour
                        task = PeriodicTask.objects.create(
                            crontab=schedule, 
                            name=f"{tp.pairName} social", 
                            task='HRDL.tasks.get_twitter',
                            kwargs=json.dumps({'TradingPairID': tp.id})
                        ) 
                else:
                    continue
        except Exception as e:
            print("Error {0}".format(str(e.args[0])).encode("utf-8"))
            pass
