from .wechat_mp_uploader import upload_to_wechat_mp

upload_funcs = {
    'wechat-mp': upload_to_wechat_mp,
}


def upload_articles(article_list, platform, params_dict):
    if platform not in upload_funcs:
        raise ValueError('upload to platform[%s] is not supported' % platform)

    upload_func = upload_funcs[platform]
    return upload_func(article_list, params_dict)
