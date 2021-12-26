import copy
import logging

from ..configs import template_dir
from ..uploaders.api import (
    upload_articles,
)
from libs.libdate import today

logger = logging.getLogger(__name__)


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
    ['valid', {
        'display': 'valid',
    }]
]


def run(article_params, upload_params, log_func=print):
    tasks = trans_kwargs(article_params, upload_params)
    rendered_articles = gen_article(tasks, log_func)
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
        if k.startswith(prefix) and str(v).startswith('http'):  # valid
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
            'pipeline': article_kwargs['pipeline'],
            'template_name': article_kwargs['template_name'],
            'task_info': build_task_info(article_kwargs, upload_params),
        } for article_kwargs in grouped_args
    ]

    valid_tasks = []
    for t in tasks:
        # print(t)
        if len(t['task_info'].get('src_urls', [])) > 0:
            valid_tasks.append(t)
    return valid_tasks


def gen_article(tasks, log_func):
    articles = []
    for task in tasks:
        pipe_class = task['pipeline']
        template_name = task['template_name']
        task_info = task['task_info']
        articles.append(
            pipe_class(template_dir, template_name, task_info).run(log_func))

    return articles


def run_download(article_params, log_func):
    tasks = trans_kwargs(article_params)
    articles = []
    for task in tasks:
        pipe_class = task['pipeline']
        template_name = task['template_name']
        task_info = task['task_info']
        articles.append(
            pipe_class(template_dir, template_name, task_info).run_download(log_func=log_func))

    return articles
