import os

from article_generator.apis import run_article_gen_app
from article_generator.configs import resource_dir

from article_generator.apps.lottery_articles.trend_article import (
    article_params,
    upload_params,
)

app_name = 'lottery.trend_table'


def test_trend_article_ok():
    result = run_article_gen_app(app_name, article_params, upload_params)
    assert 'media_id' in result


def test_trend_article_with_progress():
    logs = []

    def on_progress(msg, info=None):
        logs.append(msg)

    result = run_article_gen_app(app_name, article_params, upload_params, on_progress)
    assert 'media_id' in result
    # assert len(logs) > 1
