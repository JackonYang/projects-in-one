import os
import json
import shutil

from libs.libdate import today, get_day, get_month

from crawlers.wechat_mp_images.api import download_images
from wechat_mp_driver.api import upload_local_image_in_article
from libs.libcache.api import jcache
from libs.libmd5 import md5_for_text

from .pipeline_base import PipelineBase
from ..configs import (
    donwloaded_images_dir,
    image_pipe_group_data_file,
)

with open(image_pipe_group_data_file, 'r') as fr:
    groups = json.load(fr)


def tag_image(key, idx):
    unknown = 'unknown'
    if key not in groups:
        return unknown

    return groups[key].get(str(idx), unknown)


def load_images(root):
    data = {}
    for group in os.listdir(root):
        group_path = os.path.join(root, group)
        if not os.path.isdir(group_path):  # pragma: no cover
            continue
        data[group] = []
        for img_path in sorted(os.listdir(group_path)):
            if img_path.startswith('.'):  # pragma: no cover
                continue

            data[group].append(os.path.join(group_path, img_path))

    return data


@jcache
def upload_image_to_mp(image, appid, secret):  # pragma: no cover
    rsp = upload_local_image_in_article(image, appid, secret)
    if 'url' not in rsp:
        print(rsp)
        raise ValueError('upload error')

    return rsp['url']


class ImageGroupPipe(PipelineBase):
    def download_images(self, src_urls, on_progress_func=None, **kwargs):
        image_dir = os.path.join(donwloaded_images_dir, md5_for_text(str(src_urls)), 'raw')

        for name, url in src_urls:
            output_dir = os.path.join(image_dir, name)
            images = download_images(url, output_dir)
            print('%s images downloaded, saved in %s' % (
                len(images), output_dir
            ))

        return image_dir

    def group_image(self, raw_image_dir, output_root):
        for src_group in os.listdir(raw_image_dir):
            if src_group.startswith('.'):  # pragma: no cover
                continue
            group_raw_dir = os.path.join(raw_image_dir, src_group)
            for idx, f in enumerate(sorted(os.listdir(group_raw_dir))):
                if f.startswith('.'):  # pragma: no cover
                    continue
                grp = tag_image(src_group, idx)
                cur_path = os.path.join(group_raw_dir, f)

                out_dir = os.path.join(output_root, grp)
                out_path = os.path.join(output_root, grp, f)

                if not os.path.exists(out_dir):  # pragma: no cover
                    os.makedirs(out_dir)
                shutil.copyfile(cur_path, out_path)

    def get_data(self, src_urls, sorted_group_info, upload_params, on_progress_func=None, **kwargs):
        raw_image_dir = self.download_images(src_urls)

        grouped_image_root = os.path.join(
            os.path.dirname(raw_image_dir), 'grouped'
        )
        self.group_image(raw_image_dir, grouped_image_root)
        image_paths = load_images(grouped_image_root)
        image_urls = {
            g: self.upload_images(paths, upload_params, on_progress_func) for g, paths in image_paths.items()
        }
        images = []
        total_image_count = 0
        for key, info in sorted_group_info:
            images.append(
                {
                    'group_key': key,
                    'group_info': info,
                    'image_urls': image_urls[key],
                }
            )
            total_image_count += len(image_urls[key])
        return {
            'today': today(),
            'day': get_day(),
            'month': get_month(),
            'image_groups': images,
            'total_image_count': total_image_count,
        }

    def upload_images(self, image_paths, upload_params, on_progress_func=None):
        img_urls = []
        total = len(image_paths)
        for idx, img in enumerate(image_paths):
            img_url = upload_image_to_mp(
                img, **upload_params['params_dict'])
            img_urls.append(img_url)
            if on_progress_func:
                on_progress_func('(%s/%s)图片已上传到公众号' % (idx+1, total))
        return img_urls
