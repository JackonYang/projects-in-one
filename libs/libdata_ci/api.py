import json
import os

DATA_DIR = 'dci-data'

exclude_keys = [
    '#',  # comments
]


def apply_data(data, f, filename=None):
    for tc in data:  # tc is short for testcase
        try:
            if isinstance(tc, dict):
                tc = {k: v for k, v in tc.items() if k not in exclude_keys}
                f(**tc)
            else:
                f(*tc)
        except AssertionError:
            print('AssertionError caused by testcase:\n%s' % json.dumps(tc, indent=4))
            if filename is not None:
                print('in file: %s' % filename)
            raise


def use_data(data):
    def wrapper(f):
        def _func(*args, **kwargs):
            apply_data(data, f)
        return _func
    return wrapper


def use_json_data(filename):
    def wrapper(f):
        def _func(request, *args, **kwargs):
            # request is a feature from pytest
            data_file = os.path.join(request.fspath.dirname, DATA_DIR, filename)

            with open(data_file) as fp:
                try:
                    data = json.load(fp)
                except ValueError:
                    print('Not a valid JSON file: %s' % data_file)
                    raise

            apply_data(data, f, data_file)
        return _func
    return wrapper
