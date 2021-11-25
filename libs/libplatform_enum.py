import sys

PLATFORMS = [
    'linux',  # ubuntu 18.04
    'linux2',  # ubuntu 12.04 64bit
    'win32',  # win7 32bit, win7 64bit
    'cygwin',  # cygwin
    'darwin',  # Mac
]


def demo():
    return sys.platform in PLATFORMS
