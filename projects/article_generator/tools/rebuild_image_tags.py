import os

from .file_group import FileGroup

from article_generator.configs import (
    donwloaded_images_dir,
    image_pipe_group_data_file,
)


def main():
    image_root_dir = os.path.join(donwloaded_images_dir, 'd6ab9565696a70078b76ca3aa99771e7')
    raw_dir = os.path.join(image_root_dir, 'raw')
    grouped_dir = os.path.join(image_root_dir, 'grouped')

    grouper = FileGroup(image_pipe_group_data_file)
    grouper.do_group(raw_dir, grouped_dir)


if __name__ == '__main__':
    main()
