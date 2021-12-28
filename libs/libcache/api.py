# -*- coding: utf-8 -*-
import hashlib
import os
import pickle
import time
from functools import wraps


JCACHE_ROOT_DIR = os.getenv('JCACHE_ROOT_DIR', '.jcache-data')


def md5(s):
    m = hashlib.md5()
    m.update(s.encode('utf-8'))
    return m.hexdigest()


def clean_cache(f, *args, **kwargs):
    key = cache_key(f, *args, **kwargs)
    if os.path.exists(key):
        os.remove(key)


def cache_key(f, *args, **kwargs):

    cache_dir = os.path.join(JCACHE_ROOT_DIR, f.__name__)
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)

    s = '%s-%s' % (str(args), str(kwargs))
    return os.path.join(cache_dir, '%s.p' % md5(s))


def write_cache(filename, obj):
    # print(filename)
    with open(filename, 'wb') as fw:
        pickle.dump(obj, fw)


def jcache(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        fn = cache_key(f, *args, **kwargs)
        if os.path.exists(fn):
            # print('loading jcache. key: %s' % fn)
            with open(fn, 'rb') as fr:
                return pickle.load(fr)

        obj = f(*args, **kwargs)
        write_cache(fn, obj)
        return obj

    return wrapper


def cache_key_t(f, *args, **kwargs):

    cache_dir = os.path.join(JCACHE_ROOT_DIR, f.__name__)
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)

    s = '%s-%s' % (str(args), str(kwargs))
    return os.path.join(cache_dir, 'cache_t_%s.p' % md5(s))


def write_cache_t(filename, obj, t=None):
    t = t or time.time()
    # print(filename)
    with open(filename, 'wb') as fw:
        pickle.dump([t, obj], fw)


def jcache_t(period):
    def _wrap(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            now = time.time()
            fn = cache_key_t(f, *args, **kwargs)
            if os.path.exists(fn):
                # print('loading jcache_t, key: %s' % fn)
                with open(fn, 'rb') as fr:
                    t, data = pickle.load(fr)
                    # print(now, t, period, now - t, data)
                    if now - t < period:
                        return data

            obj = f(*args, **kwargs)
            write_cache_t(fn, obj)
            return obj

        return wrapper
    return _wrap


@jcache_t(10)
def add(a, b):  # pragma: no cover
    return a + b


# if __name__ == '__main__':
#     print(add(3, 4))
#     print(add(3, 4))
#     print(add(8, 4))
#     print(add(4, 8))
