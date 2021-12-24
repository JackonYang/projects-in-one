import os

project_root = os.path.dirname(
    os.path.abspath(__file__)
)

template_dir = os.path.join(project_root, 'templates')
resource_dir = os.path.join(project_root, 'resources')

output_dir = os.path.join(project_root, 'output-dir')
donwloaded_images_dir = os.path.join(output_dir, 'donwloaded-images')
output_html_dir = os.path.join(output_dir, 'htmls')


# apps related
image_pipe_group_data_file = os.path.join(resource_dir, 'trend_article/group_data.json')
