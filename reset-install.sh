#!/bin/bash

find . -name 'node_modules' -type d -exec rm -r '{}' \;
find . -name 'package-lock.json' -exec rm -r '{}' \;
find . -name 'yarn.lock' -exec rm -r '{}' \;