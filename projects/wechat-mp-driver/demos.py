import json
import os

from api import (
    upload_articles,
    test_conn,
)

appid = os.environ.get('WECHAT_MP_APPID', 'default_appid')
secret = os.environ.get('WECHAT_MP_SECRET', 'default_secret')


def demo_upload_articles():
    article_list = [
        {
            'title': 'Jackon Testing 中文',
            'digest': '文章简短摘要的例子',
            'content': '<h1>Welcome</h1>这是内容哦哦哦哦!',
            'thumb_media_id': 'kydwHY6c4LpYQ6QJIoazsGOo_hsROPlszVlwLl1SzEQ',
        },
        {
            'title': '2. Jackon Testing 中文',
            'digest': '2. 文章简短摘要的例子',
            'content': '<h1>Welcome Again</h1>这是内容哦哦哦哦!',
            'thumb_media_id': 'kydwHY6c4LpYQ6QJIoazsO8R5Ofmp_2IfRd1pSHDQjQ',
        },
    ]
    return upload_articles(appid, secret, article_list)


def test_all():
    test_conn(appid, secret)

    result = demo_upload_articles()
    print(json.dumps(result, indent=4, ensure_ascii=False))


if __name__ == '__main__':
    test_all()
