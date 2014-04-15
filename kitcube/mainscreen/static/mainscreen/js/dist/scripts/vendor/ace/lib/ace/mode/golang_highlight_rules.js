define(["require","exports","module","../lib/oop","./doc_comment_highlight_rules","./text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./doc_comment_highlight_rules").DocCommentHighlightRules,s=e("./text_highlight_rules").TextHighlightRules,o=function(){var e="else|break|case|return|goto|if|const|select|continue|struct|default|switch|for|range|func|import|package|chan|defer|fallthrough|go|interface|map|range|select|type|var",t="string|uint8|uint16|uint32|uint64|int8|int16|int32|int64|float32|float64|complex64|complex128|byte|rune|uint|int|uintptr|bool|error",n="make|close|new|panic|recover",r="nil|true|false|iota",s=this.createKeywordMapper({keyword:e,"constant.language":r,"support.function":n,"support.type":t},"identifier");this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},i.getStartRule("doc-start"),{token:"comment",regex:"\\/\\*",next:"comment"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"[`](?:[^`]*)[`]"},{token:"string",merge:!0,regex:"[`](?:[^`]*)$",next:"bqstring"},{token:"constant.numeric",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))[']"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:s,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^="},{token:"punctuation.operator",regex:"\\?|\\:|\\,|\\;|\\."},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"invalid",regex:"\\s+$"},{token:"text",regex:"\\s+"}],comment:[{token:"comment",regex:".*?\\*\\/",next:"start"},{token:"comment",regex:".+"}],bqstring:[{token:"string",regex:"(?:[^`]*)`",next:"start"},{token:"string",regex:".+"}]},this.embedRules(i,"doc-",[i.getEndRule("start")])};r.inherits(o,s),t.GolangHighlightRules=o});