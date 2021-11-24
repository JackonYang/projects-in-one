env_file='../../.private-data/writer-infra-2021.env'

if [ -f "$env_file" ]; then
    env $(cat $env_file | xargs) uwsgi --ini deploy/uwsgi/uwsgi.ini
else
    uwsgi --ini deploy/uwsgi/uwsgi.ini
fi
