env_file='../../.private-data/chatbot-server.env'

port=8042

if [ -f "$env_file" ]; then
    env $(cat $env_file | xargs) python3 manage.py runserver 0.0.0.0:$port
else
    python3 manage.py runserver 0.0.0.0:$port
fi
