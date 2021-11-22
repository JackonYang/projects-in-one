cd ..

env_file='../../.private-data/article_generator.env'

if [ -f "$env_file" ]; then
    env $(cat $env_file | xargs) python3 -m article_generator.main
else
    python3 -m article_generator.main
fi
