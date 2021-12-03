import os

from crawlers.wechat_mp_images.api import download_images
from libs.libmd5 import md5_for_text
from wechat_mp_driver.api import upload_local_image_in_article
from libs.libcache.api import jcache
from libs.libdate import today

from .pipeline_base import PipelineBase
from ..configs import (
    donwloaded_images_dir,
)


@jcache
def upload_image_to_mp(image, appid, secret):
    rsp = upload_local_image_in_article(image, appid, secret)
    if 'url' not in rsp:
        print(rsp)
        raise ValueError('upload error')

    return rsp['url']


class ImageArticlePipe(PipelineBase):
    def get_data(self, src_url, upload_params, **kwargs):
        image_dir = os.path.join(donwloaded_images_dir, md5_for_text(src_url))
        image_paths = download_images(src_url, image_dir)
        image_urls = self.upload_images(image_paths[1:-1], upload_params)
        return {
            'day': today(),
            'images': image_urls,
        }

    def upload_images(self, image_paths, upload_params):
        img_urls = []
        for img in image_paths:
            img_url = upload_image_to_mp(
                img, **upload_params['params_dict'])
            img_urls.append(img_url)
        return img_urls
