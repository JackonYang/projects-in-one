from wechat_mp_driver.api import upload_articles


def upload_to_wechat_mp(article_list, params_dict):
    converted = [build_mp_upload_args(i) for i in article_list]
    return upload_articles(converted, **params_dict)


def build_mp_upload_args(orig):
    task_info = orig['task_info']
    info_data = orig['info_data']
    content = orig['content']

    data = {
        'title': task_info['title'].format(**info_data),
        'author': '醉风',
        'digest': '想抄的作业，都在这里了',
        'content': content,
        'thumb_media_id': 'kydwHY6c4LpYQ6QJIoazsGOo_hsROPlszVlwLl1SzEQ',
        'show_cover_pic': 0,
        'need_open_comment': 1,
        'only_fans_can_comment': 0,
    }
    return data
