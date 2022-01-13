import os

from ...pipelines.image_group_pipe import ImageGroupPipe


def drop_0(*args, **kwargs):  # pragma: no cover
    return 'valid'


article_params_tmpl = {
    '01k8.title': '快8 专家推荐与走势图汇总 {month} 月 {day} 日更新',
    '01k8.url_k8': '',
    # '01k8.url_k8': 'https://mp.weixin.qq.com/s/shg2HG7X6d-zQKlpWO9b-Q',
    # '01k8.template_name': 'lottery-articles/daily-recommend-k8.html',
    # '01k8.thumb_image': os.path.join(resource_dir, 'trend_article/k8-235x100.jpeg'),

    # '02ssq.title': '双色球专家推荐与走势图汇总 {month} 月 {day} 日更新',
    # '02ssq.url_ssq': '',
    # # '02ssq.url_v2': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
    # '02ssq.template_name': 'lottery-articles/daily-recommend-ssq.html',
    # '02ssq.thumb_image': os.path.join(resource_dir, 'trend_article/ssq-light-1x1.jpeg'),

    # '03sand.title': '3D 专家推荐与走势图汇总 {month} 月 {day} 日更新',
    # '03sand.url_3d': '',
    # # '03sand.url_3d': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
    # '03sand.template_name': 'lottery-articles/daily-recommend-3d.html',
    # '03sand.thumb_image': os.path.join(resource_dir, 'trend_article/3d-zhuangyuan.jpeg'),

    'pipeline': ImageGroupPipe,
    'image_group_alg': drop_0,
    'mp_info': {
        'name': 'anything',
    },
}


def run(article_params, upload_params, log_func=print):
    print('I am runing ----------')
    return {}


article_params = {
    'url_1': 'https://mp.weixin.qq.com/s/shg2HG7X6d-zQKlpWO9b-Q',
    'url_2': 'test',
    # '02ssq.url_v2': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
    'url_3': 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ',
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
