#!/bin/bash
if [ ! -d dataset ]
then
  mkdir dataset
  cd dataset
  wget https://rajpurkar.github.io/SQuAD-explorer/dataset/train-v1.1.json
  wget https://rajpurkar.github.io/SQuAD-explorer/dataset/dev-v1.1.json
fi

if [ ! -d codalab-cli ]
then
  git clone https://github.com/codalab/codalab-cli.git
  cd codalab-cli
  ./setup.sh server
fi
bower install --force
