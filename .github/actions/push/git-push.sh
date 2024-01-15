#!/bin/sh

set -e

SOURCE_DIR=$1
DESTINATION_REPO=$2
DESTINATION_DIR=$(basename "$DESTINATION_REPO")
DRY_RUN=$3

GIT_SSH_COMMAND="ssh -v"

echo "SOURCE=$SOURCE_DIR"
echo "DESTINATION=$DESTINATION_REPO"
echo "DRY RUN=$DRY_RUN"

git clone "$DESTINATION_REPO" "$DESTINATION_DIR"
rm -rf "$DESTINATION_DIR"/*
cp -r "$SOURCE_DIR"/* "$DESTINATION_DIR"

cd "$DESTINATION_DIR"
echo "==============================="
ls -l
echo "==============================="

# 检查是否有未跟踪的文件或未提交的更改
if git status --porcelain | grep .; then
    # 有修改，进行 commit
    git config --global user.email "you@example.com"
    git config --global user.name "git actions"
    git add .
    git commit -m "git actions commit"

    if [ "$DRY_RUN" = "true" ]; then
        echo "INFO: Dry Run, no data is pushed"
        git push --dry-run
    else
        git push
    fi
else
    # 没有修改
    echo "Nothing to push"
fi
