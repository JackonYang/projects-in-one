from third_party.wechat_mp_driver.api import upload_articles


def upload_to_wechat_mp(article_list, params_dict):
    converted = [build_mp_upload_args(i) for i in article_list]
    return upload_articles(converted, **params_dict)


def build_mp_upload_args(orig):
    data = {
        'title': orig['task_info']['title'],
        'digest': '文章简短摘要的例子',
        'content': orig['content'],
        'thumb_media_id': 'kydwHY6c4LpYQ6QJIoazsGOo_hsROPlszVlwLl1SzEQ',
    }
    return data
