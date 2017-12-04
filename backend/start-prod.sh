#!/bin/bash

############# change these settings ###################
SECRET_TOKEN_NAME="${ENV_SECRET1_NAME_HERE}"
SECRET_REFRESH_TOKEN_NAME="${ENV_SECRET2_NAME_HERE}"
#######################################################

# all secret stuff and needed ENVs goes here before starting the server
AUTH_SECRET_TOKEN="${SECRET_TOKEN_NAME}"
AUTH_SECRET_REFRESH_TOKEN="${SECRET_REFRESH_TOKEN_NAME}"

export AUTH_SECRET_TOKEN
export AUTH_SECRET_REFRESH_TOKEN

export AUTH_ENDPOINT=localhost

npm run serve-production
