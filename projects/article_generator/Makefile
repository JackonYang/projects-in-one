PY?=python3
PIP?=pip3
DC?=docker-compose


rebuild_image_tags:
	cd .. && python3 -m article_generator.tools.rebuild_image_tags

test:
	env `bash load_envs.sh | xargs` PYTHONPATH=.. pytest --cov ./ --cov-report \
		term-missing:skip-covered --capture=no \
		-p no:cacheprovider \
		--cov-fail-under 100


.PHONY: rebuild_image_tags
.PHONY: test
