#!/bin/bash

############# change these settings ###################
DEFAULT_SECRET_TOKEN_VALUE=1234 # for development only
DEFAULT_SECRET_REFRESH_TOKEN_VALUE=1234 # for development only
DB_PASSWORD=1234 # for development only
DB_HOST=localhost
#######################################################

# all secret stuff and needed ENVs goes here before starting the server
AUTH_SECRET_TOKEN="${DEFAULT_SECRET_TOKEN_VALUE}"

AUTH_SECRET_REFRESH_TOKEN="${DEFAULT_SECRET_REFRESH_TOKEN_VALUE}"

export AUTH_SECRET_TOKEN
export AUTH_SECRET_REFRESH_TOKEN
export DB_PASSWORD
export DB_HOST

export AUTH_ENDPOINT=localhost

npm run launch
