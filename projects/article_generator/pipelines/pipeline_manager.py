from ..configs import template_dir


def run(tasks, upload_params):
    articles = []
    for task in tasks:
        pipe_class = task['pipeline']
        template_name = task['template_name']
        task_info = task['task_info']
        articles.append(
            pipe_class(template_dir, template_name, task_info, upload_params=upload_params).run())

    return articles
