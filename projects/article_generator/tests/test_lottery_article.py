import os
from article_generator.apps import lottery_article

article_params = {
    'title-k8': '快8 专家推荐与走势图汇总-{day}',
    'url-k8': 'https://mp.weixin.qq.com/s/shg2HG7X6d-zQKlpWO9b-Q',
    'title-ssq': '双色球专家推荐与走势图汇总-{day}',
    'url-ssq': 'test',
    # 'url-ssq': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ'
    'title-3d': '3D 专家推荐与走势图汇总-{day}',
    'url-3d': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ'
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


def test_lottery_article_ok():
    result = lottery_article.run(article_params, upload_params)
    assert 'media_id' in result


def test_lottery_article_with_progress():
    logs = []

    def on_progress(msg, info=None):
        logs.append(msg)

    result = lottery_article.run(article_params, upload_params, on_progress)
    assert 'media_id' in result
    assert len(logs) > 1


def test_lottery_article_download():
    result = lottery_article.run_download(article_params)

    assert len(result) == 2
    for res in result:
        assert 'info_data' in res
        assert len(res['info_data']['images']) > 0
