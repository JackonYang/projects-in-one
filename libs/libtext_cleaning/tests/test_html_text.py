# -*- coding: utf-8 -*-
from libdata_ci.api import (
    use_json_data,
)

from libtext_cleaning.html_text import (
    convert_html_to_text,
)


@use_json_data('html-to-text.json')
def test_clean_spaces(input_obj, expect):
    assert convert_html_to_text(input_obj) == expect
