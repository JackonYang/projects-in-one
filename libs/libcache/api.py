# -*- coding: utf-8 -*-
import hashlib
import os
import pickle


JCACHE_ROOT_DIR = os.getenv('JCACHE_ROOT_DIR', '.jcache-data')


def md5(s):
    m = hashlib.md5()
    m.update(s.encode('utf-8'))
    return m.hexdigest()


def cache_key(f, *args, **kwargs):

    cache_dir = os.path.join(JCACHE_ROOT_DIR, f.__name__)
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)

    s = '%s-%s' % (str(args), str(kwargs))
    return os.path.join(cache_dir, '%s.p' % md5(s))


def jcache(f):
    def wrap(*args, **kwargs):
        fn = cache_key(f, *args, **kwargs)
        if os.path.exists(fn):
            # print('loading jcache')
            with open(fn, 'rb') as fr:
                return pickle.load(fr)

        obj = f(*args, **kwargs)
        with open(fn, 'wb') as fw:
            pickle.dump(obj, fw)
        return obj

    return wrap


@jcache
def add(a, b):  # pragma: no cover
    return a + b


if __name__ == '__main__':
    print(add(3, 4))
    print(add(3, 4))
    print(add(8, 4))
    print(add(4, 8))
