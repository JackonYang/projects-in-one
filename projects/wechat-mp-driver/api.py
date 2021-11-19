from wechatpy import WeChatClient
import requests
import json


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
