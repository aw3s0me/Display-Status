/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2013, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(["require","exports","module","../lib/oop","../lib/lang","./html_highlight_rules","./text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("../lib/lang"),s=e("./html_highlight_rules").HtmlHighlightRules,o=e("./text_highlight_rules").TextHighlightRules,u=function(){s.call(this);var e="autoescape|block|do|embed|extends|filter|flush|for|from|if|import|include|macro|sandbox|set|spaceless|use|verbatim";e=e+"|end"+e.replace(/\|/g,"|end");var t="abs|batch|capitalize|convert_encoding|date|date_modify|default|e|escape|first|format|join|json_encode|keys|last|length|lower|merge|nl2br|number_format|raw|replace|reverse|slice|sort|split|striptags|title|trim|upper|url_encode",n="attribute|constant|cycle|date|dump|parent|random|range|template_from_string",r="constant|divisibleby|sameas|defined|empty|even|iterable|odd",i="null|none|true|false",o="b-and|b-xor|b-or|in|is|and|or|not",u=this.createKeywordMapper({"keyword.control.twig":e,"support.function.twig":[t,n,r].join("|"),"keyword.operator.twig":o,"constant.language.twig":i},"identifier");for(var a in this.$rules)this.$rules[a].unshift({token:"variable.other.readwrite.local.twig",regex:"\\{\\{-?",push:"twig-start"},{token:"meta.tag.twig",regex:"\\{%-?",push:"twig-start"},{token:"comment.block.twig",regex:"\\{#-?",push:"twig-comment"});this.$rules["twig-comment"]=[{token:"comment.block.twig",regex:".*-?#\\}",next:"pop"}],this.$rules["twig-start"]=[{token:"variable.other.readwrite.local.twig",regex:"-?\\}\\}",next:"pop"},{token:"meta.tag.twig",regex:"-?%\\}",next:"pop"},{token:"string",regex:"'",next:"twig-qstring"},{token:"string",regex:'"',next:"twig-qqstring"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:u,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator.assignment",regex:"=|~"},{token:"keyword.operator.comparison",regex:"==|!=|<|>|>=|<=|==="},{token:"keyword.operator.arithmetic",regex:"\\+|-|/|%|//|\\*|\\*\\*"},{token:"keyword.operator.other",regex:"\\.\\.|\\|"},{token:"punctuation.operator",regex:/\?|\:|\,|\;|\./},{token:"paren.lparen",regex:/[\[\({]/},{token:"paren.rparen",regex:/[\])}]/},{token:"text",regex:"\\s+"}],this.$rules["twig-qqstring"]=[{token:"constant.language.escape",regex:/\\[\\"$#ntr]|#{[^"}]*}/},{token:"string",regex:'"',next:"twig-start"},{defaultToken:"string"}],this.$rules["twig-qstring"]=[{token:"constant.language.escape",regex:/\\[\\'ntr]}/},{token:"string",regex:"'",next:"twig-start"},{defaultToken:"string"}],this.normalizeRules()};r.inherits(u,o),t.TwigHighlightRules=u});