# SQuAD-explorer
The [Stanford Question Answering Dataset](https://stanford-qa.com) is a large reading comprehension dataset.
This repository is intended to let people explore different versions and subsets of the dataset visually.

## Gulp to generate static site
We use [gulp](http://gulpjs.com/) to generate a static website from dataset files.
A webpage is generate for each article, with questions laid out next to the context on which they are posed.
When the user hovers on a question, the question words and a corresponding answer is highlighted in the context.
