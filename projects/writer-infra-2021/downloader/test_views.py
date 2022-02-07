from utils.api_std_check import check_api_std_200


arg_url_demo = 'https://mp.weixin.qq.com/s/dbIccKt5YczwS44XHKazJQ'


def do_submit(client, arg_url):
    response = client.post(
        '/downloader/submit-task',
        {
            'url': arg_url,
        }
    )
    return response


def test_submit_task_400(client):
    response = client.post('/downloader/submit-task')

    assert response.status_code == 200
    rsp_json = response.json()
    check_api_std_200(rsp_json)

    assert rsp_json['errno'] == 400


def test_submit_task_200(client):
    response = do_submit(client, arg_url_demo)

    assert response.status_code == 200
    rsp_json = response.json()
    check_api_std_200(rsp_json)

    assert rsp_json['errno'] == 0

    data = rsp_json['data']
    assert 'task_id' in data


def test_get_result_not_done(client):
    fake_task_id = 100
    url = '/downloader/get-result/%s' % fake_task_id
    response = client.get(url)

    assert response.status_code == 200
    rsp_json = response.json()
    check_api_std_200(rsp_json)

    data = rsp_json['data']

    assert data['task_id'] == fake_task_id
    assert not data['is_done']


def test_get_result_ok(client):
    response = do_submit(client, arg_url_demo)
    rsp_json = response.json()

    task_id = rsp_json['data']['task_id']

    url = '/downloader/get-result/%s' % task_id
    response = client.get(url)

    assert response.status_code == 200
    rsp_json = response.json()
    check_api_std_200(rsp_json)

    data = rsp_json['data']

    assert data['task_id'] == task_id
    assert data['is_done']
    assert len(data['photos']) == 2


def test_get_result_exception(client):
    response = do_submit(client, 'error_url')
    rsp_json = response.json()

    task_id = rsp_json['data']['task_id']

    url = '/downloader/get-result/%s' % task_id
    response = client.get(url)

    assert response.status_code == 200
    rsp_json = response.json()
    check_api_std_200(rsp_json)

    assert rsp_json['errno'] == 2

    data = rsp_json['data']

    assert data['task_id'] == task_id
    assert data['is_done']
    assert len(data['traceback']) > 0
