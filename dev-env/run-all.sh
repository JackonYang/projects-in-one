set -e

SCRIPT_PATH=${BASH_SOURCE[0]:-$0}
SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)

pushd $SCRIPT_DIR >> /dev/null

bash git-config.sh

# add to bashrc if not exists
bashrc_file=~/.bashrc
entry_str="source $SCRIPT_DIR/bashrc.sh"

if ! grep -q "$entry_str" $bashrc_file; then
    echo "$entry_str" >> $bashrc_file
fi

echo "please source $bashrc_file manually"
echo "cmd: source $bashrc_file"

popd >> /dev/null

