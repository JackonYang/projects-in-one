import re
import os
import logging

from libs.libmd5 import md5_for_text
from libs.librequests.api import (
    download_text,
    download_binary,
)

logger = logging.getLogger(__name__)

image_url_ptn = re.compile(r'src="(https://mmbiz.qpic.cn/mmbiz_.*?)"')


def download_images(url, output_dir, on_progress_func=None):
    content = download_text(url)
    image_src_urls = image_url_ptn.findall(content)

    image_files = []
    total = len(image_src_urls)
    for idx, url in enumerate(image_src_urls):
        content = download_binary(url)

        if not os.path.exists(output_dir):  # pragma: no cover
            os.makedirs(output_dir)
        url_md5 = md5_for_text(url)
        filename = os.path.join(output_dir, 'img-%03d-url-%s.jpg' % (idx+1, url_md5))
        with open(filename, 'wb') as fw:
            fw.write(content)
        image_files.append(filename)

        logger.info('(%s/%s) downloaded %s' % (idx, total, url))
        if on_progress_func:  # pragma: no cover
            msg = '(%s/%s) 张图片已下载' % (idx+1, total)
            info = {
                'idx': idx+1,
                'total': total,
                'filename': filename,
                'url': url,
            }
            on_progress_func(msg, info)

    return image_files
