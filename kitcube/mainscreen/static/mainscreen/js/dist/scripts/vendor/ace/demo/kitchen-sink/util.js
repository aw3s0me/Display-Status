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

define(["require","exports","module","ace/lib/dom","ace/lib/event","ace/edit_session","ace/undomanager","ace/virtual_renderer","ace/editor","ace/multi_select"],function(e,t,n){function l(e,t,n){var i=r.createElement(e);typeof n=="string"?i.appendChild(document.createTextNode(n)):n&&n.forEach(function(e){i.appendChild(e)});for(var s in t)i.setAttribute(s,t[s]);return i}function c(e){return e.map(function(e){return typeof e=="string"&&(e={name:e,caption:e}),l("option",{value:e.value||e.name},e.caption||e.desc)})}function h(e){return Array.isArray(e)?c(e):Object.keys(e).map(function(t){return l("optgroup",{label:t},c(e[t]))})}var r=e("ace/lib/dom"),i=e("ace/lib/event"),s=e("ace/edit_session").EditSession,o=e("ace/undomanager").UndoManager,u=e("ace/virtual_renderer").VirtualRenderer,a=e("ace/editor").Editor,f=e("ace/multi_select").MultiSelect;t.createEditor=function(e){return new a(new u(e))},t.createSplitEditor=function(e){typeof e=="string"&&(e=document.getElementById(e));var t=document.createElement("div"),n=document.createElement("splitter"),r=document.createElement("div");e.appendChild(t),e.appendChild(r),e.appendChild(n),t.style.position=r.style.position=n.style.position="absolute",e.style.position="relative";var s={$container:e};return s.editor0=s[0]=new a(new u(t)),s.editor1=s[1]=new a(new u(r)),s.splitter=n,n.ratio=.5,s.resize=function(){var r=e.parentNode.clientHeight-e.offsetTop,i=e.clientWidth,o=i*n.ratio,u=i*(1-n.ratio);n.style.left=o-1+"px",n.style.height=e.style.height=r+"px";var a=s[0].container.style,f=s[1].container.style;a.width=o+"px",f.width=u+"px",a.left="0px",f.left=o+"px",a.top=f.top="0px",a.height=f.height=r+"px",s[0].resize(),s[1].resize()},s.onMouseDown=function(t){var r=e.getBoundingClientRect(),o=t.clientX,u=t.clientY,a=t.button;if(a!==0)return;var f=function(e){o=e.clientX,u=e.clientY},l=function(e){clearInterval(h)},c=function(){n.ratio=(o-r.left)/r.width,s.resize()};i.capture(n,f,l);var h=setInterval(c,40);return t.preventDefault()},i.addListener(n,"mousedown",s.onMouseDown),i.addListener(window,"resize",s.resize),s.resize(),s},t.stripLeadingComments=function(e){if(e.slice(0,2)=="/*"){var t=e.indexOf("*/")+2;e=e.substr(t)}return e.trim()+"\n"},t.saveOption=function(e,t){if(!e.onchange&&!e.onclick)return;"checked"in e?(t!==undefined&&(e.checked=t),localStorage&&localStorage.setItem(e.id,e.checked?1:0)):(t!==undefined&&(e.value=t),localStorage&&localStorage.setItem(e.id,e.value))},t.bindCheckbox=function(e,n,r){if(typeof e=="string")var i=document.getElementById(e);else{var i=e;e=i.id}var i=document.getElementById(e);localStorage&&localStorage.getItem(e)&&(i.checked=localStorage.getItem(e)=="1");var s=function(){n(!!i.checked),t.saveOption(i)};return i.onclick=s,r||s(),i},t.bindDropdown=function(e,n,r){if(typeof e=="string")var i=document.getElementById(e);else{var i=e;e=i.id}localStorage&&localStorage.getItem(e)&&(i.value=localStorage.getItem(e));var s=function(){n(i.value),t.saveOption(i)};i.onchange=s,r||s()},t.fillDropdown=function(e,t){typeof e=="string"&&(e=document.getElementById(e)),h(t).forEach(function(t){e.appendChild(t)})}});