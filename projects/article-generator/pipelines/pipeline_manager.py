import re


def run(tasks):
    for task in tasks:
        print('run: %s' % task['lottery_key'])

    return []

continuous_spaces = [
    re.compile(r'\s+', re.DOTALL),
]


def clean_spaces(text):
    for ptn in continuous_spaces:
        text = ptn.sub(' ', text)

    return text
