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


def run_download(article_params, on_progress_func=None):
    tasks = trans_kwargs(article_params)
    return pipeline_manager.run_download(tasks, on_progress_func)


def run(article_params, upload_params, on_progress_func=None):
    tasks = trans_kwargs(article_params, upload_params)
    rendered_articles = pipeline_manager.run(tasks, on_progress_func)
    return upload_articles(rendered_articles, **upload_params)


def trans_kwargs(article_params, upload_params=None):
    tasks = [
        {
            'pipeline': ImageGroupPipe,
            'template_name': 'lottery-articles/fucai-trens.html',
            'task_info': {
                'article_name': 'art_fucai_trends',
                'article_unique_key': 'art_fucai_trends_%s' % today(),
                'title': article_params.get('title', ''),
                'thumb_image': article_params.get('thumb_image', ''),
                'upload_params': upload_params,
                'mp_info': article_params.get('mp_info', {}),
                'src_urls': article_params['src_urls'],
                'sorted_group_info': article_params['image_groups'],
            },
        }
    ]

    return tasks


def run_test():
    src_urls = [
        ('dudu-1', 'https://mp.weixin.qq.com/s/bRjJAy6-J1pMOIPb4Xo7sQ'),  # 肚肚
        ('dudu-2', 'https://mp.weixin.qq.com/s/nsXV_oZImMViThfCJX2gmA'),  # 肚肚快 8
        ('xiaotian-1', 'https://mp.weixin.qq.com/s/rvWfuF1ieqv1BhE4Dgy33Q'),  # 小田
        ('xiaotian-2', 'https://mp.weixin.qq.com/s/UntGsLoPSPGHD94YTwszTg'),  # 快 8 走势图
    ]
    image_groups = [
        ['group1', {
            'display': '开奖 公告'
        }],
        ['group-k8', {
            'display': '快8 走势图'
        }],
        ['group-k8h', {
            'display': '快8 横版走势图'
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
    article_params = {
        'src_urls': src_urls,
        'title': '福彩走势图 {month} 月 {day} 日更新（{total_image_count} 张图）',
        'digest': '您的财运 +++500 万！',
        'thumb_image': os.path.join(resource_dir, 'trend_article/fucai-logo.jpg'),
        'image_groups': image_groups,
    }
    upload_params = {
        'platform': 'wechat-mp',
        'params_dict': {
            'appid': appid,
            'secret': secret,
        }
    }
    return run(article_params, upload_params)
