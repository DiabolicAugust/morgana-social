name ?= bash

.PHONY: migration-generate test start

migration-generate:
	docker-compose -f docker/docker-compose.yml down -v postgres
	docker-compose -f docker/docker-compose.yml up -d postgres
	npm run build 
	npm run migration:run
	npm run migration:generate docker/migrations/${name}