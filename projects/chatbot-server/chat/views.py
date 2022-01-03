import json
# import os
import copy
import hashlib
import time
import logging

from rest_framework.decorators import api_view
# from rest_framework.response import Response
from django.http import JsonResponse

from nlu.keyword_based.api import get_reply_list

logger = logging.getLogger(__name__)

default_response = {
    'error_code': 0,
    'error_msg': 'ok',
    'action': 'skip',
    'replys': [
    ]
}

SAME_REPLY_INTERVAL = 20
last_reply_pool = {}  # used to skip duplicated reply


def md5(s):
    m = hashlib.md5()
    m.update(s.encode('utf8'))
    return m.hexdigest()


def json_md5(obj):
    s = json.dumps(obj)
    return md5(s)


def should_skip(dialogue_id, replys, request_time):
    replys_md5 = json_md5(replys)

    unique_key = '%s-%s' % (dialogue_id, replys_md5)

    if unique_key not in last_reply_pool:
        last_reply_pool[unique_key] = request_time
        return False

    t_done = last_reply_pool[unique_key]

    if request_time - t_done > SAME_REPLY_INTERVAL:
        last_reply_pool[unique_key] = request_time
        return False

    # do not update the cache time since no reply at this time
    # last_reply_pool[unique_key] = max(request_time, t_done)
    logger.info('skip since duplicated. dialogue_id: %s' % dialogue_id)
    return True


@api_view(['GET', 'POST'])
def simple_v1(request):
    text = request.query_params.get('text')
    dialogue_id = request.query_params.get('dialogue')
    request_time = time.time()

    if not text:
        return error_request('invalid text: %s' % text)

    rsp = copy.deepcopy(default_response)

    replys = get_reply_list(text)

    if len(replys) > 0 and not should_skip(dialogue_id, replys, request_time):
        rsp['replys'] = replys
        rsp['action'] = 'reply'

    try:
        return JsonResponse(rsp)
    except Exception as e:
        return error(e)


def error(exc):
    res = JsonResponse({
        "msg": "internal server error",
        "exc": str(exc),
    })
    res.status_code = 500
    return res


def error_request(msg):
    rsp = copy.deepcopy(default_response)

    rsp.update({
        'error_code': 1,
        'error_msg': "invalid request: %s" % msg,
    })

    res = JsonResponse(rsp)
    res.status_code = 400
    return res
