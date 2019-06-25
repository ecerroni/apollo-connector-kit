#! /bin/bash

# all stdio in this script after this line will be sent to the log file
# note that we're appending so that the log file is not overwritten every time this script is called
exec >> log/hooks-out.log 2>&1

if git diff-tree --name-only --no-commit-id ORIG_HEAD HEAD | grep --quiet 'backend/package.json'; then
  echo "[BACKEND] $(date): Running yarn install because package.json changed"
  # redirecting stdout to dev/null trashes quiets the stdout, but it's stderr will go to our log file
  rm -rf _node_modules && rm -rf yarn.lock && rm -rf package-lock.json
  yarn install > /dev/null
else
  echo "[BACKEND ]$(date): No changes in package.json found"
fi