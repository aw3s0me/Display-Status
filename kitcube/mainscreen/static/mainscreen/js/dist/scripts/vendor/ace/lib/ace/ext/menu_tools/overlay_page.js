/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2013 Matthew Christopher Kastor-Inare III, Atropa Inc. Intl
 * All rights reserved.
 *
 * Contributed to Ajax.org under the BSD license.
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

define(["require","exports","module","../../lib/dom","../../requirejs/text!./settings_menu.css"],function(e,t,n){var r=e("../../lib/dom"),i=e("../../requirejs/text!./settings_menu.css");r.importCssString(i),n.exports.overlayPage=function(t,n,i,s,o,u){function l(e){e.keyCode===27&&a.click()}i=i?"top: "+i+";":"",o=o?"bottom: "+o+";":"",s=s?"right: "+s+";":"",u=u?"left: "+u+";":"";var a=document.createElement("div"),f=document.createElement("div");a.style.cssText="margin: 0; padding: 0; position: fixed; top:0; bottom:0; left:0; right:0;z-index: 9990; background-color: rgba(0, 0, 0, 0.3);",a.addEventListener("click",function(){document.removeEventListener("keydown",l),a.parentNode.removeChild(a),t.focus(),a=null}),document.addEventListener("keydown",l),f.style.cssText=i+s+o+u,f.addEventListener("click",function(e){e.stopPropagation()});var c=r.createElement("div");c.style.position="relative";var h=r.createElement("div");h.className="ace_closeButton",h.addEventListener("click",function(){a.click()}),c.appendChild(h),f.appendChild(c),f.appendChild(n),a.appendChild(f),document.body.appendChild(a),t.blur()}});