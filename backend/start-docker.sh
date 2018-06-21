#!/bin/bash

############# change these settings ###################
DEFAULT_SECRET_TOKEN_VALUE=1234 # for development only
DEFAULT_SECRET_REFRESH_TOKEN_VALUE=1234 # for development only
DB_PASSWORD=1234 # for development only
DB_HOST=local.mysql
#######################################################

# all secret stuff and needed ENVs goes here before starting the server
AUTH_SECRET_TOKEN="${DEFAULT_SECRET_TOKEN_VALUE}"

AUTH_SECRET_REFRESH_TOKEN="${DEFAULT_SECRET_REFRESH_TOKEN_VALUE}"

export AUTH_SECRET_TOKEN
export AUTH_SECRET_REFRESH_TOKEN
export DB_PASSWORD
export DB_HOST

export AUTH_ENDPOINT=localhost

########## USER DOCKER FOR MYSQL ####################
#uncomment and adjust following lines
#docker rm -f dns.proxy.server
#docker rm -f local.mysql
#docker run --hostname dns.proxy.server --name dns.proxy.server -p 5380:5380 -v /opt/dns-proxy-server/conf:/app/conf -v /var/run/docker.sock:/var/run/docker.sock -v /etc/resolve.conf:/etc/resolve.conf -d defreitas/dns-proxy-server &&
#docker run --hostname local.mysql --name local.mysql -v $PWD/sql_dump_file.sql:/docker-entrypoint-initdb.d/init.sql:ro -e MYSQL_ROOT_PASSWORD=1234 -d mysql &&
sleep 7
#####################################################

npm run launch
