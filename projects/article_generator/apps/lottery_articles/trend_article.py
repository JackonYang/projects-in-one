"""
一个端到端的应用。
包括：文章撰写、上传
"""
import os
import copy

from libs.libdate import today

from ...pipelines import pipeline_manager
from ...pipelines.image_group_pipe import ImageGroupPipe

from ...uploaders.api import (
    upload_articles,
)
from ...configs import resource_dir


image_groups = [
    ['group1', {
        'display': '开奖 公告',
    }],
    ['group-k8', {
        'display': '快8 走势图',
    }],
    ['group-k8h', {
        'display': '快8 走势图-横版',
    }],
    ['group-k8-rotated', {
        'display': '快8 走势图-横屏观看',
    }],
    ['group-k8-long', {
        'display': '快8 走势图-超长版',
    }],
    ['group-ssq', {
        'display': '双色球 走势图',
    }],
    ['group-3d', {
        'display': '3D 走势图',
    }],
    ['group-qlc', {
        'display': '七乐彩 走势图',
    }],
    ['group-dlt', {
        'display': '大乐透',
    }],
    ['group-p3', {
        'display': '排列三',
    }],
    ['group-p5', {
        'display': '排列五',
    }],
    ['group-qxc', {
        'display': '七星彩',
    }],
]


def run(article_params, upload_params, log_func=print):
    tasks = trans_kwargs(article_params, upload_params)
    rendered_articles = pipeline_manager.run(tasks, log_func)
    return upload_articles(rendered_articles, **upload_params)


def split_arg_groups(article_params):
    group_args = {}

    no_group_args = {}

    for k, v in article_params.items():
        if '.' not in k:
            no_group_args[k] = v
        else:
            grp, new_k = k.split('.', 1)
            if grp not in group_args:
                group_args[grp] = {}

            group_args[grp][new_k] = v

    sorted_args = []
    for grp, args in sorted(group_args.items(), key=lambda x: x[0]):
        args['article_name'] = grp
        args['article_unique_key'] = '%s_%s' % (grp, today())
        for k, v in no_group_args.items():
            if k not in args:
                args[k] = v

        sorted_args.append(args)

    return sorted_args


def build_src_urls(article_kwargs):
    prefix = 'url_'
    prefix_len = len(prefix)

    src_urls = []

    for k, v in article_kwargs.items():
        if k.startswith(prefix):
            src_urls.append([k[prefix_len:], v])

    return src_urls


def build_task_info(article_kwargs, upload_params):
    task_info = copy.deepcopy(article_kwargs)
    task_info.update({
        'upload_params': upload_params,
        'src_urls': build_src_urls(article_kwargs),
        'sorted_group_info': image_groups,
    })
    return task_info


def trans_kwargs(article_params, upload_params=None):
    grouped_args = split_arg_groups(article_params)

    tasks = [
        {
            'pipeline': ImageGroupPipe,
            'template_name': 'lottery-articles/fucai-trens.html',
            'task_info': build_task_info(article_kwargs, upload_params),
        } for article_kwargs in grouped_args
    ]

    return tasks


# default params for demo and testing
article_params = {
    '01fc.url_dudu-1': 'https://mp.weixin.qq.com/s/bRjJAy6-J1pMOIPb4Xo7sQ',  # 肚肚
    '01fc.url_dudu-2': 'https://mp.weixin.qq.com/s/nsXV_oZImMViThfCJX2gmA',  # 肚肚快 8
    '01fc.url_xiaotian-1': 'https://mp.weixin.qq.com/s/BysZAKyEXhPxdbT6F_UJVA',  # 小田
    '01fc.url_xiaotian-2': 'https://mp.weixin.qq.com/s/xfzFT3eQoybeYp4KDXaomg',  # 快 8 走势图
    '01fc.title': '福彩走势图 {month} 月 {day} 日更新（{total_image_count} 张图）',
    '01fc.thumb_image': os.path.join(resource_dir, 'trend_article/fc-trend-cover.png'),
    '01fc.show_tuijian_ad': True,

    '02tc.url_dudu-tc': 'https://mp.weixin.qq.com/s/h6-P7S5LwzQvZBQY2WvEiw',  # 肚肚体彩
    '02tc.url_xiaotian-tc': 'https://mp.weixin.qq.com/s/NTjb-rTgQnCgXYkZ9clDNg',  # 小田体彩
    '02tc.title': '体彩走势图 {month} 月 {day} 日更新（{total_image_count} 张图）',
    '02tc.thumb_image': os.path.join(resource_dir, 'trend_article/ticai.png'),
    '02tc.show_tuijian_ad': False,

    'digest': '您的财运 +++500 万！',
}

appid = os.environ.get('WECHAT_MP_APPID', 'default_appid')
secret = os.environ.get('WECHAT_MP_SECRET', 'default_secret')

upload_params = {
    'platform': 'wechat-mp',
    'params_dict': {
        'appid': appid,
        'secret': secret,
    }
}


def run_test():  # pragma: no cover
    return run(article_params, upload_params)
