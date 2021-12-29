from wechatpy import WeChatClient
import requests
import json
import os

from libs.libcache.api import jcache_t


def test_conn(appid, secret):
    client = WeChatClient(appid, secret)
    ips = client.misc.get_wechat_ips()
    print('\033[0;32m[INFO]\033[0m Conn success if IP list shows below:')
    print(ips)
    return ips


def check_rsp_error(rsp_json):
    # {
    #     'errcode': 40164,
    #     'errmsg': 'invalid ip xxx, not in whitelist rid: xxx'
    # }
    if 'errcode' in rsp_json and rsp_json['errcode'] != 0:
        raise ValueError(str(rsp_json))


@jcache_t(3600)
def get_access_token(appid, secret):
    url = 'https://api.weixin.qq.com/cgi-bin/token'
    rsp = requests.get(
        url=url,
        headers={
            "Content-Type": "application/json;",
        },
        params={
            'grant_type': 'client_credential',
            'appid': appid,
            'secret': secret,
        },
        timeout=5,
    )
    rsp_json = rsp.json()
    check_rsp_error(rsp_json)
    return rsp_json['access_token']


# https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html
def upload_articles(article_list, appid, secret):
    if not isinstance(article_list, (list, tuple)):
        article_list = [article_list]

    url = 'https://api.weixin.qq.com/cgi-bin/draft/add?access_token=' \
        + get_access_token(appid, secret)
    rsp = requests.post(
        url=url,
        headers={
            "Content-Type": "application/json;",
        },
        data=json.dumps({
            'articles': article_list,
        }, indent=4, ensure_ascii=False).encode('utf8')
    )
    rsp_json = rsp.json()
    check_rsp_error(rsp_json)
    return rsp_json


# api: https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/Adding_Permanent_Assets.html
# 上传图文消息内的图片获取URL
# 本接口所上传的图片不占用公众号的素材库中图片数量的100000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。
def upload_local_image_in_article(image_path, appid, secret):
    access_token = get_access_token(appid, secret)
    url = 'https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=' \
        + access_token
    rsp = requests.post(
        url=url,
        files={
            'media': open(image_path, 'rb'),
        },
        timeout=5,
    )
    rsp_json = rsp.json()
    check_rsp_error(rsp_json)
    return rsp_json


# api: https://developers.weixin.qq.com/doc/offiaccount/Asset_Management/Adding_Permanent_Assets.html
# 上传永久图片素材，获取 media id
def add_material_local_image(image_path, appid, secret):
    url = 'https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=%s&type=image' % get_access_token(appid, secret)
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
    rsp_json = rsp.json()
    check_rsp_error(rsp_json)
    return rsp_json


def get_images(appid, secret):
    """ return url string """
    url = 'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=' + get_access_token(appid, secret)
    rsp = requests.post(
        url=url,
        headers={
            "Content-Type": "application/json;",
        },
        data=json.dumps({
            "type": "image",
            "count": 20,
            "offset": 0
        })
    )
    rsp_json = rsp.json()
    check_rsp_error(rsp_json)
    return rsp_json


def freepublish(media_id, appid, secret):
    url = 'https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=%s' % get_access_token(appid, secret)
    rsp = requests.post(
        url=url,
        headers={
            "Content-Type": "application/json;",
        },
        data=json.dumps({
            'media_id': media_id,
        }, indent=4, ensure_ascii=False).encode('utf8')
    )
    rsp_json = rsp.json()
    check_rsp_error(rsp_json)
    return rsp_json
