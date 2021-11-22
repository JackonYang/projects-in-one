import requests

from libs.libcache.api import jcache


@jcache
def download_text(url):
    print('downloading html')
    rsp = requests.get(url)
    return rsp.text


@jcache
def download_binary(url):
    print('download binary')
    rsp = requests.get(url)
    return rsp.content
