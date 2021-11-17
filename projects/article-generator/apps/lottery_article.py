"""
一个端到端的应用。
包括：文章撰写、上传
"""
import copy

from pipelines import pipeline_manager
from pipelines.image_article_pipe import ImageArticlePipe

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


def run(kwargs):
    tasks = trans_kwargs(kwargs)
    articles = pipeline_manager.run(tasks)

    # TODO: upload articles
    return articles


def trans_kwargs(kwargs):
    tasks = []

    for lottery_info in lotterys:
        l_key = lottery_info['key']

        src_url = kwargs.get('url-%s' % l_key, '')
        title = kwargs.get('title-%s' % l_key, '')

        if src_url.startswith('http'):  # valid
            tasks.append({
                'pipeline': ImageArticlePipe,
                'template_name': 'trans_nphoton_tmpl.html',
                'task_info': {
                    'lottery_key': l_key,
                    'lottery_info': copy.deepcopy(lottery_info),
                    'src_url': src_url,
                    'title': title,
                },
            })

    return tasks


def run_test():
    kwargs = {
        'title-k8': '快8 专家推荐与走势图汇总-{{day}}',
        'url-k8': 'https://mp.weixin.qq.com/s/UshvA-Q74vhADjEfu8uHYw',
        'title-ssq': '双色球专家推荐与走势图汇总-{{day}}',
        'url-ssq': 'test',
        # 'url-ssq': 'https://mp.weixin.qq.com/s/xFFAYqOevmZxIl8LyA5ASg'
        'title-3d': '3D 专家推荐与走势图汇总-{{day}}',
        'url-3d': 'https://mp.weixin.qq.com/s/fMS5g9ukX9CpTcILWCcRsw'
    }
    return run(kwargs)
