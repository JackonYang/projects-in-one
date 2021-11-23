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
    def get_data(self, src_url, article_key, **kwargs):
        image_paths = download_images(
            src_url, os.path.join(donwloaded_images_dir, article_key))
        image_urls = self.upload_images(image_paths[1:-1])
        return {
            'images': image_urls,
        }

    def upload_images(self, image_paths):
        img_urls = []
        for img in image_paths:
            img_url = upload_image_to_mp(
                img, **self.kwargs['upload_params']['params_dict'])
            img_urls.append(img_url)
        return img_urls
