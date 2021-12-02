# -*- coding: utf-8 -*-
import os

from libmd5 import (
    md5_for_file,
    md5_for_text,
)


pdf_filepath = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'test-data/b5ed00e068488d989c2b01ad79b87d02.pdf'
)


def test_md5_for_file():
    assert md5_for_file(pdf_filepath) == 'b5ed00e068488d989c2b01ad79b87d02'
    assert isinstance(md5_for_file(pdf_filepath, hr=False), bytes)


def test_md5_for_text():
    text = 'hello 中文'
    expect = '59304285079e2d7a3f2c30c8eead6179'

    assert md5_for_text(text) == expect
    assert isinstance(md5_for_text(text, hr=False), bytes)
