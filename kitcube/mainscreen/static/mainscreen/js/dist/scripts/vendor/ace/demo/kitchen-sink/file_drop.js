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

define(["require","exports","module","ace/config","ace/lib/event","ace/ext/modelist","ace/editor"],function(e,t,n){var r=e("ace/config"),i=e("ace/lib/event"),s=e("ace/ext/modelist");n.exports=function(e){i.addListener(e.container,"dragover",function(e){var t=e.dataTransfer.types;if(t&&Array.prototype.indexOf.call(t,"Files")!==-1)return i.preventDefault(e)}),i.addListener(e.container,"drop",function(t){var n;try{n=t.dataTransfer.files[0];if(window.FileReader){var r=new FileReader;r.onload=function(){var t=s.getModeForPath(n.name);e.session.doc.setValue(r.result),e.session.setMode(t.mode),e.session.modeName=t.name},r.readAsText(n)}return i.preventDefault(t)}catch(o){return i.stopEvent(t)}})};var o=e("ace/editor").Editor;r.defineOptions(o.prototype,"editor",{loadDroppedFile:{set:function(){n.exports(this)},value:!0}})});