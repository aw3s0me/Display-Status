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

define(["require","exports","module","../snippets","../autocomplete","../config","../autocomplete/text_completer","../editor","../config"],function(e,t,n){var r=e("../snippets").snippetManager,i=e("../autocomplete").Autocomplete,s=e("../config"),o=e("../autocomplete/text_completer"),u={getCompletions:function(e,t,n,r,i){var s=e.session.getState(n.row),o=t.$mode.getCompletions(s,t,n,r);i(null,o)}},a={getCompletions:function(e,t,n,i,s){var o=r.snippetMap,u=[];r.getActiveScopes(e).forEach(function(e){var t=o[e]||[];for(var n=t.length;n--;){var r=t[n],i=r.name||r.tabTrigger;if(!i)continue;u.push({caption:i,snippet:r.content,meta:r.tabTrigger&&!r.name?r.tabTrigger+"⇥ ":"snippet"})}},this),s(null,u)}},f=[a,o,u];t.addCompleter=function(e){f.push(e)};var l={name:"expandSnippet",exec:function(e){var t=r.expandWithTab(e);t||e.execCommand("indent")},bindKey:"tab"},c=function(e,t){h(t.session.$mode)},h=function(e){var t=e.$id;r.files||(r.files={}),p(t),e.modes&&e.modes.forEach(h)},p=function(e){if(!e||r.files[e])return;var t=e.replace("mode","snippets");r.files[e]={},s.loadModule(t,function(t){t&&(r.files[e]=t,t.snippets=r.parseSnippetFile(t.snippetText),r.register(t.snippets,t.scope),t.includeScopes&&(r.snippetMap[t.scope].includeScopes=t.includeScopes,t.includeScopes.forEach(function(e){p("ace/mode/"+e)})))})},d=e("../editor").Editor;e("../config").defineOptions(d.prototype,"editor",{enableBasicAutocompletion:{set:function(e){e?(this.completers=f,this.commands.addCommand(i.startCommand)):this.commands.removeCommand(i.startCommand)},value:!1},enableSnippets:{set:function(e){e?(this.commands.addCommand(l),this.on("changeMode",c),c(null,this)):(this.commands.removeCommand(l),this.off("changeMode",c))},value:!1}})});