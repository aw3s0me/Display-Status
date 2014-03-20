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

define(["require","exports","module","../lib/oop","../lib/lang","./css_highlight_rules","./javascript_highlight_rules","./xml_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("../lib/lang"),s=e("./css_highlight_rules").CssHighlightRules,o=e("./javascript_highlight_rules").JavaScriptHighlightRules,u=e("./xml_highlight_rules").XmlHighlightRules,a=i.createMap({a:"anchor",button:"form",form:"form",img:"image",input:"form",label:"form",option:"form",script:"script",select:"form",textarea:"form",style:"style",table:"table",tbody:"table",td:"table",tfoot:"table",th:"table",tr:"table"}),f=function(){u.call(this),this.addRules({attributes:[{include:"space"},{token:"entity.other.attribute-name",regex:"[-_a-zA-Z0-9:]+"},{token:"keyword.operator.separator",regex:"=",push:[{include:"space"},{token:"string",regex:"[^<>='\"`\\s]+",next:"pop"},{token:"empty",regex:"",next:"pop"}]},{include:"string"}],tag:[{token:function(e,t){var n=a[t];return["meta.tag.punctuation.begin","meta.tag.name"+(n?"."+n:"")]},regex:"(<)([-_a-zA-Z0-9:]+)",next:"start_tag_stuff"},{token:function(e,t){var n=a[t];return["meta.tag.punctuation.begin","meta.tag.name"+(n?"."+n:"")]},regex:"(</)([-_a-zA-Z0-9:]+)",next:"end_tag_stuff"}],start_tag_stuff:[{include:"attributes"},{token:"meta.tag.punctuation.end",regex:"/?>",next:"start"}],end_tag_stuff:[{include:"space"},{token:"meta.tag.punctuation.end",regex:">",next:"start"}]}),this.embedTagRules(s,"css-","style"),this.embedTagRules(o,"js-","script"),this.constructor===f&&this.normalizeRules()};r.inherits(f,u),t.HtmlHighlightRules=f});