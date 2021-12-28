import json
import os

from .api import (
    get_access_token,
    upload_articles,
    upload_local_image_in_article,
    test_conn,
    add_material_local_image,
    get_images,
    freepublish,
)

appid = os.environ.get('WECHAT_MP_APPID', 'default_appid')
secret = os.environ.get('WECHAT_MP_SECRET', 'default_secret')

DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'demo-data'
)


def demo_test_conn():
    test_conn(appid, secret)


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
    return upload_articles(article_list, appid, secret)


def demo_upload_local_image_in_article():
    image_path = os.path.join(DATA_DIR, 'image-to-upload.jpg')
    return upload_local_image_in_article(image_path, appid, secret)


def demo_add_material_local_image():
    image_path = os.path.join(DATA_DIR, 'image-to-upload.jpg')
    return add_material_local_image(image_path, appid, secret)


def demo_get_images():
    return get_images(appid, secret)


def demo_get_access_token():
    return get_access_token(appid, secret)


def demo_freepublish():
    media_id = '1UTMnBcBO8mywf144Qg_jAY6CK41onkYXf_0DywRj6Q'
    return freepublish(media_id, appid, secret)


def test_all():
    # result = demo_get_access_token()
    # demo_test_conn()

    # result = demo_upload_articles()

    # result = demo_upload_local_image_in_article()

    # result = demo_add_material_local_image()

    result = demo_get_images()

    # result = demo_freepublish()

    print(json.dumps(result, indent=4, ensure_ascii=False))


if __name__ == '__main__':
    test_all()
