from wechatpy import WeChatClient
import requests
import json
import os


def test_conn(appid, secret):
    client = WeChatClient(appid, secret)
    ips = client.misc.get_wechat_ips()
    print('\033[0;32m[INFO]\033[0m Conn success if IP list shows below:')
    print(ips)
    return ips


# https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html
def upload_articles(article_list, appid, secret):
    client = WeChatClient(appid, secret)

    if not isinstance(article_list, (list, tuple)):
        article_list = [article_list]

    url = 'https://api.weixin.qq.com/cgi-bin/draft/add?access_token=' \
        + client.access_token
    rsp = requests.post(
        url=url,
        headers={
            "Content-Type": "application/json;",
        },
        data=json.dumps({
            'articles': article_list,
        }, indent=4, ensure_ascii=False).encode('utf8')
    )
    return rsp.json()


# api: https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/Adding_Permanent_Assets.html
# 上传图文消息内的图片获取URL
# 本接口所上传的图片不占用公众号的素材库中图片数量的100000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。
def upload_local_image_in_article(image_path, appid, secret):
    client = WeChatClient(appid, secret)

    url = 'https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=' \
        + client.access_token
    rsp = requests.post(
        url=url,
        files={
            'media': open(image_path, 'rb'),
        },
    )
    return rsp.json()


# api: https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/Adding_Permanent_Assets.html
# 上传永久图片素材，获取 media id
def add_material_local_image(image_path, appid, secret):
    client = WeChatClient(appid, secret)
    url = 'https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=%s&type=image' % client.access_token
    rsp = requests.post(
        url=url,
        files={
            'media': open(image_path, 'rb'),
            'description': json.dumps({
                "title": os.path.basename(image_path),
                "introduction": 'good',
            }, indent=4, ensure_ascii=False)
        },
    )
    return rsp.json()
