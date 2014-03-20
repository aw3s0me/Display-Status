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

define(["require","exports","module","ace/edit_session","ace/undomanager","ace/lib/net","ace/ext/modelist"],function(e,t,n){function a(e,t,n){n.prepare&&(e=n.prepare(e));var s=new r(e);s.setUndoManager(new i),n.session=s,n.path=t,s.name=n.name,n.wrapped&&(s.setUseWrapMode(!0),s.setWrapLimitRange(80,80));var u=o.getModeForPath(t);return s.modeName=u.name,s.setMode(u.mode),s}function f(e){for(var t=0;t<5;t++)e+=e;return e}function v(e){return e.sort(function(e,t){var n=(t.order||0)-(e.order||0);return n||e.name&&e.name.localeCompare(t.name)})}function m(e){var t=[];for(var n in e){var r=e[n];typeof r!="object"&&(r={name:r||n}),r.path=n,r.desc=r.name.replace(/^(ace|docs|demo|build)\//,""),r.desc.length>18&&(r.desc=r.desc.slice(0,7)+".."+r.desc.slice(-9)),u[r.name]=r,t.push(r)}return t}function g(e,t){var n=u[e];if(!n)return t(null);if(n.session)return t(n.session);var r=n.path,i=r.split("/");i[0]=="docs"?r="demo/kitchen-sink/"+r:i[0]=="ace"&&(r="lib/"+r),s.get(r,function(e){a(e,r,n),t(n.session)})}var r=e("ace/edit_session").EditSession,i=e("ace/undomanager").UndoManager,s=e("ace/lib/net"),o=e("ace/ext/modelist"),u={},l={"docs/javascript.js":{order:1,name:"JavaScript"},"docs/latex.tex":{name:"LaTeX",wrapped:!0},"docs/markdown.md":{name:"Markdown",wrapped:!0},"docs/mushcode.mc":{name:"MUSHCode",wrapped:!0},"docs/pgsql.pgsql":{name:"pgSQL",wrapped:!0},"docs/plaintext.txt":{name:"Plain Text",prepare:f,wrapped:!0},"docs/sql.sql":{name:"SQL",wrapped:!0},"docs/textile.textile":{name:"Textile",wrapped:!0},"docs/c9search.c9search_results":"C9 Search Results","docs/mel.mel":"MEL","docs/Nix.nix":"Nix"},c={},h={"build/src/ace.js":"","build/src-min/ace.js":""};o.modes.forEach(function(e){var t=e.extensions.split("|")[0];if(t[0]==="^")n=t.substr(1);else var n=e.name+"."+t;n="docs/"+n,l[n]?typeof l[n]=="object"&&!l[n].name&&(l[n].name=e.caption):l[n]={name:e.caption}});if(window.require&&window.require.s)try{for(var p in window.require.s.contexts._.defined)p.indexOf("!")!=-1?p=p.split("!").pop():p+=".js",c[p]=""}catch(d){}n.exports={fileCache:u,docs:v(m(l)),ownSource:m(c),hugeDocs:m(h),initDoc:a,loadDoc:g},n.exports.all={"Mode Examples":n.exports.docs,"Huge documents":n.exports.hugeDocs,"own source":n.exports.ownSource}});