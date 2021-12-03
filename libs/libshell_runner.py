import subprocess
import logging
import os

logger = logging.getLogger(__name__)


def get_cmd_stdout(cmd, log_func=print, check=True, cmd_dir=None, cmd_env=None, quiet=False):
    is_shell = isinstance(cmd, str)

    cmd_str = ' '.join(cmd) if not is_shell else cmd
    if not quiet:
        logger.info('run shell commond. [cmd=%s], [cmd_dir=%s]' % (cmd_str, cmd_dir))

    p = subprocess.Popen(cmd,
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT,
                         shell=is_shell,
                         cwd=cmd_dir,
                         env=cmd_env,
                         )

    output = ""
    # if log_func:
    #   log_func("Start print stdout for bash: ")
    for line in p.stdout:
        line_text = line.rstrip().decode('utf8')
        output += line_text
        output += '\n'
        if log_func:
            log_func(line_text)

    p.communicate()
    returncode = p.returncode

    if check and returncode:
        raise subprocess.CalledProcessError(
            returncode=returncode,
            cmd=cmd_str,
        )
    return output.strip()


def run_cmd_async(cmd, cmd_dir=None, cmd_env=None, quiet=False):
    if not quiet:
        logger.info('async run shell commond. [cmd=%s], [cmd_dir=%s]' % (cmd, cmd_dir))

    return subprocess.Popen(cmd,
                            shell=True,
                            cwd=cmd_dir,
                            env=cmd_env,
                            preexec_fn=os.setpgrp
                            ).pid


# @perf_log
def run_cmd_sync(cmd, log_func=print, check=True, cmd_dir=None, cmd_env=None, quiet=False):
    """run a cmd and log stdout/stderr using the same logger

    @params:
    - cmd: both list and string mode are supported
    """

    # https://docs.python.org/3.7/library/subprocess.html#frequently-used-arguments
    # If you wish to capture and combine both streams into one,
    # use stdout=PIPE and stderr=STDOUT

    is_shell = isinstance(cmd, str)

    cmd_str = ' '.join(cmd) if not is_shell else cmd
    if not quiet:
        logger.info('run sync shell commond. [cmd=%s], [cmd_dir=%s]' % (cmd_str, cmd_dir))

    p = subprocess.Popen(cmd,
                         stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT,
                         shell=is_shell,
                         cwd=cmd_dir,
                         env=cmd_env,
                         )

    log_doc = []

    if log_func:
        log_func("Start print stdout for bash: ")
        for line in iter(p.stdout.readline, b''):
            log_doc.append(line)
            line_text = line.rstrip()
            log_func(line_text)

    # https://docs.python.org/3.7/library/subprocess.html#subprocess.Popen.wait
    # p.wait deadlock when using stdout=PIPE or stderr=PIPE
    # and the child process generates enough output to a pipe
    # such that it blocks waiting for the OS pipe buffer to accept more data.
    # Use Popen.communicate() when using pipes to avoid that.
    p.communicate()

    returncode = p.returncode

    if check and returncode:
        if log_func != print:
            print("Start print stdout for bash: ")
            for line in log_doc:  # if cmd failed, log will print to stdout
                line_text = line.rstrip()
                print(line_text)

        raise subprocess.CalledProcessError(
            returncode=returncode,
            cmd=cmd_str,
        )

    return p.returncode


if __name__ == '__main__':
    print('=== test1 ===')
    try:
        ret = run_cmd_sync(['sh', 'fake_long_running_shell.sh'])
        print('return code: %s' % ret)
    except subprocess.CalledProcessError as e:
        print(e)

    print('=== test2 ===')
    try:
        run_cmd_sync('sh fake_long_running_shell.sh')
    except subprocess.CalledProcessError as e:
        print(e)

    print('=== run without print ===')
    run_cmd_sync('sh fake_long_running_shell.sh', check=False, log_func=None)
    print('=== done ===')
