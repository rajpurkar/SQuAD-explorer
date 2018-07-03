cd ../codalab-cli/
./scripts/competitiond.py -v ../SQuAD-explorer/config/codalab-v1.1.json ../SQuAD-explorer/out-v1.1.json
./scripts/competitiond.py -v -l ../SQuAD-explorer/config/codalab-v2.0.json ../SQuAD-explorer/out-v2.0.json
cd ../SQuAD-explorer/
gulp
gulp connect
