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
def upload_image_to_mp(image, appid, secret):  # pragma: no cover
    rsp = upload_local_image_in_article(image, appid, secret)
    if 'url' not in rsp:
        print(rsp)
        raise ValueError('upload error')

    return rsp['url']


class ImageArticlePipe(PipelineBase):
    def download_data(self, src_url, log_func=print, **kwargs):
        image_dir = os.path.join(donwloaded_images_dir, md5_for_text(src_url))
        image_paths = download_images(src_url, image_dir)

        log_func('%s 张图片下载成功。保存地址: %s' % (
                len(image_paths), image_dir
            ))
        return {
            'day': today(),
            'images': image_paths,
        }

    def get_data(self, src_url, upload_params, log_func=print, **kwargs):
        image_dir = os.path.join(donwloaded_images_dir, md5_for_text(src_url))
        image_paths = download_images(src_url, image_dir)
        image_urls = self.upload_images(image_paths[1:-1], upload_params, log_func)
        return {
            'day': today(),
            'images': image_urls,
        }

    def upload_images(self, image_paths, upload_params, log_func=print):
        img_urls = []
        total = len(image_paths)
        for idx, img in enumerate(image_paths):
            img_url = upload_image_to_mp(
                img, **upload_params['params_dict'])
            img_urls.append(img_url)

        log_func('图片全部上传公众号成功。共 %s 张' % total)
        return img_urls
