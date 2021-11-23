from jinja2 import Environment, FileSystemLoader
import re
import os

from ..configs import (
    output_html_dir,
)

continuous_spaces = [
    re.compile(r'\s+', re.DOTALL),
]


def clean_spaces(text):
    for ptn in continuous_spaces:
        text = ptn.sub(' ', text)

    return text


class PipelineBase:
    template_dir = None
    task_info = None

    def __init__(self, template_dir, template_name, task_info, **kwargs):
        self.template_dir = template_dir
        self.template_name = template_name
        self.task_info = task_info
        self.kwargs = kwargs

    def run(self):
        data = self.get_data(**self.task_info)
        content = self.render(data)

        if not os.path.exists(output_html_dir):
            os.makedirs(output_html_dir)
        out_filename = os.path.join(
            output_html_dir, '%s.html' % self.task_info['article_key']
        )
        with open(out_filename, 'w') as fw:
            fw.write(content)

        return {
            'task_info': self.task_info,
            'content': content,
        }

    def get_data(self, **kwargs):
        raise NotImplementedError

    def render(self, data, filename=None):
        # output_dir = settings.output_dir
        # if not os.path.exists(output_dir):
        #     os.mkdir(output_dir)

        env = Environment(loader=FileSystemLoader(self.template_dir))
        template = env.get_template(self.template_name)

        # out_filename = os.path.join(output_dir, filename)

        content = template.render(data)

        # if filename:
        #     with codecs.open(out_filename, 'w', 'utf8') as f:
        #         f.write(content)
        #     print('success! saved in %s' % os.path.abspath(out_filename))

        return clean_spaces(content)
