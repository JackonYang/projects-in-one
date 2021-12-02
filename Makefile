PY?=python3
PIP?=pip3
DC?=docker-compose

setup-private-data:
	bash scripts/private-data/setup-private-data.sh

update-private-data:
	bash scripts/private-data/update-private-data.sh

setup-all:
	find . -name requirements.txt | xargs -I{} pip3 install -r {}

test-all:
	find . -name pytest.ini | xargs -I{} bash scripts/tests/run_test.sh {}

.PHONY: setup-all test-all
.PHONY: setup-private-data update-private-data
