import os
import json

from article_generator.configs import (
    donwloaded_images_dir,
    image_pipe_group_data_file,
)

def do_group(raw_dir, grouped_dir):
    group_data = {}
    for image_src in os.listdir(raw_dir):
        image_src_dir = os.path.join(raw_dir, image_src)
        if not os.path.isdir(image_src_dir):
            continue
        subgroup_data = {}
        for idx, f in enumerate(sorted(os.listdir(image_src_dir))):
            # print(idx, f)
            for g in os.listdir(grouped_dir):
                if os.path.exists(os.path.join(grouped_dir, g, f)):
                    subgroup_data[idx] = g
                    break

        group_data[image_src] = subgroup_data

    with open(image_pipe_group_data_file, 'w') as fw:
        json.dump(group_data, fw, indent=4, sort_keys=True)


def main():
    image_root_dir = os.path.join(donwloaded_images_dir, '2d09221473b9abc2af52e730d5248b86')
    raw_dir = os.path.join(image_root_dir, 'raw')
    grouped_dir = os.path.join(image_root_dir, 'grouped')
    do_group(raw_dir, grouped_dir)


if __name__ == '__main__':
    main()
