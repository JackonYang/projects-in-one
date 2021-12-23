import os

from article_generator.apis import run_article_gen_app
from article_generator.configs import resource_dir

app_name = 'lottery.trend_table'

article_params = {
    'fc.url_dudu-1': 'https://mp.weixin.qq.com/s/bRjJAy6-J1pMOIPb4Xo7sQ',  # 肚肚
    'fc.url_dudu-2': 'https://mp.weixin.qq.com/s/nsXV_oZImMViThfCJX2gmA',  # 肚肚快 8
    'fc.url_xiaotian-1': 'https://mp.weixin.qq.com/s/BysZAKyEXhPxdbT6F_UJVA',  # 小田
    'fc.url_xiaotian-2': 'https://mp.weixin.qq.com/s/xfzFT3eQoybeYp4KDXaomg',  # 快 8 走势图
    'fc.title': '福彩走势图 {month} 月 {day} 日更新（{total_image_count} 张图）',
    'digest': '您的财运 +++500 万！',
    'fc.thumb_image': os.path.join(resource_dir, 'trend_article/fucai-logo.jpg'),
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


def test_trend_article_ok():
    result = run_article_gen_app(app_name, article_params, upload_params)
    assert 'media_id' in result


def test_trend_article_with_progress():
    logs = []

    def on_progress(msg, info=None):
        logs.append(msg)

    result = run_article_gen_app(app_name, article_params, upload_params, on_progress)
    assert 'media_id' in result
    # assert len(logs) > 1
