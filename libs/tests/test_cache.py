import os
import shutil

from libcache.api import jcache, JCACHE_ROOT_DIR


@jcache
def ut_jcache_demo_20211227(a, b):
    return a + b


func_cache_dir = os.path.join(JCACHE_ROOT_DIR, 'ut_jcache_demo_20211227')


def test_jcache_hit():

    if os.path.exists(func_cache_dir):
        shutil.rmtree(func_cache_dir)

    assert ut_jcache_demo_20211227(3, 5) == 8

    assert os.path.exists(func_cache_dir)

    assert ut_jcache_demo_20211227(3, 5) == 8

    assert len(os.listdir(func_cache_dir)) == 1


def test_jcache_miss():

    if os.path.exists(func_cache_dir):
        shutil.rmtree(func_cache_dir)

    assert ut_jcache_demo_20211227(3, 5) == 8

    assert os.path.exists(func_cache_dir)

    assert ut_jcache_demo_20211227(5, 3) == 8

    assert len(os.listdir(func_cache_dir)) == 2
