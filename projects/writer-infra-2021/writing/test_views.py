# from .views import heartbeat

def test_writing_home(client):
    response = client.get('/writing/')

    assert response.status_code == 200


def test_writing_home_redirect(client):
    response = client.get('/writing')

    assert response.status_code == 301


def test_demo_home(client):
    response = client.get('/writing/demo')

    assert response.status_code == 200


def test_fetch_notifys(client):
    response = client.get('/writing/fetch-notifys')

    assert response.status_code == 200
