cd ./codalab-cli/
python ./scripts/competitiond.py -v ../config/v1.1.yml ../out-v1.1.json
cd ../
gulp
gulp connect
