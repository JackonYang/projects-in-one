import os
import json


class FileGroup():
    def __init__(self, data_file):
        self.data_file = data_file

        if os.path.exists(data_file):
            with open(data_file, 'r') as fr:
                self.group_data = json.load(fr)
        else:
            self.group_data = {}

    def iter_sub_dirs(self, root_dir):
        for subdir in os.listdir(root_dir):
            subdir_path = os.path.join(root_dir, subdir)
            if os.path.isdir(subdir_path):
                yield (subdir, subdir_path)

    def iter_sub_files(self, root_dir):
        for f in os.listdir(root_dir):
            file_path = os.path.join(root_dir, f)
            if os.path.isfile(file_path) and not f.startswith('.'):
                yield (f, file_path)

    def parse_file_feature(self, filename):
        parts = filename.split('-')
        for p in parts:
            if p.isdigit():
                return int(p)

        return filename

    def do_group(self, raw_dir, grouped_dir):
        group_data = {}

        for src_name, src_dir in self.iter_sub_dirs(raw_dir):
            subgroup_data = {}
            for f, file_path in self.iter_sub_files(src_dir):
                # print(idx, f)
                for g in os.listdir(grouped_dir):
                    if os.path.exists(os.path.join(grouped_dir, g, f)):
                        subgroup_data[self.parse_file_feature(f)] = g
                        break

            group_data[src_name] = subgroup_data

        with open(self.data_file, 'w') as fw:
            json.dump(group_data, fw, indent=4, sort_keys=True)

        print('group data saved in: %s' % self.data_file)

    def get_file_group(self, src_name, filename):
        unknown = 'unknown'
        if src_name not in self.group_data:
            return unknown

        file_feature = self.parse_file_feature(filename)

        return self.group_data[src_name].get(file_feature, unknown)
