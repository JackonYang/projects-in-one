# -*- coding: utf-8 -*-
import logging
import copy
import os
import json

from concurrent.futures import ThreadPoolExecutor

# from rest_framework.decorators import api_view
# from rest_framework.response import Response

from django.template.response import TemplateResponse
from django.shortcuts import redirect

from article_generator.apps import lottery_article

from configs import resourses_dir

logger = logging.getLogger(__name__)

thread_pool_executor = ThreadPoolExecutor(max_workers=5)

task_history = []
task_details = {}
global_vars = {
    'notification-persist': [],
    'notification': '',
    'task_id': 0,
    'task_tmpl_id': 0,
}
task_tmpls = {}

task_args_data = {
    'title-k8': {
        'display': '快8 文章题目',
        'value': '彩百科-今日 快8 推荐汇总-{day}',
        'help': '一般不用改。{day} 会自动替换为今天的日期',
    },
    'url-k8': {
        'display': '快8 文章网址',
        'value': 'test',
        'help': '要填写。今天没开奖就不填写。原文的网址',
    },
    'title-ssq': {
        'display': '双色球文章题目',
        'value': '彩百科-今日 双色球 推荐汇总-{day}',
        'help': '一般不用改。{day} 会自动替换为今天的日期',
    },
    'url-ssq': {
        'display': '双色球 文章网址',
        'value': 'test',
        'help': '要填写。今天没开奖就不填写。原文的网址',
    },
    'title-3d': {
        'display': '3D 文章题目',
        'value': '彩百科-今日 3D 推荐汇总-{day}',
        'help': '一般不用改。{day} 会自动替换为今天的日期',
    },
    'url-3d': {
        'display': '3D 文章网址',
        'value': 'test',
        'help': '要填写。今天没开奖就不填写。原文的网址',
    },
    'output': {
        'display': 'output',
        'value': '',
        'help': 'readonly',
    },
}

task_args_order = [
    'title-k8',
    'url-k8',
    'title-ssq',
    'url-ssq',
    'title-3d',
    'url-3d',
]


def get_notifys_str():
    notifys = copy.copy(global_vars['notification-persist'])
    if global_vars['notification']:
        notifys.append(global_vars['notification'])
    return '<br/>'.join(notifys)


def task_home(request,
              template_name='task-home.html'):

    task_args = []
    for i in task_args_order:
        t = copy.copy(task_args_data[i])
        t['key'] = i
        task_args.append(t)

    context = {
        'task_args': task_args,
        'notification': get_notifys_str(),
        'tasks': [copy.copy(task_details[i]) for i in task_history],
        'task_tmpls': list(task_tmpls.values()),
    }

    return TemplateResponse(request, template_name, context)


def load_tmpl(request, tmpl_id):
    if tmpl_id in task_tmpls:
        tmpl = task_tmpls[tmpl_id]
        task_args_data['task_dir']['value'] = tmpl['task_dir']
        task_args_data['task']['value'] = tmpl['task']
        task_args_data['output']['value'] = ''

    return redirect('task_home')


def gen_task_id():
    global_vars['task_id'] += 1
    return global_vars['task_id']


def gen_task_tmpl_id():
    global_vars['task_tmpl_id'] += 1
    return global_vars['task_tmpl_id']


def run_single_mp(mp_key, task_args_dict, out):
    mp_name = os.environ.get('%s_NAME' % mp_key, 'default_name')

    out('%s 开始上传中，请等待几分钟...' % mp_name, True)
    appid = os.environ.get('WECHAT_MP_APPID_%s' % mp_key, 'default_appid')
    secret = os.environ.get('WECHAT_MP_SECRET_%s' % mp_key, 'default_secret')

    upload_params = {
        'platform': 'wechat-mp',
        'params_dict': {
            'appid': appid,
            'secret': secret,
        }
    }
    task_args_dict['mp_info'] = {
        'name': mp_name,
    }
    task_args_dict['thumb_image'] = os.path.join(
        resourses_dir, 'images/fucai-logo.jpg')

    res = lottery_article.run(task_args_dict, upload_params, lambda x, info=None: out(x, False))

    if 'media_id' not in res:
        out(json.dumps(res, indent=4, ensure_ascii=False), True)
    else:
        out('%s 已上传。media_id: %s' % (mp_name, res['media_id']), True)


def trigger_task(task_id, task_args_dict, on_progress=None, on_done=None):
    run_single_mp('MP1', task_args_dict, out=lambda x, flag: on_progress(task_id, x, flag))
    run_single_mp('MP2', task_args_dict, out=lambda x, flag: on_progress(task_id, x, flag))

    on_done(task_id, '已完成', persist=True)


def on_output(task_id, output, persist=False, clear=False):
    if clear:
        global_vars['notification-persist'] = []
        global_vars['notification'] = ''

    if persist:
        global_vars['notification-persist'].append(output)
        global_vars['notification'] = ''
    else:
        global_vars['notification'] = output


def task_run(request):
    if request.method != 'POST':
        pass

    qd = request.POST
    task_args_dict = {k: qd.get(k) for k in task_args_order}

    for k, v in task_args_dict.items():
        task_args_data[k]['value'] = v

    task_id = gen_task_id()

    on_output(task_id, '任务已提交，运行中...', clear=True)
    thread_pool_executor.submit(
        trigger_task, task_id, task_args_dict,
        on_progress=on_output, on_done=on_output)

    task_details[task_id] = {
        'task_args': copy.deepcopy(qd),
        'notes': '',
        'mark': '',
    }
    task_history.append(task_id)

    return redirect('task_home')


def task_detail(request, task_id,
                template_name='task-detail.html'):
    context = {
        'task': task_details[task_id],
    }

    return TemplateResponse(request, template_name, context)


def fetch_notifys(request,
                  template_name='notifys.html'):
    context = {
        'notification': get_notifys_str(),
    }

    return TemplateResponse(request, template_name, context)
