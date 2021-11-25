# -*- coding: utf-8 -*-
import re


extra_escape_ptn = re.compile(r'\\{1,2}([\W])')


def remove_extra_literal_escapes(text):
    return text and extra_escape_ptn.sub(r'\1', text)
