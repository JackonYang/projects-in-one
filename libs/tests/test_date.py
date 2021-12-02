# -*- coding: utf-8 -*-
from libdate import (
    today,
    yesterday,
    readable_now,
)


def test_day():
    t_today = today()
    t_yesterday = yesterday()

    # print(t_today, t_yesterday)
    # raise

    formatter = '%Y-%m-%d'  # default

    assert len(t_today) == len(formatter) + 2
    assert len(t_yesterday) == len(formatter) + 2

    assert t_today > t_yesterday


def test_day_formatter():
    formatter = '%Y%m%d'

    t_today = today(formatter=formatter)
    t_yesterday = yesterday(formatter=formatter)

    # print(t_today, t_yesterday)
    # raise

    assert len(t_today) == len(formatter) + 2
    assert len(t_yesterday) == len(formatter) + 2

    assert t_today > t_yesterday


def test_readable_now():

    t1 = readable_now()

    assert len(t1) == len('2019-02-23 21:23:38')

    formatter = '%Y%m%d_%H%M%S'
    t2 = readable_now(formatter=formatter)

    assert len(t2) == len(formatter) + 2
