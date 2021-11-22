env_file='../../.private-data/wechat_mp_driver.env'

if [ -f "$env_file" ]; then
    env $(cat $env_file | xargs) python3 demos.py
else
    python3 demos.py
fi
