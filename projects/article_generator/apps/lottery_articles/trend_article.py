"""
一个端到端的应用。
包括：文章撰写、上传
"""
import os

from ...pipelines import pipeline_manager
from ...pipelines.image_group_pipe import ImageGroupPipe

from ...configs import resource_dir


def run(article_params, upload_params, log_func=print):
    return pipeline_manager.run(article_params, upload_params, log_func)


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
    'pipeline': ImageGroupPipe,
    'template_name': 'lottery-articles/fucai-trens.html',

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
