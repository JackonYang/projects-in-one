import os

from crawlers.wechat_mp_images.api import download_images
from wechat_mp_driver.api import upload_local_image_in_article
from libs.libcache.api import jcache

from .pipeline_base import PipelineBase
from ..configs import (
    donwloaded_images_dir,
)


@jcache
def upload_image_to_mp(image, appid, secret):
    rsp = upload_local_image_in_article(image, appid, secret)
    return rsp['url']


class ImageArticlePipe(PipelineBase):
    def get_data(self, src_url, article_unique_key, upload_params, **kwargs):
        image_dir = os.path.join(donwloaded_images_dir, article_unique_key)
        image_paths = download_images(src_url, image_dir)
        image_urls = self.upload_images(image_paths[1:-1], upload_params)
        return {
            'images': image_urls,
        }

    def upload_images(self, image_paths, upload_params):
        img_urls = []
        for img in image_paths:
            img_url = upload_image_to_mp(
                img, **upload_params['params_dict'])
            img_urls.append(img_url)
        return img_urls
