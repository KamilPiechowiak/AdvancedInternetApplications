#!/bin/bash

psql -h localhost -U shop -d shop -f insert.sql
