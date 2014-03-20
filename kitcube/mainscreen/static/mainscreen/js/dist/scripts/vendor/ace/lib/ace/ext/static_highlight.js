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

define(["require","exports","module","../edit_session","../layer/text","../requirejs/text!./static.css","../config","../lib/dom"],function(e,t,n){var r=e("../edit_session").EditSession,i=e("../layer/text").Text,s=e("../requirejs/text!./static.css"),o=e("../config"),u=e("../lib/dom"),a=function(e,t,n){var r=e.className.match(/lang-(\w+)/),i=t.mode||r&&"ace/mode/"+r[1];if(!i)return!1;var s=t.theme||"ace/theme/textmate",o="",f=[];if(e.firstElementChild){var l=0;for(var c=0;c<e.childNodes.length;c++){var h=e.childNodes[c];h.nodeType==3?(l+=h.data.length,o+=h.data):f.push(l,h)}}else o=u.getInnerText(e),t.trim&&(o=o.trim());a.render(o,i,s,t.firstLineNumber,!t.showGutter,function(t){u.importCssString(t.css,"ace_highlight"),e.innerHTML=t.html;var r=e.firstChild.firstChild;for(var i=0;i<f.length;i+=2){var s=t.session.doc.indexToPosition(f[i]),o=f[i+1],a=r.children[s.row];a&&a.appendChild(o)}n&&n()})};a.render=function(e,t,n,i,s,u){function c(){var r=a.renderSync(e,t,n,i,s);return u?u(r):r}var f=0,l=r.prototype.$modes;return typeof n=="string"&&(f++,o.loadModule(["theme",n],function(e){n=e,--f||c()})),typeof t=="string"&&(f++,o.loadModule(["mode",t],function(e){l[t]||(l[t]=new e.Mode),t=l[t],--f||c()})),f||c()},a.renderSync=function(e,t,n,o,u){o=parseInt(o||1,10);var a=new r("");a.setUseWorker(!1),a.setMode(t);var f=new i(document.createElement("div"));f.setSession(a),f.config={characterWidth:10,lineHeight:20},a.setValue(e);var l=[],c=a.getLength();for(var h=0;h<c;h++)l.push("<div class='ace_line'>"),u||l.push("<span class='ace_gutter ace_gutter-cell' unselectable='on'></span>"),f.$renderLine(l,h,!0,!1),l.push("\n</div>");var p="<div class='"+n.cssClass+"'>"+"<div class='ace_static_highlight' style='counter-reset:ace_line "+(o-1)+"'>"+l.join("")+"</div>"+"</div>";return f.destroy(),{css:s+n.cssText,html:p,session:a}},n.exports=a,n.exports.highlight=a});