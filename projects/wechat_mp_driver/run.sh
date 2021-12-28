cd ..

env_file='../.private-data/wechat_mp_driver.env'

if [ -f "$env_file" ]; then
    env $(cat $env_file | xargs) python3 -m wechat_mp_driver.demos
else
    python3 demos.py
fi
