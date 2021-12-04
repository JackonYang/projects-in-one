from crawlers.wechat_mp_images.api import download_images


def test_download_images_jpg_only():
    url = 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ'
    output_dir = '/tmp/'
    images = download_images(url, output_dir)

    assert len(images) == 2


def test_download_images_ok():
    # png & jpg images
    url = 'https://mp.weixin.qq.com/s/shg2HG7X6d-zQKlpWO9b-Q'
    output_dir = '/tmp/'
    images = download_images(url, output_dir)
    assert len(images) == 6
