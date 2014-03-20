/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

define(["require","exports","module","../lib/oop","./html_highlight_rules","./javascript_highlight_rules","../lib/oop","../tokenizer","./html","./javascript","./css","./ruby"],function(e,t,n){var r=e("../lib/oop"),i=e("./html_highlight_rules").HtmlHighlightRules,s=e("./javascript_highlight_rules").JavaScriptHighlightRules,o=function(e,t){i.call(this),e||(e="(?:<%|<\\?|{{)"),t||(t="(?:%>|\\?>|}})");for(var n in this.$rules)this.$rules[n].unshift({token:"markup.list.meta.tag",regex:e+"(?![>}])[-=]?",push:"ejs-start"});this.embedRules(s,"ejs-"),this.$rules["ejs-start"].unshift({token:"markup.list.meta.tag",regex:"-?"+t,next:"pop"},{token:"comment",regex:"//.*?"+t,next:"pop"}),this.$rules["ejs-no_regex"].unshift({token:"markup.list.meta.tag",regex:"-?"+t,next:"pop"},{token:"comment",regex:"//.*?"+t,next:"pop"}),this.normalizeRules()};r.inherits(o,i),t.EjsHighlightRules=o;var r=e("../lib/oop"),u=e("../tokenizer").Tokenizer,a=e("./html").Mode,f=e("./javascript").Mode,l=e("./css").Mode,c=e("./ruby").Mode,h=function(){a.call(this),this.HighlightRules=o,this.createModeDelegates({"js-":f,"css-":l,"ejs-":f})};r.inherits(h,a),function(){this.$id="ace/mode/ejs"}.call(h.prototype),t.Mode=h});