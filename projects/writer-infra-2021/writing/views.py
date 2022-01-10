# -*- coding: utf-8 -*-
import json
import logging
import copy
import os
import time

from concurrent.futures import ThreadPoolExecutor

# from rest_framework.decorators import api_view
# from rest_framework.response import Response

from django.template.response import TemplateResponse
from django.shortcuts import redirect
from django.urls import reverse

from article_generator.apis import run_article_gen_app
from wechat_mp_driver.api import get_drafts

logger = logging.getLogger(__name__)

thread_pool_executor = ThreadPoolExecutor(max_workers=5)

global_vars = {
    'notification-persist': [],
    'notification': '',
    'task_id': 0,
    'task_tmpl_id': 0,
}
task_tmpls = {}

ns_trend_table = 'lottery.trend_table'
ns_tuijian = 'lottery.tuijian_collection'
ns_realtime_tuijian = 'lottery.realtime_tuijian_collection'

app_list = [
    {
        'key': 'tuijian',
        'name': '每日专家推荐大全',
        'description': '每个 URL 一篇文章，最多 3 篇，是一个推送',
    },
    {
        'key': 'zoushitu',
        'name': '福彩体彩走势图大全',
        'description': '一个推送的 2 篇文章。福彩 3 个 URL 一篇，体彩 3 个 URL 一篇。',
    },
    {
        'key': 'shishi-tuijian',
        'name': '实时更新的推荐大全',
        'url': '/writing/copy/shishi-tuijian',
        'description': '',
    },
]

task_args_config_v2 = {

    ns_tuijian: {
        'page_title': '文章生成 -- 每日推荐汇总',
        'mps': [
            'MP1',
            'MP2',
        ],
        'args': {
            '01k8.url_k8': {
                'display': '快8 文章网址',
                'value': '',
                'help': '要填写。今天没开奖就不填写。原文的网址',
            },
            '02ssq.url_ssq': {
                'display': '双色球 文章网址',
                'value': '',
                'help': '要填写。今天没开奖就不填写。原文的网址',
            },
            '03sand.url_3d': {
                'display': '3D 文章网址',
                'value': '',
                'help': '要填写。今天没开奖就不填写。原文的网址',
            },
        },
        'args_order': [
            '01k8.url_k8',
            '02ssq.url_ssq',
            '03sand.url_3d',
        ],
    },
    ns_trend_table: {
        'page_title': '文章生成 -- 走势图大全',
        'mps': [
            'MP2',
        ],
        'args': {
            '01fc.url_dudu-1': {
                'display': '肚肚-福彩 URL',
                'value': '',
                'help': '',
            },
            '01fc.url_dudu-2': {
                'display': '肚肚-快8 URL',
                'value': '',
                'help': '',
            },
            '01fc.url_xiaotian-1': {
                'display': '小田-福彩 URL',
                'value': '',
                'help': '',
            },
            '01fc.url_xiaotian-2': {
                'display': '小田-快8 URL',
                'value': '',
                'help': '',
            },
            '02tc.url_dudu-tc': {
                'display': '肚肚-体彩 URL',
                'value': '',
                'help': '',
            },
            '02tc.url_xiaotian-tc': {
                'display': '小田-体彩 URL',
                'value': '',
                'help': '',
            },
        },
        'args_order': [
            '01fc.url_xiaotian-1',  # 小田
            '01fc.url_xiaotian-2',  # 快 8 走势图
            '02tc.url_xiaotian-tc',  # 小田体彩
            '01fc.url_dudu-1',  # 肚肚
            '02tc.url_dudu-tc',  # 肚肚体彩
            '01fc.url_dudu-2',  # 肚肚快 8
        ],
    },
    ns_realtime_tuijian: {
        'page_title': '文章更新-实时更新的推荐大全',
        'mps': [
            # 'MP1',
            'MP2',
        ],
        'args': {
            'token': {
                'display': '密令',
                'value': '',
                'help': '必须填，联系管理员获取',
            },
            'url1': {
                'display': '文章地址1',
                'value': '',
                'help': '可不填写',
            },
            'url2': {
                'display': '文章地址2',
                'value': '',
                'help': '可不填写',
            },
            'url3': {
                'display': '文章地址3',
                'value': '',
                'help': '可不填写',
            },
            'image_upload': {
                'display': '图片上传',
                'value': '',
                'help': '暂不支持',
            },
        },
        'args_order': [
            'token',
            'url1',
            'url2',
            'url3',
            'image_upload',
        ],
    },
}


def build_common_context():
    for app in app_list:
        if 'url' not in app:
            app['url'] = reverse('app_home', kwargs={
                'orig_app_name': app['key'],
            })
    context = {
        'app_list': app_list,
    }
    return context


class TaskManager():
    task_history = []  # id, only
    task_info = {}
    task_logs = {}  # task_id: log_list
    has_new_logs_map = {}  # task_id: true/false

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

    def add_task_log(self, task_id, msg):
        self.task_logs.setdefault(task_id, [])
        self.task_logs[task_id].append(msg)
        self.has_new_logs_map[task_id] = True

    def has_new_logs(self, task_id):
        return self.has_new_logs_map.get(task_id, False)

    def get_task_logs(self, task_id):
        self.has_new_logs_map[task_id] = False
        return self.task_logs.get(task_id, [])

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
    elif orig == 'shishi-tuijian':
        return ns_realtime_tuijian
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

    context = build_common_context()
    context.update({
        'orig_app_name': orig_app_name,
        'app_name': app_name,
        'task_run_url': reverse('task_run'),
        'page_title': app_config['page_title'],
        'task_args': task_args,
        'notification': get_notifys_str(),
    })

    return TemplateResponse(request, template_name, context)


def re_org_draft_list(draft_list):
    items = draft_list['item']
    articles = []

    for i in items:
        media_id = i['media_id']
        for seq, info in enumerate(i['content']['news_item']):
            ctx = copy.deepcopy(info)
            ctx.update({
                'media_id': media_id,
                'seq': seq + 1,
            })
            articles.append(ctx)
    return articles


def copy_home(request, orig_app_name,
             template_name='copy-home.html'):

    app_name = format_app_name(orig_app_name)
    app_config = task_args_config_v2[app_name]

    drafts = []
    for mp_key in app_config['mps']:
        appid = os.environ.get('WECHAT_MP_APPID_%s' % mp_key, 'default_appid')
        secret = os.environ.get('WECHAT_MP_SECRET_%s' % mp_key, 'default_secret')
        mp_name = os.environ.get('%s_NAME' % mp_key, 'default_name')
        draft_list = re_org_draft_list(get_drafts(appid, secret))
        drafts.append({
            'mp_name': mp_name,
            'draft_list': draft_list,
        })

    task_args = []
    for i in app_config['args_order']:
        t = copy.copy(app_config['args'][i])
        t['key'] = i
        task_args.append(t)

    context = build_common_context()
    context.update({
        'orig_app_name': orig_app_name,
        'app_name': app_name,
        'task_run_url': reverse('task_run'),
        'page_title': app_config['page_title'],
        'task_args': task_args,
        'notification': get_notifys_str(),
        'drafts': drafts,
    })

    return TemplateResponse(request, template_name, context)


def gen_task_id():
    global_vars['task_id'] += 1
    return global_vars['task_id']


def run_single_mp_v2(task_id, mp_key, app_name, task_args_dict):
    def log_func(msg):
        task_mng.add_task_log(task_id, msg)

    mp_name = os.environ.get('%s_NAME' % mp_key, 'default_name')

    logger.info('processing mp: %s, mp_name: %s' % (mp_key, mp_name))
    log_func('开始处理公众号<%s>' % mp_name)

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

    res = run_article_gen_app(app_name, task_args_dict, upload_params, log_func)

    res_str = json.dumps(res, indent=4, ensure_ascii=False)
    log_func('公众号<%s> 完成! 处理结果:' % mp_name)
    log_func(res_str)
    logger.info('done. mp: %s, mp_name: %s, res: %s' % (mp_key, mp_name, res_str))
    return res


def trigger_task_v2(app_name, task_id, task_args_dict):
    app_config = task_args_config_v2[app_name]
    mps = app_config['mps']
    for mp in mps:
        try:
            run_single_mp_v2(task_id, mp, app_name, task_args_dict)
        except Exception:
            logger.exception('run mp %s error' % mp)
            task_mng.add_task_log(task_id, '运行出错，请联系客服，或重试一下')

    task_mng.mark_done(task_id)


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
    task_mng.add_task_log(task_id, '开始运行')
    logger.info('submit task: %s. %s' % (task_id, str(task_args_dict)))
    thread_pool_executor.submit(
        trigger_task_v2, app_name, task_id, task_args_dict)

    return redirect(reverse('in_progress', kwargs={
        'orig_app_name': orig_app_name,
        'task_id': task_id,
    }))


def task_result(request, orig_app_name, task_id,
                template_name='task-result.html'):
    context = build_common_context()
    context.update({
        'run_again_url': reverse('app_home', kwargs={
            'orig_app_name': orig_app_name,
        }),
        'notifys': task_mng.get_task_logs(task_id),
    })

    return TemplateResponse(request, template_name, context)


def task_detail(request, task_id,
                template_name='task-detail.html'):
    context = {
        # 'task': task_details[task_id],
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
    for _ in range(15):
        is_done = task_mng.is_done(task_id)
        if is_done:
            return redirect(reverse('task_result', kwargs={
                'orig_app_name': orig_app_name,
                'task_id': task_id,
            }))

        if task_mng.has_new_logs(task_id):
            context = build_common_context()
            context.update({
                'notifys': task_mng.get_task_logs(task_id),
            })

            return TemplateResponse(request, template_name, context)

        time.sleep(1)

    context = build_common_context()
    context.update({
        'notifys': task_mng.get_task_logs(task_id),
    })

    return TemplateResponse(request, template_name, context)


def task_home(request,
              template_name='task-home.html'):

    context = build_common_context()

    return TemplateResponse(request, template_name, context)
