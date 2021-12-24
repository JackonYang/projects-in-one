from article_generator.tools.file_group import FileGroup
from article_generator.configs import image_pipe_group_data_file


def test_image_out_of_range():
    g = FileGroup(image_pipe_group_data_file)
    # make sure no exception
    g.get_file_group('anything', 1)

    g = FileGroup('error')
    g.get_file_group('dudu-1', 'hhhhhh')
