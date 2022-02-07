import logging

from crawlers.wechat_mp_images.api import get_img_urls

logger = logging.getLogger(__name__)


def run_downloader(task_id, task_args_dict):
    assert 'url' in task_args_dict
    url = task_args_dict['url']
    img_urls = get_img_urls(url)

    logger.info('%s images found. task_id=%s, url=%s' % (len(img_urls), task_id, url))
    return img_urls
