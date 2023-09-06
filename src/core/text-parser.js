import config from './config'
var ESCAPE_RE = /[-.*+?^${}()|[\]\/\\]/g
var BINDING_RE

/*
 *  Escapes a string so that it can be used to construct RegExp
 */
function escapeRegex (val) {
  return val.replace(ESCAPE_RE, '\\$&')
}

export default {
  /*
   *  Parse a piece of text, return an array of tokens
   */
  parse: function (node) {
    var text = node.nodeValue
    if (!BINDING_RE.test(node.nodeValue)) return null
    var m
    var i
    var tokens = []
    do {
      m = text.match(BINDING_RE)
      if (!m) break
      i = m.index
      console.log(i + m[0].length)
      if (i > 0) tokens.push(text.slice(0, i))
      tokens.push({ key: m[1] })
      text = text.slice(i + m[1].length)
    } while (true)
    if (text.length) tokens.push(text)
    return tokens
  },

  /*
   *  Build interpolate tag regex from config settings
   */
  buildRegex: function () {
    var open = escapeRegex(config.interpolateTags.open)
    var close = escapeRegex(config.interpolateTags.close)
    BINDING_RE = new RegExp(open + '(.+?)' + close)
  }
}
