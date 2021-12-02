# -*- coding: utf-8 -*-
import bleach
from html import unescape
# from html.parser import HTMLParser

from .spaces import (
    remove_continuous_spaces,
)

from .string_literals import (
    remove_extra_literal_escapes,
)


# h = HTMLParser()

tags_cleaner = bleach.Cleaner(
    tags=[],
    attributes=[],
    strip=True,
    filters=[]
)


def convert_html_to_text(text, merge_continuous_spaces=True):
    if not text:
        return text

    # clean html entity first
    text = unescape(text)

    text = remove_extra_literal_escapes(text)

    # clean ALL html tags
    text = tags_cleaner.clean(text)

    if merge_continuous_spaces:
        text = remove_continuous_spaces(text)

    return text
