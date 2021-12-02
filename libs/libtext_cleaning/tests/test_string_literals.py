# -*- coding: utf-8 -*-
from libdata_ci.api import (
    use_json_data,
)

from libtext_cleaning.string_literals import (
    remove_extra_literal_escapes,
)


@use_json_data('string_literals.json')
def test_remove_extra_literal_escapes(input_obj, expect):
    assert remove_extra_literal_escapes(input_obj) == expect
