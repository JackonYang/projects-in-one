"""
一个端到端的应用。
包括：文章撰写、上传
"""
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


def run_download(article_params, on_progress_func=None):
    tasks = trans_kwargs(article_params)
    return pipeline_manager.run_download(tasks, on_progress_func)


def run(article_params, upload_params, on_progress_func=None):
    tasks = trans_kwargs(article_params, upload_params)
    rendered_articles = pipeline_manager.run(tasks, on_progress_func)
    return upload_articles(rendered_articles, **upload_params)


def trans_kwargs(article_params, upload_params=None):
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
                    'thumb_image': article_params.get('thumb_image', ''),
                    'upload_params': upload_params,
                    'mp_info': article_params.get('mp_info', {}),
                },
            })

    return tasks
