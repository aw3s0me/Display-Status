define(["require","exports","module","../lib/oop","./text","../tokenizer","./folding/coffee","./space_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text").Mode,s=e("../tokenizer").Tokenizer,o=e("./folding/coffee").FoldMode,u=e("./space_highlight_rules").SpaceHighlightRules,a=function(){var e=new u;this.$tokenizer=new s(e.getRules()),this.foldingRules=new o};r.inherits(a,i),function(){this.$id="ace/mode/space"}.call(a.prototype),t.Mode=a});