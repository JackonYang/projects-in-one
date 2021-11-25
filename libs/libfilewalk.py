# -*- coding: utf-8-*-
import re
import os


def walk(root, file_hdlr, ext, ignore=None):
    if isinstance(ext, basestring):
        ext = [pat.strip() for pat in ext.rstrip(', ').lower().split(',')]

    def validate_ext(filename):
        filename = filename.lower()
        for item in ext:
            if filename.endswith(item):
                return True
        return False

    def do_ignore(filename):
        return exclude(filename, ignore)
    return _walk(root, file_hdlr, validate_ext, do_ignore)


def _walk(root, file_hdlr, validate_ext, do_ignore):
    # not exists
    if not os.path.exists(root):
        return 0
    root = os.path.abspath(root)

    # file
    if os.path.isfile(root):
        return file_hdlr(src_path)

    file_count = 0
    for path_name in do_ignore(os.listdir(root)):
        abs_path = os.path.join(root, path_name)
        if os.path.isdir(abs_path):
            file_count += _walk(abs_path, file_hdlr, validate_ext, do_ignore)
        elif validate_ext(abs_path):
            file_count += int(file_hdlr(abs_path))
    return file_count


def exclude(files, patterns):
    """remove files that match some of patterns

    @para patterns: list/set/tuple or string separated by ,/os.linesep

    """
    if isinstance(files, basestring):
        files = [files]
    if isinstance(patterns, basestring):
        patterns = [pat.strip() for pat in patterns.rstrip(', ').split(',')]
    if not patterns:
        return files

    re_pat = '(%s)(?ms)' % '|'.join([glob2re(pat) for pat in patterns])
    return [f for f in files if re.compile(re_pat).match(f) is None]

    # translate patterns to re


magic_check = re.compile('[*?[]')


def has_magic(s):
    return magic_check.search(s) is not None


def glob2re(pat):
    str_end = '\Z'
    if not has_magic(pat):
        return pat + str_end
    i, n = 0, len(pat)
    res = ''
    while i < n:
        c = pat[i]
        i = i+1
        if c == '*':
            res = res + '.*'
        elif c == '?':
            res = res + '.'
        elif c == '[':
            j = i
            if j < n and pat[j] == '!':
                j = j+1
            if j < n and pat[j] == ']':
                j = j+1
            while j < n and pat[j] != ']':
                j = j+1
            if j >= n:
                res = res + '\\['
            else:
                stuff = pat[i:j].replace('\\', '\\\\')
                i = j+1
                if stuff[0] == '!':
                    stuff = '^' + stuff[1:]
                elif stuff[0] == '^':
                    stuff = '\\' + stuff
                res = '%s[%s]' % (res, stuff)
        else:
            res = res + re.escape(c)
    return res + str_end

if __name__ == '__main__':

    def demo_file(filename):
        print filename
        return 1

    walk('..', demo_file, '.py', '.git')
