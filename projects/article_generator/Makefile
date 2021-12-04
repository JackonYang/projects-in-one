PY?=python3
PIP?=pip3
DC?=docker-compose

test:
	env `bash load_envs.sh | xargs` PYTHONPATH=.. pytest --cov ./ --cov-report \
		term-missing:skip-covered --capture=no \
		-p no:cacheprovider \
		--cov-fail-under 100


.PHONY: test
