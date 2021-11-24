import hashlib


def md5_for_file(filename, block_size=256*128, hr=True):
    """calculate md5 of a file
    Block size directly depends on the block size of your filesystem
    to avoid performances issues
    Here I have blocks of 4096 octets (Default NTFS)
    """
    md5 = hashlib.md5()
    with open(filename, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size), b''):
            md5.update(chunk)
    if hr:
        return md5.hexdigest()
    return md5.digest()


def md5_for_text(text, hr=True):
    md5 = hashlib.md5()
    md5.update(text.encode('utf8'))
    if hr:
        return md5.hexdigest()
    return md5.digest()


if __name__ == '__main__':
    print(md5_for_file(__file__))
