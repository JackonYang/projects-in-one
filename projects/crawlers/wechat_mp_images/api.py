import re
import os

from libs.libmd5 import md5_for_text
from libs.librequests.api import (
    download_text,
    download_binary,
)

image_url_ptn = re.compile(r'src="(https://mmbiz.qpic.cn/mmbiz_jpg/.*?)"')


def download_images(url, output_dir):
    content = download_text(url)
    image_src_urls = image_url_ptn.findall(content)

    image_files = []
    for idx, url in enumerate(image_src_urls):
        # print('(%s/%s) download %s' % (idx, len(urls), url))
        content = download_binary(url)

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        url_md5 = md5_for_text(url)
        filename = os.path.join(output_dir, 'img-%s-url-%s.jpg' % (idx+1, url_md5))
        with open(filename, 'wb') as fw:
            fw.write(content)
        image_files.append(filename)

    return image_files
