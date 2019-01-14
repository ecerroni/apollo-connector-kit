#!/bin/bash

########## USER DOCKER FOR MYSQL ####################
#uncomment and adjust following lines
#docker rm -f dns.proxy.server
#docker rm -f local.mysql
#docker run --hostname dns.proxy.server --name dns.proxy.server -p 5380:5380 -v /opt/dns-proxy-server/conf:/app/conf -v /var/run/docker.sock:/var/run/docker.sock -v /etc/resolve.conf:/etc/resolve.conf -d defreitas/dns-proxy-server &&
#docker run --hostname local.mysql --name local.mysql -v $PWD/sql_dump_file.sql:/docker-entrypoint-initdb.d/init.sql:ro -e MYSQL_ROOT_PASSWORD=1234 -d mysql &&
sleep 7
#####################################################

npm start
