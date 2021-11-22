env_file='../../.private-data/article-generator.env'

if [ -f "$env_file" ]; then
    env $(cat $env_file | xargs) python3 main.py
else
    python3 main.py
fi
