function normalize_answer (text) {
  // Lower text and remove punctuation, articles and extra whitespace.

  function remove_punc (s) {
    var to_exclude = /[.^/|#*(\-=>:;?{&<[!'_+`)@$\]"~\\%},]/g
    return s.replace(to_exclude, '')
  }

  function lower (s) {
    return s.toLowerCase(s)
  }

  function remove_articles (s) {
    var to_exclude = /\b(a|an|the)\b/g
    return s.replace(to_exclude, ' ')
  }

  function white_space_fix (s) {
    return s.replace(/\s\s+/g, ' ').trim()
  }

  return white_space_fix(remove_articles(lower(remove_punc(text))))
}

function compute_common (tokens1, tokens2) {
  function counter (tokens) {
    var freqMap = {}
    tokens.forEach(function (w) {
      if (!freqMap[w]) {
        freqMap[w] = 0
      }
      freqMap[w] += 1
    })
    return freqMap
  }

  var counter1 = counter(tokens1)
  var counter2 = counter(tokens2)
  var common = {}
  for (var word in counter1) {
    if (counter2[word]) {
      var min_count = Math.min(counter1[word], counter2[word])
      common[word] = min_count
    }
  }
  return common
}

function f1_score (prediction, ground_truth) {
  if (ground_truth === '') {
    if (prediction === '') {
      return 1.0
    } else {
      return 0.0
    }
  }
  var prediction_tokens = normalize_answer(prediction).split(' ')
  var ground_truth_tokens = normalize_answer(ground_truth).split(' ')
  var common = compute_common(prediction_tokens, ground_truth_tokens)
  var num_same = Object.keys(common).map(function (key) {
    return common[key]
  }).reduce(function (a, b) { return a + b }, 0)
  if (num_same === 0) return 0
  var precision = 1.0 * num_same / prediction_tokens.length
  var recall = 1.0 * num_same / ground_truth_tokens.length
  var f1 = (2 * precision * recall) / (precision + recall)
  return f1
}

function exact_match_score (prediction, ground_truth) {
  if (ground_truth === '') {
    if (prediction === '') {
      return 1.0
    } else {
      return 0.0
    }
  }
  return (normalize_answer(prediction) === normalize_answer(ground_truth))
}

function metric_max_over_ground_truths (metric_fn, prediction, ground_truths) {
  var scores_for_ground_truths = []
  for (var i = 0; i < ground_truths.length; i++) {
    var score = metric_fn(prediction, ground_truths[i])
    scores_for_ground_truths.push(score)
  }
  return Math.max.apply(null, scores_for_ground_truths)
}

function evaluate_on_metrics (prediction, ground_truths) {
  if (ground_truths.length === 0) {
    ground_truths = [''];
  }
  return [
    metric_max_over_ground_truths(exact_match_score, prediction, ground_truths),
    metric_max_over_ground_truths(f1_score, prediction, ground_truths)
  ]
}

window.evaluate_on_metrics = evaluate_on_metrics
