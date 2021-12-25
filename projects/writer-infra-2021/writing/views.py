# -*- coding: utf-8 -*-
import logging
import copy
import os
import json
import traceback

from concurrent.futures import ThreadPoolExecutor

# from rest_framework.decorators import api_view
# from rest_framework.response import Response

from django.template.response import TemplateResponse
from django.shortcuts import redirect
from django.urls import reverse

from article_generator.apis import run_article_gen_app

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


ns_trend_table = 'lottery.trend_table'
ns_tuijian = 'lottery.tuijian_collection'

task_args_config_v2 = {

    ns_tuijian: {
        'page_title': '文章生成 -- 每日推荐汇总',
        'mps': [
            'MP1',
            'MP2',
        ],
        'args': {
            'title-k8': {
                'display': '快8 文章题目',
                'value': '今日 快8 推荐汇总-{day}',
                'help': '一般不用改。{day} 会自动替换为今天的日期',
            },
            'url-k8': {
                'display': '快8 文章网址',
                'value': 'test',
                'help': '要填写。今天没开奖就不填写。原文的网址',
            },
            'title-ssq': {
                'display': '双色球文章题目',
                'value': '今日 双色球 推荐汇总-{day}',
                'help': '一般不用改。{day} 会自动替换为今天的日期',
            },
            'url-ssq': {
                'display': '双色球 文章网址',
                'value': 'test',
                'help': '要填写。今天没开奖就不填写。原文的网址',
            },
            'title-3d': {
                'display': '3D 文章题目',
                'value': '今日 3D 推荐汇总-{day}',
                'help': '一般不用改。{day} 会自动替换为今天的日期',
            },
            'url-3d': {
                'display': '3D 文章网址',
                'value': 'test',
                'help': '要填写。今天没开奖就不填写。原文的网址',
            },
        },
        'args_order': [
            'title-k8',
            'url-k8',
            'title-ssq',
            'url-ssq',
            'title-3d',
            'url-3d',
        ],
    },
    ns_trend_table: {
        'page_title': '文章生成 -- 走势图大全',
        'mps': [
            'MP2',
        ],
        'args': {
            'fc.title': {
                'display': '福彩文章题目',
                'value': '福彩走势图 {month} 月 {day} 日更新（{total_image_count} 张图）',
                'help': '一般不用改',
            },
            'fc.url_dudu-1': {
                'display': 'dudu-1 URL',
                'value': '',
                'help': '必须填',
            },
            'fc.url_dudu-2': {
                'display': 'dudu-2 URL',
                'value': '',
                'help': '必须填',
            },
            'fc.url_xiaotian-1': {
                'display': 'xiaotian-1 URL',
                'value': '',
                'help': '必须填',
            },
            'fc.url_xiaotian-2': {
                'display': 'xiaotian-2 URL',
                'value': '',
                'help': '必须填',
            },
        },
        'args_order': [
            'fc.title',
            'fc.url_dudu-1',
            'fc.url_dudu-2',
            'fc.url_xiaotian-1',
            'fc.url_xiaotian-2',
        ],
    },
}


class TaskManager():
    task_history = []  # id, only
    task_info = {}

    def add_new_task(self, **kwargs):
        task_id = gen_task_id()
        self.task_history.append(task_id)
        info = copy.deepcopy(kwargs)
        info['is_done'] = False
        self.task_info[task_id] = info
        return task_id

    def get_task_meta(self, task_id):
        if task_id not in self.task_info:
            return {}

        return self.task_info[task_id]

    def mark_done(self, task_id):
        self.task_info[task_id]['is_done'] = True
        print('task done: %s' % task_id)

    def is_done(self, task_id):
        if task_id not in self.task_info:
            return True

        return self.task_info[task_id]['is_done']


task_mng = TaskManager()


def format_app_name(orig):
    if orig == 'zoushitu':
        return ns_trend_table
    elif orig == 'tuijian':
        return ns_tuijian
    # default, do nothing
    return orig


def get_notifys_str():
    notifys = copy.copy(global_vars['notification-persist'])
    if global_vars['notification']:
        notifys.append(global_vars['notification'])
    return '<br/>'.join(notifys)


def app_home(request, orig_app_name,
             template_name='app-home.html'):

    app_name = format_app_name(orig_app_name)

    app_config = task_args_config_v2[app_name]
    task_args = []
    for i in app_config['args_order']:
        t = copy.copy(app_config['args'][i])
        t['key'] = i
        task_args.append(t)

    context = {
        'orig_app_name': orig_app_name,
        'app_name': app_name,
        'task_run_url': reverse('task_run'),
        'page_title': app_config['page_title'],
        'task_args': task_args,
        'notification': get_notifys_str(),
    }

    return TemplateResponse(request, template_name, context)


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


def run_single_mp_v2(mp_key, app_name, task_args_dict):
    mp_name = os.environ.get('%s_NAME' % mp_key, 'default_name')

    appid = os.environ.get('WECHAT_MP_APPID_%s' % mp_key, 'default_appid')
    secret = os.environ.get('WECHAT_MP_SECRET_%s' % mp_key, 'default_secret')

    upload_params = {
        'platform': 'wechat-mp',
        'params_dict': {
            'appid': appid,
            'secret': secret,
        }
    }

    # add more params to task_args_dict
    task_args_dict['mp_info'] = {
        'name': mp_name,
    }
    task_args_dict['thumb_image'] = os.path.join(
        resourses_dir, 'images/fucai-logo.jpg')

    res = run_article_gen_app(app_name, task_args_dict, upload_params)
    return res


def trigger_task_v2(app_name, task_id, task_args_dict):
    app_config = task_args_config_v2[app_name]
    mps = app_config['mps']
    for mp in mps:
        try:
            run_single_mp_v2(mp, app_name, task_args_dict)
        except Exception:
            traceback.print_exc()

    task_mng.mark_done(task_id)


def upload_image(image_paths):
    return [
        '/media/fucai-logo.jpg',
    ]


def trigger_demo_task(task_id, task_args_dict, on_progress=None, on_done=None):
    raw_data = lottery_article.run_download(task_args_dict, lambda x, info=None: on_progress(task_id, x, False))

    data = []
    for record in raw_data:
        info = record['info_data']
        info['image_urls'] = upload_image(info['images'])
        data.append(info)

    task_details[task_id]['result_json'] = data
    task_details[task_id]['is_done'] = True
    print('res', data)
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

    orig_app_name = qd['orig_app_name']
    app_name = format_app_name(orig_app_name)
    app_config = task_args_config_v2[app_name]

    task_args_dict = {k: qd.get(k) for k in app_config['args_order']}

    # save user inputs to runtime default args
    for k, v in task_args_dict.items():
        app_config['args'][k]['value'] = v

    task_id = task_mng.add_new_task()
    thread_pool_executor.submit(
        trigger_task_v2, app_name, task_id, task_args_dict)

    return redirect(reverse('in_progress', kwargs={
        'orig_app_name': orig_app_name,
        'task_id': task_id,
    }))


def task_result(request, orig_app_name, task_id,
                template_name='task-result.html'):
    context = {
        'run_again_url': reverse('app_home', kwargs={
            'orig_app_name': orig_app_name,
        }),
        # 'task': task_details.get(task_id),
        # 'records': task_details.get(task_id, {}).get('result_json'),
    }

    return TemplateResponse(request, template_name, context)


def task_detail(request, task_id,
                template_name='task-detail.html'):
    context = {
        'task': task_details[task_id],
    }

    return TemplateResponse(request, template_name, context)


def fetch_notifys(request, task_id,
                  template_name='notifys.html'):

    context = {
        'notification': get_notifys_str(),
    }

    return TemplateResponse(request, template_name, context)


def in_progress(request, orig_app_name, task_id,
                template_name='in-progress.html'):
    is_done = task_mng.is_done(task_id)
    if is_done:
        return redirect(reverse('task_result', kwargs={
            'orig_app_name': orig_app_name,
            'task_id': task_id,
        }))

    context = {
        'url_get_notifys': '/writing/fetch-notifys/%s' % task_id,
        'notification': get_notifys_str(),
    }

    return TemplateResponse(request, template_name, context)
