import re
import os

from libs.librequests.api import (
    download_text,
    download_binary,
)

from .pipeline_base import PipelineBase
from ..configs import (
    donwloaded_images_dir,
)

image_url_ptn = re.compile(r'src="(https://mmbiz.qpic.cn/mmbiz_jpg/.*?)"')


class ImageArticlePipe(PipelineBase):
    def get_data(self, src_url, article_key, **kwargs):
        content = download_text(src_url)
        m = image_url_ptn.findall(content)
        self.download_images(m, article_key)
        return {}

    def download_images(self, urls, article_key):
        for idx, url in enumerate(urls):
            print('(%s/%s) download %s' % (idx, len(urls), url))
            content = download_binary(url)

            if not os.path.exists(donwloaded_images_dir):
                os.makedirs(donwloaded_images_dir)
            filename = os.path.join(
                donwloaded_images_dir, '%s-%s.jpg' % (article_key, idx+1))
            with open(filename, 'wb') as fw:
                fw.write(content)
