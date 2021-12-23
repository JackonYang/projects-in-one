from article_generator.apps.lottery_articles import trend_article
from article_generator.apps import lottery_article

app_mapper = {
    'lottery.trend_table': trend_article,
    'lottery.rec_coll': lottery_article,
}


def run_article_gen_app(app_name, *app_args, **app_kwargs):
    if app_name not in app_mapper:  # pragma: no cover
        raise ValueError('unsupported article_gen_app: %s' % app_name)

    # print('start running app: %s. args: %s, kwargs: %s' % (
    #         app_name, str(app_args), str(app_kwargs)))

    return app_mapper[app_name].run(*app_args, **app_kwargs)
