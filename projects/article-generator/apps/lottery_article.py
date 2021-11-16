import json

lotterys = [
    {
        'key': 'k8',
    },
    {
        'key': 'ssq',
    },
    {
        'key': '3d',
    },
]

def run(kwargs):
    tasks = trans_kwargs(kwargs)
    print(json.dumps(tasks, indent=4, ensure_ascii=False))

    return {
        'err_no': 0,
        'status': 'ok',
        'kwargs': kwargs,
    }


def trans_kwargs(kwargs):
    tasks = []

    for l in lotterys:
        l_key = l['key']

        src_url = kwargs.get('url-%s' % l_key, '')
        title = kwargs.get('title-%s' % l_key, '')

        if src_url.startswith('http'):
            # valid
            tasks.append({
                'key': l_key,
                'src_url': src_url,
                'title': title,
            })

    return tasks


def run_test():
    kwargs = {
        'title-k8': '快8 专家推荐与走势图汇总-{{day}}',
        'url-k8': 'https://mp.weixin.qq.com/s/UshvA-Q74vhADjEfu8uHYw',
        'title-ssq': '双色球专家推荐与走势图汇总-{{day}}',
        'url-ssq': 'test',
        # 'url-ssq': 'https://mp.weixin.qq.com/s/xFFAYqOevmZxIl8LyA5ASg'
        'title-3d': '3D 专家推荐与走势图汇总-{{day}}',
        'url-3d': 'https://mp.weixin.qq.com/s/fMS5g9ukX9CpTcILWCcRsw'
    }
    return run(kwargs)
