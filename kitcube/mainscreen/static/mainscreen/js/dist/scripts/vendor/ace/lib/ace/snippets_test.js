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

typeof process!="undefined"&&require("amd-loader"),define(["require","exports","module","./edit_session","./editor","./test/mockrenderer","./multi_select","./snippets","./test/assertions"],function(e,t,n){var r=e("./edit_session").EditSession,i=e("./editor").Editor,s=e("./test/mockrenderer").MockRenderer,o=e("./multi_select").MultiSelect,u=e("./snippets").snippetManager,a=e("./test/assertions");n.exports={setUp:function(e){this.editor=new i(new s),e()},"test: textmate style format strings":function(){var e=u.tmStrFormat;u.tmStrFormat("hello",{guard:"(..)(.)(.)",flag:"g",fmt:"a\\UO\\l$1\\E$2"})=="aOHElo"},"test: parse snipmate file":function(){var e=[{name:"a",guard:"(?:(=)|(:))?s*)",trigger:"\\(?f",endTrigger:"\\)",endGuard:"",content:"{$0}\n"},{tabTrigger:"f",name:"f function",content:"function"}],t=u.parseSnippetFile("name a\nregex /(?:(=)|(:))?s*)/\\(?f/\\)/\n	{$0}\n	\n\n#function\nsnippet f function\n	function");a.equal(JSON.stringify(e,null,4),JSON.stringify(t,null,4))},"test: parse snippet":function(){var e="-\\$$2a${1:x${$2:y$3\\}\\n\\}$TM_SELECTION}",t=u.tokenizeTmSnippet(e);a.equal(t.length,15),a.equal(t[4],t[14]),a.equal(t[2].tabstopId,2);var e="\\}${var/as\\/d/\\ul\\//g:s}",t=u.tokenizeTmSnippet(e);a.equal(t.length,4),a.equal(t[1],t[3]),a.equal(t[2],"s"),a.equal(t[1].text,"var"),a.equal(t[1].fmt,"\\ul\\/"),a.equal(t[1].guard,"as\\/d"),a.equal(t[1].flag,"g")},"test: expand snippet with nested tabstops":function(){var e="-${1}-${1:1}--${2:2 ${3} 2}-${3:3 $1 3}-${4:4 $2 4}";this.editor.setValue(""),u.insertSnippet(this.editor,e),a.equal(this.editor.getValue(),"-1-1--2 3 1 3 2-3 1 3-4 2 3 1 3 2 4"),a.equal(this.editor.getSelectedText(),"1\n1\n1\n1\n1"),this.editor.tabstopManager.tabNext(),a.equal(this.editor.getSelectedText(),"2 3 1 3 2\n2 3 1 3 2"),this.editor.tabstopManager.tabNext(),a.equal(this.editor.getSelectedText(),"3 1 3\n3 1 3\n3 1 3"),this.editor.tabstopManager.tabNext(),a.equal(this.editor.getSelectedText(),"4 2 3 1 3 2 4"),this.editor.tabstopManager.tabNext(),a.equal(this.editor.getSelectedText(),""),this.editor.setValue(""),u.insertSnippet(this.editor,"-${1:a$2}-${2:b$1}"),a.equal(this.editor.getValue(),"-ab-ba"),a.equal(this.editor.getSelectedText(),"ab\na"),this.editor.tabstopManager.tabNext(),a.equal(this.editor.getSelectedText(),"b\nba"),this.editor.tabstopManager.tabNext(),a.equal(this.editor.getSelectedText(),"")}}}),typeof module!="undefined"&&module===require.main&&require("asyncjs").test.testcase(module.exports).exec();