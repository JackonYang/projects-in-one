import os

from .api import download_images

file_dir = os.path.dirname(os.path.abspath(__file__))


def demo():
    url = 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ'
    output_dir = os.path.join(file_dir, 'output-dir')
    images = download_images(url, output_dir)
    print('%s images downloaded, saved in %s' % (
        len(images), output_dir
    ))


if __name__ == '__main__':
    demo()
