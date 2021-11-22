import json

from .apps import lottery_article


def test_all():
    result = lottery_article.run_test()
    print(json.dumps(result, indent=4, ensure_ascii=False))


if __name__ == '__main__':
    test_all()
