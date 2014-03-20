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

define(["require","exports","module"],function(e,t,n){n.exports.createOption=function(t){var n,r=document.createElement("option");for(n in t)t.hasOwnProperty(n)&&(n==="selected"?r.setAttribute(n,t[n]):r[n]=t[n]);return r},n.exports.createCheckbox=function(t,n,r){var i=document.createElement("input");return i.setAttribute("type","checkbox"),i.setAttribute("id",t),i.setAttribute("name",t),i.setAttribute("value",n),i.setAttribute("class",r),n&&i.setAttribute("checked","checked"),i},n.exports.createInput=function(t,n,r){var i=document.createElement("input");return i.setAttribute("type","text"),i.setAttribute("id",t),i.setAttribute("name",t),i.setAttribute("value",n),i.setAttribute("class",r),i},n.exports.createLabel=function(t,n){var r=document.createElement("label");return r.setAttribute("for",n),r.textContent=t,r},n.exports.createSelection=function(t,r,i){var s=document.createElement("select");return s.setAttribute("id",t),s.setAttribute("name",t),s.setAttribute("class",i),r.forEach(function(e){s.appendChild(n.exports.createOption(e))}),s}});