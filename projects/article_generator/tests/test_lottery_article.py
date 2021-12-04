from article_generator.apps import lottery_article


def test_lottery_article_ok():
    result = lottery_article.run_test()
    print(result)
