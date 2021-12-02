# -*- coding: utf-8-*-
# import time
import subprocess
import os
import sys


def open_file(filename):
    platform_cmd = {
            'win32': 'start',  # win7 32bit, win7 64bit
            'cygwin': 'start',  # cygwin
            'linux2': 'xdg-open',  # ubuntu 12.04 64bit
            'darwin': 'open',  # Mac
            }
    if sys.platform.startswith('win'):  # windows
        os.startfile(filename)
    else:
        subprocess.call((platform_cmd.get(sys.platform, 'xdg-open'), filename))
