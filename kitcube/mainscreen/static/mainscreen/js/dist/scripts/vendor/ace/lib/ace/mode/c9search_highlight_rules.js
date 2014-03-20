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

define(["require","exports","module","../lib/oop","../lib/lang","./text_highlight_rules"],function(e,t,n){function o(e,t){try{return new RegExp(e,t)}catch(n){}}var r=e("../lib/oop"),i=e("../lib/lang"),s=e("./text_highlight_rules").TextHighlightRules,u=function(){this.$rules={start:[{tokenNames:["c9searchresults.constant.numeric","c9searchresults.text","c9searchresults.text","c9searchresults.keyword"],regex:"(^\\s+[0-9]+)(:\\s)(.+)",onMatch:function(e,t,n){var r=this.splitRegex.exec(e),i=this.tokenNames,s=[{type:i[0],value:r[1]},{type:i[1],value:r[2]}],o=n[1],u=r[3],a,f=0;if(o&&o.exec){o.lastIndex=0;while(a=o.exec(u)){var l=u.substring(f,a.index);f=o.lastIndex,l&&s.push({type:i[2],value:l});if(a[0])s.push({type:i[3],value:a[0]});else if(!l)break}}return f<u.length&&s.push({type:i[2],value:u.substr(f)}),s}},{token:["string","text"],regex:"(\\S.*)(:$)"},{regex:"Searching for .*$",onMatch:function(e,t,n){var r=e.split("");if(r.length<3)return"text";var s,u,a,f=0,l=[{value:r[f++]+"'",type:"text"},{value:u=r[f++],type:"text"},{value:"'"+r[f++],type:"text"}];r[2]!==" in"&&(a=r[f],l.push({value:"'"+r[f++]+"'",type:"text"},{value:r[f++],type:"text"})),l.push({value:" "+r[f++]+" ",type:"text"}),r[f+1]?(s=r[f+1],l.push({value:"("+r[f+1]+")",type:"text"}),f+=1):f-=1;while(f++<r.length)r[f]&&l.push({value:r[f],type:"text"});a&&(u=a,s=""),u&&(/regex/.test(s)||(u=i.escapeRegExp(u)),/whole/.test(s)&&(u="\\b"+u+"\\b"));var c=u&&o("("+u+")",/ sensitive/.test(s)?"g":"ig");return c&&(n[0]=t,n[1]=c),l}},{regex:"\\d+",token:"constant.numeric"}]}};r.inherits(u,s),t.C9SearchHighlightRules=u});