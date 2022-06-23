PY?=python3
PIP?=pip3
DC?=docker-compose

setup-private-data:
	bash scripts/private-data/setup-private-data.sh

update-private-data:
	bash scripts/private-data/update-private-data.sh

update:
	git pull
	git submodule update --init --recursive

setup-all:
	git submodule update --init --recursive
	make setup-private-data | true
	make update-private-data
	find . -name requirements.txt | xargs -I{} pip3 install -r {}

test-all:
	flake8 .
	find . -name pytest.ini | xargs -I{} bash scripts/tests/run_test.sh {}

flake8:
	flake8 .


.PHONY: update
.PHONY: setup-all test-all flake8
.PHONY: setup-private-data update-private-data
