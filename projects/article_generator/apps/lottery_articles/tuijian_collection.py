"""
一个端到端的应用。
包括：文章撰写、上传
"""
import os

from ...pipelines import pipeline_manager
from ...pipelines.image_group_pipe import ImageGroupPipe

from ...configs import resource_dir


def run_download(article_params, log_func=print):
    return pipeline_manager.run_download(article_params, log_func)


def run(article_params, upload_params, log_func=print):
    return pipeline_manager.run(article_params, upload_params, log_func)


# default params for demo and testing

article_params = {
    '01k8.title': '快8 专家推荐与走势图汇总-{day}',
    '01k8.url_k8': 'https://mp.weixin.qq.com/s/shg2HG7X6d-zQKlpWO9b-Q',
    '01k8.template_name': 'lottery-articles/daily-recommend-k8.html',

    '02ssq.title': '双色球专家推荐与走势图汇总-{day}',
    '02ssq.url_ssq': 'test',
    # '02ssq.url_v2': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
    '02ssq.template_name': 'lottery-articles/daily-recommend-ssq.html',

    '03sand.title': '3D 专家推荐与走势图汇总-{day}',
    '03sand.url_3d': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
    '03sand.template_name': 'lottery-articles/daily-recommend-3d.html',

    'pipeline': ImageGroupPipe,
    'mp_info': 'anything',
    'thumb_image': os.path.join(resource_dir, 'trend_article/fucai-logo.jpg'),
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
