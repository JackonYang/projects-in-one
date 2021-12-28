import time

from libcache.api import (
    jcache,
    jcache_t,
    write_cache,
    write_cache_t,
    cache_key,
    cache_key_t,
    clean_cache,
)


@jcache
def ut_jcache_demo_20211227(a, b):
    return a + b


@jcache_t(10)
def ut_jcache_t_demo_20211227(a, b):
    return a + b


def test_jcache_hit():

    clean_cache(ut_jcache_demo_20211227, 3, 5)

    key = cache_key(ut_jcache_demo_20211227, 3, 5)
    write_cache(key, 9)
    assert ut_jcache_demo_20211227(3, 5) == 9

    clean_cache(ut_jcache_demo_20211227, 3, 5)


def test_jcache_miss():

    clean_cache(ut_jcache_demo_20211227, 3, 5)
    clean_cache(ut_jcache_demo_20211227, 5, 3)

    key = cache_key(ut_jcache_demo_20211227, 3, 5)
    write_cache(key, 9)
    assert ut_jcache_demo_20211227(5, 3) == 8

    clean_cache(ut_jcache_demo_20211227, 3, 5)
    clean_cache(ut_jcache_demo_20211227, 5, 3)


def test_jcache_t_hit():
    clean_cache(ut_jcache_demo_20211227, 3, 5)

    key = cache_key_t(ut_jcache_t_demo_20211227, 3, 5)
    write_cache_t(key, 9)
    assert ut_jcache_t_demo_20211227(3, 5) == 9

    clean_cache(ut_jcache_demo_20211227, 3, 5)


def test_jcache_t_miss():

    clean_cache(ut_jcache_demo_20211227, 3, 5)

    key = cache_key_t(ut_jcache_t_demo_20211227, 3, 5)
    write_cache_t(key, 9, time.time() - 13)
    assert ut_jcache_t_demo_20211227(3, 5) == 8

    clean_cache(ut_jcache_demo_20211227, 5, 3)
