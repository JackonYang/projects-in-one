from libdata_ci.api import (
    use_data,
    use_json_data,
)


data_simple_2_kwargs = (
    {
        'input_obj': 'hello',
        'expect': 'world',
    },
    {
        'input_obj': 'hello',
        'expect': 666,
    },
)


def test_basic_func():
    got = []

    @use_data(data_simple_2_kwargs)
    def merge(input_obj, expect):
        got.append('%s--%s' % (input_obj, expect))

    merge()

    expect = [
        '%s--%s' % (i['input_obj'], i['expect']) for i in data_simple_2_kwargs
    ]

    assert got == expect


def test_basic_func_json(request):
    got = []

    @use_json_data('data_simple_2_kwargs.json')
    def merge(input_obj, expect):
        got.append('%s--%s' % (input_obj, expect))

    merge(request)

    expect = [
        '%s--%s' % (i['input_obj'], i['expect']) for i in data_simple_2_kwargs
    ]

    assert got == expect


data_comment_kwargs = (
    {
        '#': 'this is a class A record',
        'input_obj': 'hello',
        'expect': 'world',
    },
    {
        '#': 'this is a class B record',
        'input_obj': 'hello',
        'expect': 666,
    },
)


def test_comment_func():
    got = []

    @use_data(data_comment_kwargs)
    def merge(input_obj, expect):
        got.append('%s--%s' % (input_obj, expect))

    merge()

    expect = [
        '%s--%s' % (i['input_obj'], i['expect']) for i in data_simple_2_kwargs
    ]

    assert got == expect


def taaest_comment_func_json():
    got = []

    @use_json_data('data_comment_kwargs.json')
    def merge(input_obj, expect):
        got.append('%s--%s' % (input_obj, expect))

    merge()

    expect = [
        '%s--%s' % (i['input_obj'], i['expect']) for i in data_simple_2_kwargs
    ]

    assert got == expect
