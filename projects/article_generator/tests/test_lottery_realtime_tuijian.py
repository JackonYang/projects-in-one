from article_generator.apis import run_article_gen_app

from article_generator.apps.lottery_articles.realtime_tuijian_collection import (
    article_params,
    upload_params,
)

app_name = 'lottery.realtime_tuijian_collection'


def test_lottery_article_ok():
    result = run_article_gen_app(app_name, article_params, upload_params)
    assert isinstance(result, dict)
    # assert 'media_id' in result


def test_lottery_article_with_progress():
    logs = []

    def on_progress(msg, info=None):
        logs.append(msg)

    result = run_article_gen_app(app_name, article_params, upload_params, on_progress)
    assert isinstance(result, dict)
    # assert 'media_id' in result
    # assert len(logs) > 1
