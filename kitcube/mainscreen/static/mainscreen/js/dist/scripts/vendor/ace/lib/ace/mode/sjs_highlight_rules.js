/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
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

define(["require","exports","module","../lib/oop","./javascript_highlight_rules","./text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./javascript_highlight_rules").JavaScriptHighlightRules,s=e("./text_highlight_rules").TextHighlightRules,o=function(){var e=new i,t="\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)",n=function(e){return e.isContextAware=!0,e},r=function(e){return{token:e.token,regex:e.regex,next:n(function(t,n){return n.length===0&&n.unshift(t),n.unshift(e.next),e.next})}},s=function(e){return{token:e.token,regex:e.regex,next:n(function(e,t){return t.shift(),t[0]||"start"})}};this.$rules=e.$rules,this.$rules.no_regex=[{token:"keyword",regex:"(waitfor|or|and|collapse|spawn|retract)\\b"},{token:"keyword.operator",regex:"(->|=>|\\.\\.)"},{token:"variable.language",regex:"(hold|default)\\b"},r({token:"string",regex:"`",next:"bstring"}),r({token:"string",regex:'"',next:"qqstring"}),r({token:"string",regex:'"',next:"qqstring"}),{token:["paren.lparen","text","paren.rparen"],regex:"(\\{)(\\s*)(\\|)",next:"block_arguments"}].concat(this.$rules.no_regex),this.$rules.block_arguments=[{token:"paren.rparen",regex:"\\|",next:"no_regex"}].concat(this.$rules.function_arguments),this.$rules.bstring=[{token:"constant.language.escape",regex:t},{token:"string",regex:"\\\\$",next:"bstring"},r({token:"paren.lparen",regex:"\\$\\{",next:"string_interp"}),r({token:"paren.lparen",regex:"\\$",next:"bstring_interp_single"}),s({token:"string",regex:"`"}),{defaultToken:"string"}],this.$rules.qqstring=[{token:"constant.language.escape",regex:t},{token:"string",regex:"\\\\$",next:"qqstring"},r({token:"paren.lparen",regex:"#\\{",next:"string_interp"}),s({token:"string",regex:'"'}),{defaultToken:"string"}];var o=[];for(var u=0;u<this.$rules.no_regex.length;u++){var a=this.$rules.no_regex[u],f=String(a.token);f.indexOf("paren")==-1&&(!a.next||a.next.isContextAware)&&o.push(a)}this.$rules.string_interp=[s({token:"paren.rparen",regex:"\\}"}),r({token:"paren.lparen",regex:"{",next:"string_interp"})].concat(o),this.$rules.bstring_interp_single=[{token:["identifier","paren.lparen"],regex:"(\\w+)(\\()",next:"bstring_interp_single_call"},s({token:"identifier",regex:"\\w*"})],this.$rules.bstring_interp_single_call=[r({token:"paren.lparen",regex:"\\(",next:"bstring_interp_single_call"}),s({token:"paren.rparen",regex:"\\)"})].concat(o)};r.inherits(o,s),t.SJSHighlightRules=o});