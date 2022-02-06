# -*- coding: utf-8 -*-
import logging
import time

from concurrent.futures import ThreadPoolExecutor

from rest_framework.decorators import api_view
from rest_framework.response import Response

from utils.task_manager import TaskManager
from .task_runner import run_downloader

logger = logging.getLogger(__name__)

thread_pool_executor = ThreadPoolExecutor(max_workers=5)

task_mng = TaskManager()

task_args_order = [
    'url',
]


def trigger_task(task_id, task_args_dict):
    logger.info('task started. task_id: %s' % task_id)
    try:
        run_downloader(task_id, task_args_dict)
    except Exception:
        logger.exception('task error. task_id: %s' % task_id)
        task_mng.add_task_log(task_id, '运行出错，请联系客服，或重试一下')

    task_mng.mark_done(task_id)
    logger.info('task done. task_id: %s' % task_id)


@api_view(['POST'])
def submit_task(request):
    qd = request.data

    task_args_dict = {k: qd.get(k) for k in task_args_order}

    task_id = task_mng.add_new_task()
    logger.info('submit task: %s. %s' % (task_id, str(task_args_dict)))
    thread_pool_executor.submit(
        trigger_task, task_id, task_args_dict)

    rsp = {
        'errno': 0,
        'task_id': task_id,
        'msg': 'ok',
    }
    return Response(rsp)


def get_result(request, task_id):
    for _ in range(3):
        is_done = task_mng.is_done(task_id)
        if is_done:
            break

        time.sleep(1)

    rsp = {
        'errno': 0,
        'task_id': task_id,
        'is_done': is_done,
        'msg': 'ok',
    }
    return Response(rsp)
