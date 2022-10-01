venv_dir=~/venv-py3.7-ubuntu
# tf1.5 requires python < 3.8
python_version="python3.7"

sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt install -y ${python_version}

# mix_deploy requires python3.7-dev
sudo apt-get install -y python3-pip python3.7-dev python3-virtualenv

# create venv if dir not exists
if [ ! -d ${venv_dir} ]; then
    # virtualenv --system-site-packages -p ${python_version} ${venv_dir}
    virtualenv -p ${python_version} ${venv_dir}
fi

source ${venv_dir}/bin/activate

pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
