PY?=python3
PIP?=pip3
DC?=docker-compose

setup-private-data:
	bash scripts/private-data/setup-private-data.sh

update-private-data:
	bash scripts/private-data/update-private-data.sh


.PHONY: setup-private-data update-private-data
