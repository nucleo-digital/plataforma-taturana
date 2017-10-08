#!/bin/bash

# Must run every hour from crontab

export TATURANA_CONF_FILE="${HOME}/taturana.conf"
BASE_PATH=$(dirname $(readlink -f $0))
TARGET="${BASE_PATH}/${1}.py"

if [[ -f $TARGET ]];
then
    python $TARGET
    exit $?
else
    echo "Can't find ${1} script."
    exit 1
fi
