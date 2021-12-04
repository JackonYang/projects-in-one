from .api import download_images


def demo():
    url = 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ'
    output_dir = '/tmp/'
    images = download_images(url, output_dir)

    print('%s images downloaded, saved in %s' % (
        len(images), output_dir
    ))


if __name__ == '__main__':
    demo()
