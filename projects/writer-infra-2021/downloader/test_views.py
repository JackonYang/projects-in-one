
def test_submit_task(client):
    response = client.post('/downloader/submit-task')

    assert response.status_code == 200


def test_get_result(client):
    response = client.get('/downloader/get-result/1')

    assert response.status_code == 200
