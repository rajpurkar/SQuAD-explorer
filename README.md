# SQuAD-explorer
The [Stanford Question Answering Dataset](https://stanford-qa.com) is a large reading comprehension dataset.
This repository is intended to let people explore different versions and subsets of the dataset visually.

## From Dataset to Website
We use [gulp](http://gulpjs.com/) to generate a static website from dataset files. This website is hosted on the [gh-pages branch](https://github.com/rajpurkar/SQuAD-explorer/tree/gh-pages).

### Features
- A webpage is generate for each article, with questions laid out next to the context on which they are posed.
When the user hovers on a question, the question words and a corresponding answer is highlighted in the context.
- An index webpage is generated for each dataset file, which lists the articles with a link to their corresponding webpages.
- The dataset files are grouped by the version number (found as the value for the key 'version' in the file contents).
