from article_generator.apis import run_article_gen_app

from article_generator.apps.lottery_articles.tuijian_collection import (
    article_params,
    upload_params,
)
from article_generator.apps.lottery_articles import tuijian_collection

app_name = 'lottery.tuijian_collection'


def test_lottery_article_ok():
    result = run_article_gen_app(app_name, article_params, upload_params)
    assert 'media_id' in result


def test_lottery_article_with_progress():
    logs = []

    def on_progress(msg, info=None):
        logs.append(msg)

    result = run_article_gen_app(app_name, article_params, upload_params, on_progress)
    assert 'media_id' in result
    assert len(logs) > 1


def test_lottery_article_download():
    result = tuijian_collection.run_download(article_params)

    assert len(result) == 2
    for res in result:
        assert 'info_data' in res
        assert len(res['info_data']['images']) > 0
