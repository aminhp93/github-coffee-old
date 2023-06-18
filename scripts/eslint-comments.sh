#!/bin/bash

count=$(grep -ir "eslint-disable" src/ | wc -l)

echo $count "number of eslint-disable comments"

if [[ $count>1 ]]
then
    echo "Too many eslint-disable comments"
    exit 1
fi
echo "eslint-disable comments are OK"
exit 0
