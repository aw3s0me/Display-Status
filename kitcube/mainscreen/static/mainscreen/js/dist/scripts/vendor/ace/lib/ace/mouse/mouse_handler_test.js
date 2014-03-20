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

typeof process!="undefined"&&(require("amd-loader"),require("../test/mockdom")),define(["require","exports","module","../editor","../test/mockrenderer","../test/assertions"],function(e,t,n){var r=e("../editor").Editor,i=e("../test/mockrenderer").MockRenderer,s=e("../test/assertions"),o=function(e,t){var n=document.createEvent("MouseEvents");return n.initMouseEvent("mouse"+e,!0,!0,window,t.detail,t.x,t.y,t.x,t.y,t.ctrl,t.alt,t.shift,t.meta,t.button||0,t.relatedTarget),n};n.exports={setUp:function(e){this.editor=new r(new i),this.editor.setValue("Juhu kinners!"),e()},"test: double tap. issue #956":function(){var e=this.editor.renderer.getMouseEventTarget();e.dispatchEvent(o("down",{x:1,y:1})),e.dispatchEvent(o("up",{x:1,y:1})),e.dispatchEvent(o("down",{x:1,y:1,detail:2})),e.dispatchEvent(o("up",{x:1,y:1,detail:2})),s.equal(this.editor.getSelectedText(),"Juhu")}}}),typeof module!="undefined"&&module===require.main&&require("asyncjs").test.testcase(module.exports).exec();