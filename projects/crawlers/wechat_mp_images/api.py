import re
import os
import logging

from concurrent.futures import ThreadPoolExecutor

from libs.libmd5 import md5_for_text
from libs.librequests.api import (
    download_text,
    download_binary,
)

logger = logging.getLogger(__name__)

image_url_ptn = re.compile(r'src="(https://mmbiz.qpic.cn/mmbiz_.*?)"')


def download_images(page_url, output_dir, log_func=print, thread_num=5):
    content = download_text(page_url)
    image_src_urls = image_url_ptn.findall(content)

    image_files = []
    total = len(image_src_urls)
    log_func('开始下载文章图片: %s 图, 并发: %s, 文章 URL: %s' % (
        total, thread_num, page_url))

    thread_pool_executor = ThreadPoolExecutor(max_workers=thread_num)

    futures = {}
    for idx, img_url in enumerate(image_src_urls):
        url_md5 = md5_for_text(img_url)
        filename = 'img-%03d-url-%s.jpg' % (idx+1, url_md5)
        future = thread_pool_executor.submit(
            download_and_save_image, img_url, output_dir, filename)
        futures[idx] = future

    for idx, f in futures.items():
        try:
            fullpath = f.result(timeout=15)
        except Exception:
            logger.warning('failed to download image. idx: %s, article url: %s' % (
                idx, page_url))
        else:
            image_files.append(fullpath)
        # logger.info('(%s/%s) downloaded %s' % (idx, total, url))

    return image_files


def download_and_save_image(url, output_dir, filename):
    content = download_binary(url)

    if not os.path.exists(output_dir):  # pragma: no cover
        os.makedirs(output_dir)
    fullpath = os.path.join(output_dir, filename)
    with open(fullpath, 'wb') as fw:
        fw.write(content)

    return fullpath
