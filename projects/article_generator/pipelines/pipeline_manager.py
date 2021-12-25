from ..configs import template_dir


def run(tasks, log_func):
    articles = []
    for task in tasks:
        pipe_class = task['pipeline']
        template_name = task['template_name']
        task_info = task['task_info']
        articles.append(
            pipe_class(template_dir, template_name, task_info).run(log_func))

    return articles


def run_download(tasks, log_func):
    articles = []
    for task in tasks:
        pipe_class = task['pipeline']
        template_name = task['template_name']
        task_info = task['task_info']
        articles.append(
            pipe_class(template_dir, template_name, task_info).run_download(log_func))

    return articles
