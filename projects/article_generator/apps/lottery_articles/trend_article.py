"""
一个端到端的应用。
包括：文章撰写、上传
"""
import os

from libs.libdate import today

from ...pipelines import pipeline_manager
from ...pipelines.image_group_pipe import ImageGroupPipe

from ...uploaders.api import (
    upload_articles,
)
from ...configs import resource_dir

appid = os.environ.get('WECHAT_MP_APPID', 'default_appid')
secret = os.environ.get('WECHAT_MP_SECRET', 'default_secret')

image_groups = [
    ['group1', {
        'display': '开奖 公告'
    }],
    ['group-k8', {
        'display': '快8 走势图'
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
        'display': '双色球 走势图'
    }],
    ['group-3d', {
        'display': '3D 走势图'
    }],
    ['group-qlc', {
        'display': '七乐彩 走势图'
    }],
]


def run(article_params, upload_params, on_progress_func=None):
    tasks = trans_kwargs(article_params, upload_params)
    rendered_articles = pipeline_manager.run(tasks, on_progress_func)
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


def trans_kwargs(article_params, upload_params=None):
    grouped_args = split_arg_groups(article_params)

    tasks = [
        {
            'pipeline': ImageGroupPipe,
            'template_name': 'lottery-articles/fucai-trens.html',
            'task_info': {
                'article_name': 'art_fucai_trends',
                'article_unique_key': 'art_fucai_trends_%s' % today(),
                'title': article_kwargs.get('title', ''),
                'digest': article_kwargs.get('digest', ''),
                'thumb_image': article_kwargs.get('thumb_image', ''),
                'upload_params': upload_params,
                'mp_info': article_kwargs.get('mp_info', {}),
                'src_urls': build_src_urls(article_kwargs),
                'sorted_group_info': image_groups,
            },
        } for article_kwargs in grouped_args
    ]

    return tasks


# default params for demo and testing
article_params = {
    'fc.url_dudu-1': 'https://mp.weixin.qq.com/s/bRjJAy6-J1pMOIPb4Xo7sQ',  # 肚肚
    'fc.url_dudu-2': 'https://mp.weixin.qq.com/s/nsXV_oZImMViThfCJX2gmA',  # 肚肚快 8
    'fc.url_xiaotian-1': 'https://mp.weixin.qq.com/s/BysZAKyEXhPxdbT6F_UJVA',  # 小田
    'fc.url_xiaotian-2': 'https://mp.weixin.qq.com/s/xfzFT3eQoybeYp4KDXaomg',  # 快 8 走势图
    'fc.title': '福彩走势图 {month} 月 {day} 日更新（{total_image_count} 张图）',
    'digest': '您的财运 +++500 万！',
    'fc.thumb_image': os.path.join(resource_dir, 'trend_article/fucai-logo.jpg'),
}

upload_params = {
    'platform': 'wechat-mp',
    'params_dict': {
        'appid': appid,
        'secret': secret,
    }
}


def run_test():  # pragma: no cover
    return run(article_params, upload_params)
