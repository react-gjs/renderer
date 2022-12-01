#!/bin/bash

if [ -z "$(git status --porcelain)" ]; then 
  git pull --rebase
else
  echo "There are uncommited changed, not pulling from remote."
fi