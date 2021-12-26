ls | grep -v '.md' | grep -v '.sh' | xargs -n 1 -I@ echo '![](@)' >> README.md
