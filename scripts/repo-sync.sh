#!/bin/bash

CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "master" ]; then
  if [ -z "$(git status --porcelain)" ]; then 
    git pull origin master --rebase
  else
    echo "There are uncommited changed, not pulling from remote."
  fi
fi