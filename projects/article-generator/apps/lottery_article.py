def run(kwargs):
    print(kwargs)
    return {
        'err_no': 0,
        'status': 'ok',
        'kwargs': kwargs,
    }


def run_test():
    kwargs = {
    }
    return run(kwargs)
