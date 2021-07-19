# SQuAD-explorer
The [Stanford Question Answering Dataset](https://stanford-qa.com) is a large reading comprehension dataset.
This repository is intended to let people explore the dataset and visualize model predictions.

This website is hosted on the [gh-pages branch](https://github.com/rajpurkar/SQuAD-explorer/tree/gh-pages).

## Testing models on your own data
Here are instructions for generating predictions of a model from the SQuAD leaderboard on custom data. This is done through [CodaLab Worksheets](https://worksheets.codalab.org/).

1. Get the CodaLab UUID for the model you want to run by clicking on its name on the SQuAD leaderboard. For instance, clicking on the original BERT model submitted by Google AI for SQuAD 2.0 takes you to [https://worksheets.codalab.org/bundles/0xbe9df0807151427f92fc306189b6d63e](https://worksheets.codalab.org/bundles/0xbe9df0807151427f92fc306189b6d63e), which tells you that `0xbe9df0807151427f92fc306189b6d63e` is the CodaLab UUID for this submission.

2. Upload your dataset to CodaLab.

3. Use `cl mimic` to mimic the model:

```
cl mimic <official_squad_dev_set_uuid> <model_submission_uuid> <uuid_of_your_dataset>
```

The official SQuAD development set UUIDs are:
* `0x8f29fe78ffe545128caccab74eb06c57` for SQuAD 1.1
* `0xb30d937a18574073903bb38b382aab03` for SQuAD 2.0
