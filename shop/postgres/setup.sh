#!/bin/bash

sudo ./run.sh
PGPASSWORD=pokemon psql -h localhost -U postgres -f postgres/createdb.sql
PGPASSWORD=pokemon psql -h localhost -U shop -d shop -f postgres/insert.sql
