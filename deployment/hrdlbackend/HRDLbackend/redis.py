CHANNEL_LAYERS = {
    'default' : {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG' : {
            "hosts" : [('redis', 6379)], # You are supposed to use service name and not localhost
            },
        },
    }