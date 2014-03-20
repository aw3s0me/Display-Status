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

define(["require","exports","module","../../lib/oop","../behaviour/xml","./cstyle","../../token_iterator"],function(e,t,n){function a(e,t){var n=e.type.split(".");return t.split(".").every(function(e){return n.indexOf(e)!==-1})}var r=e("../../lib/oop"),i=e("../behaviour/xml").XmlBehaviour,s=e("./cstyle").CstyleBehaviour,o=e("../../token_iterator").TokenIterator,u=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],f=function(){this.inherit(i),this.add("autoclosing","insertion",function(e,t,n,r,i){if(i==">"){var s=n.getCursorPosition(),f=new o(r,s.row,s.column),l=f.getCurrentToken();if(l&&a(l,"string")&&f.getCurrentTokenColumn()+l.value.length>s.column)return;var c=!1;if(!l||!a(l,"meta.tag")&&(!a(l,"text")||!l.value.match("/"))){do l=f.stepBackward();while(l&&(a(l,"string")||a(l,"keyword.operator")||a(l,"entity.attribute-name")||a(l,"text")))}else c=!0;if(!l||!a(l,"meta.tag.name")||f.stepBackward().value.match("/"))return;var h=l.value;if(c)var h=h.substring(0,s.column-l.start);if(u.indexOf(h)!==-1)return;return{text:"></"+h+">",selection:[1,1]}}})};r.inherits(f,i),t.HtmlBehaviour=f});