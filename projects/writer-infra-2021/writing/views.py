# -*- coding: utf-8 -*-
import time
import logging
import copy
import os

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.template.response import TemplateResponse
from django.shortcuts import redirect

from article_generator.apps import lottery_article

logger = logging.getLogger(__name__)

task_history = []
task_details = {}
global_vars = {
    'task_id': 0,
    'task_tmpl_id': 0,
}
task_tmpls = {}

task_args_data = {
    'title-k8': {
        'display': '快8 文章题目',
        'value': '快8 专家推荐与走势图汇总-{day}',
        'help': '一般不用改。{day} 会自动替换为今天的日期',
    },
    'url-k8': {
        'display': '快8 文章网址',
        'value': 'test',
        'help': '要填写。今天没开奖就不填写。原文的网址',
    },
    'title-ssq': {
        'display': '双色球文章题目',
        'value': '双色球专家推荐与走势图汇总-{day}',
        'help': '一般不用改。{day} 会自动替换为今天的日期',
    },
    'url-ssq': {
        'display': '双色球 文章网址',
        'value': 'test',
        'help': '要填写。今天没开奖就不填写。原文的网址',
    },
    'title-3d': {
        'display': '3D 文章题目',
        'value': '3D 专家推荐与走势图汇总-{day}',
        'help': '一般不用改。{day} 会自动替换为今天的日期',
    },
    'url-3d': {
        'display': '3D 文章网址',
        'value': 'test',
        'help': '要填写。今天没开奖就不填写。原文的网址',
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


def task_home(request,
        template_name='task-home.html'):

    task_args = []
    for i in task_args_order:
        t = copy.copy(task_args_data[i])
        t['key'] = i
        task_args.append(t)

    context = {
        'task_args': task_args,
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


def brief_output(task_id, output):
    lines = output.split('\n')
    brief = '<br/>'.join(lines[:3])
    if len(lines) > 3:
        brief += '... <a href="/writing/tasks/%s"> read more </a>' % task_id

    return brief


def task_run(request):
    if request.method != 'POST':
        pass

    qd = request.POST
    task_args_dict = {k: qd.get(k) for k in task_args_order}

    for k, v in task_args_dict.items():
        task_args_data[k]['value'] = v

    appid = os.environ.get('WECHAT_MP_APPID', 'default_appid')
    secret = os.environ.get('WECHAT_MP_SECRET', 'default_secret')

    upload_params = {
        'platform': 'wechat-mp',
        'params_dict': {
            'appid': appid,
            'secret': secret,
        }
    }

    lottery_article.run(task_args_dict, upload_params)

    return redirect('task_home')


def task_detail(request, task_id,
        template_name='task-detail.html'):
    context = {
        'task': task_details[task_id],
    }

    return TemplateResponse(request, template_name, context)
