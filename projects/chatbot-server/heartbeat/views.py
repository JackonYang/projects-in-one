# -*- coding: utf-8 -*-
import time
import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.template.response import TemplateResponse

import socket

# from django_redis import get_redis_connection
# redis = get_redis_connection('monitor')
global_data = {
    'hits': 0,
}

host = socket.gethostname()

start_time = time.time()

logger = logging.getLogger(__name__)


def default_home(request,
                 template_name='home.html'):  # pragma: no cover

    # key = 'test:hits:default_home'
    # redis.incr(key)
    # hits = int(redis.get(key))
    global_data['hits'] += 1
    hits = global_data['hits']

    context = {
        'hostname': host,
        'hits': hits,
    }

    logger.info('hits default_home: {hits}'.format(**context))
    logger.error('rollbar test. hits default_home: {hits}'.format(**context))

    return TemplateResponse(request, template_name, context)


@api_view(['GET'])
def heartbeat(request):
    return Response({
        'startTime': start_time,
        'upTime': time.time() - start_time,
        'status': 'running',
        'mode': 'simple',
    })


@api_view(['GET'])
def redis_health(request):

    # key = 'test:hits:redis_health'
    # hits = redis.incr(key)
    global_data['hits'] += 1
    hits = global_data['hits']

    return Response({
        'startTime': start_time,
        'upTime': time.time() - start_time,
        'status': 'running',
        'mode': 'redis',
        'hostname': host,
        'hits': hits,
    })
