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

define(["require","exports","module","./element_generator","./add_editor_menu_options","./get_set_functions"],function(e,t,n){var r=e("./element_generator"),i=e("./add_editor_menu_options").addEditorMenuOptions,s=e("./get_set_functions").getSetFunctions;n.exports.generateSettingsMenu=function(t){function o(){n.sort(function(e,t){var n=e.getAttribute("contains"),r=t.getAttribute("contains");return n.localeCompare(r)})}function u(){var e=document.createElement("div");return e.setAttribute("id","ace_settingsmenu"),n.forEach(function(t){e.appendChild(t)}),e}function a(e,n,i,s){var o,u=document.createElement("div");return u.setAttribute("contains",i),u.setAttribute("class","ace_optionsMenuEntry"),u.setAttribute("style","clear: both;"),u.appendChild(r.createLabel(i.replace(/^set/,"").replace(/([A-Z])/g," $1").trim(),i)),Array.isArray(s)?(o=r.createSelection(i,s,n),o.addEventListener("change",function(n){try{t.menuOptions[n.target.id].forEach(function(e){e.textContent!==n.target.textContent&&delete e.selected}),e[n.target.id](n.target.value)}catch(r){throw new Error(r)}})):typeof s=="boolean"?(o=r.createCheckbox(i,s,n),o.addEventListener("change",function(t){try{e[t.target.id](!!t.target.checked)}catch(n){throw new Error(n)}})):(o=r.createInput(i,s,n),o.addEventListener("change",function(t){try{t.target.value==="true"?e[t.target.id](!0):t.target.value==="false"?e[t.target.id](!1):e[t.target.id](t.target.value)}catch(n){throw new Error(n)}})),o.style.cssText="float:right;",u.appendChild(o),u}function f(e,n,r,i){var s=t.menuOptions[e],o=n[i]();return typeof o=="object"&&(o=o.$id),s.forEach(function(e){e.value===o&&(e.selected="selected")}),a(n,r,e,s)}function l(e){var r=e.functionName,i=e.parentObj,s=e.parentName,o,u=r.replace(/^set/,"get");if(t.menuOptions[r]!==undefined)n.push(f(r,i,s,u));else if(typeof i[u]=="function")try{o=i[u](),typeof o=="object"&&(o=o.$id),n.push(a(i,s,r,o))}catch(l){}}var n=[];return i(t),s(t).forEach(function(e){l(e)}),o(),u()}});