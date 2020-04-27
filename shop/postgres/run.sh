#!/bin/bash

docker volume create pgdata
docker run --rm --name shop -e POSTGRES_PASSWORD=pokemon -d -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres
