# -*- coding: utf-8 -*-
import re


_SPACE_CHARACTERS = (r'\s\u0085\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005'
                     r'\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u202f\u205f\u3000')

_CONTINUOUS_SPACE_PTN = re.compile('[%s]+' % _SPACE_CHARACTERS)


def remove_continuous_spaces(s):
    return s and _CONTINUOUS_SPACE_PTN.sub(' ', s.strip())
