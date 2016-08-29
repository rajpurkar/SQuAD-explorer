# Dataset Changelog

## v1.1
### Aug 24, 2016
- Fixed misaligned answers such that `answer_start` corresponded to `text`.
- Removed questions marked unanswerable by two or more answer reviewers.
- Fixed answer spans to be whole words, surrounded by space or punctuation characters.
- Fixed evaluation script to improve text normalization before scoring.
- Fixed space issues in answers and contexts.
- Added additional review answers for some questions.

#### Stats (On the development set)
articles: 48
paras: 2067
qs: 10570
as: 34726

## v1.0
### Jun 18, 2016
- First release of dataset

#### Stats (On the development set)
articles: 48
paras: 2067
qs: 10600
as: 33615
