# -*- coding: utf-8 -*-
import logging
import time
import traceback

from concurrent.futures import ThreadPoolExecutor

from rest_framework.decorators import api_view
from rest_framework.response import Response

from utils.task_manager import TaskManager
from .task_runner import run_downloader

logger = logging.getLogger(__name__)

thread_pool_executor = ThreadPoolExecutor(max_workers=5)

task_mng = TaskManager()

task_args_required = [
    'url',
]


def trigger_task(task_id, task_args_dict):
    logger.info('task started. task_id: %s' % task_id)
    has_exception = False
    try:
        photos = run_downloader(task_id, task_args_dict)
    except Exception:
        photos = []
        has_exception = True
        logger.exception('task error. task_id: %s' % task_id)
        task_mng.add_task_log(task_id, '运行出错，请联系客服，或重试一下')

    task_mng.mark_done(task_id, {
        'task_id': task_id,
        'is_done': True,
        'has_exception': has_exception,
        'traceback': traceback.format_exc(),
        'photos': photos,
        'total': len(photos),
    })
    logger.info('task done. task_id: %s' % task_id)


@api_view(['POST'])
def submit_task(request):
    req_data = request.data

    missing_args = []
    for arg in task_args_required:
        if arg not in req_data:
            missing_args.append(arg)

    if len(missing_args) > 0:
        message = 'mising required args: %s' % ', '.join(missing_args)
        rsp = {
            'errno': 400,
            'message': message,
            'data': {
            },
        }
        return Response(rsp)

    task_id = task_mng.add_new_task(**req_data)
    logger.info('submit task: %s. %s' % (task_id, str(req_data)))
    thread_pool_executor.submit(
        trigger_task, task_id, req_data)

    rsp = {
        'errno': 0,
        'message': 'ok',
        'data': {
            'task_id': task_id,
        },
    }
    return Response(rsp)


@api_view(['GET', 'POST'])
def get_result(request, task_id):
    wait_time = 0
    sleep_inteval = 1
    for _ in range(3):
        is_done = task_mng.is_done(task_id)
        if is_done:
            break
        else:
            time.sleep(sleep_inteval)
            wait_time += 1

    res = task_mng.get_task_meta(task_id).get('result', {
        'task_id': task_id,
        'is_done': is_done,
    })
    if not is_done:
        errno = 1
        message = 'task still running'

    elif res['has_exception']:
        errno = 2
        message = 'unexpected exception while executing task'

    else:
        errno = 0
        message = 'ok'
    rsp = {
        'errno': errno,
        'message': message,
        'data': res,
    }
    return Response(rsp)
