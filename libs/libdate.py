from datetime import datetime, timedelta, timezone


def today(hours=8, formatter='%Y-%m-%d'):
    t = datetime.now(timezone(timedelta(hours=hours)))
    return t.strftime(formatter)


def yesterday(hours=8, formatter='%Y-%m-%d'):
    t_today = datetime.now(timezone(timedelta(hours=hours)))
    t = t_today - timedelta(days=1)
    return t.strftime(formatter)


def readable_now(hours=8, formatter='%Y-%m-%d %H:%M:%S'):
    t = datetime.now(timezone(timedelta(hours=hours)))
    return t.strftime(formatter)


if __name__ == '__main__':
    print('today: %s' % today())
    print('yesterday: %s' % yesterday())
    print('readable_now: %s' % readable_now())
