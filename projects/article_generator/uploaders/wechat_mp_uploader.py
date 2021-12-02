import os

from wechat_mp_driver.api import (
    upload_articles,
    add_material_local_image,
)
from libs.libcache.api import jcache


def upload_to_wechat_mp(article_list, params_dict):
    converted = [build_mp_upload_args(i, params_dict) for i in article_list]
    return upload_articles(converted, **params_dict)


@jcache
def upload_thumb_image(image, appid, secret):
    rsp = add_material_local_image(image, appid, secret)
    return rsp['media_id']


def get_thumb_media_id(thumb_image, params_dict):
    if not os.path.exists(thumb_image):
        return 'kydwHY6c4LpYQ6QJIoazsGOo_hsROPlszVlwLl1SzEQ'

    return upload_thumb_image(thumb_image, **params_dict)


def build_mp_upload_args(orig, params_dict):
    task_info = orig['task_info']
    info_data = orig['info_data']
    content = orig['content']

    data = {
        'title': task_info['title'].format(**info_data),
        'author': '醉风',
        'digest': '想抄的作业，都在这里了',
        'content': content,
        'thumb_media_id': get_thumb_media_id(task_info['thumb_image'], params_dict),
        'show_cover_pic': 0,
        'need_open_comment': 1,
        'only_fans_can_comment': 0,
    }
    return data
