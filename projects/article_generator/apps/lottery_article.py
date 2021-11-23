"""
一个端到端的应用。
包括：文章撰写、上传
"""
import os
import copy

from libs.libdate import today

from ..pipelines import pipeline_manager
from ..pipelines.image_article_pipe import ImageArticlePipe

from ..uploaders.api import (
    upload_articles,
)


lotterys = [
    {
        'key': 'k8',
    },
    {
        'key': 'ssq',
    },
    {
        'key': '3d',
    },
]


def run(article_params, upload_params):
    tasks = trans_kwargs(article_params, upload_params)
    rendered_articles = pipeline_manager.run(tasks)
    return upload_articles(rendered_articles, **upload_params)


def trans_kwargs(article_params, upload_params):
    tasks = []

    for lottery_info in lotterys:
        l_key = lottery_info['key']

        src_url = article_params.get('url-%s' % l_key, '')
        title = article_params.get('title-%s' % l_key, '')

        if src_url.startswith('http'):  # valid
            tasks.append({
                'pipeline': ImageArticlePipe,
                'template_name': 'lottery-articles/daily-recommend-%s.html' % l_key,
                'task_info': {
                    'article_name': 'art_%s' % l_key,
                    'article_unique_key': 'art_%s_%s' % (l_key, today()),
                    'lottery_key': l_key,
                    'lottery_info': copy.deepcopy(lottery_info),
                    'src_url': src_url,
                    'title': title,
                    'upload_params': upload_params,
                },
            })

    return tasks


def run_test():
    article_params = {
        'title-k8': '快8 专家推荐与走势图汇总-{day}',
        'url-k8': 'https://mp.weixin.qq.com/s/UshvA-Q74vhADjEfu8uHYw',
        'title-ssq': '双色球专家推荐与走势图汇总-{day}',
        'url-ssq': 'test',
        # 'url-ssq': 'https://mp.weixin.qq.com/s/xFFAYqOevmZxIl8LyA5ASg'
        'title-3d': '3D 专家推荐与走势图汇总-{day}',
        'url-3d': 'https://mp.weixin.qq.com/s/fMS5g9ukX9CpTcILWCcRsw'
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
    return run(article_params, upload_params)
