function transform (text) {

  function remove_punc (s) {
    var to_exclude = /[.^/|#*(-=>:;?{&<[!'_+`)@$\]"~\\%},]/g
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

