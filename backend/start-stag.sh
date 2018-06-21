#!/bin/bash

############# change these settings ###################
SECRET_TOKEN="${SECRET_TOKEN_VALUE}"
SECRET_REFRESH_TOKEN="${SECRET_REFRESH_TOKEN_VALUE}"
DB_PASSWORD="${DB_PASSWORD_VALUE}"
DB_HOST="${DB_HOST_VALUE}"
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID_VALUE}"
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY_VALUE}"
#######################################################

# all secret stuff and needed ENVs goes here before starting the server
AUTH_SECRET_TOKEN="${SECRET_TOKEN}"
AUTH_SECRET_REFRESH_TOKEN="${SECRET_REFRESH_TOKEN}"

export AUTH_SECRET_TOKEN
export AUTH_SECRET_REFRESH_TOKEN
export DB_PASSWORD
export DB_HOST
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY

export AUTH_ENDPOINT=localhost
npm run serve-staging
