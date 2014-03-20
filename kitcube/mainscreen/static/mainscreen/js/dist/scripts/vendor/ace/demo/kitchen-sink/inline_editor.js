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

define(["require","exports","module","ace/line_widgets","ace/editor","ace/virtual_renderer","ace/lib/dom","ace/commands/default_commands"],function(e,t,n){var r=e("ace/line_widgets").LineWidgets,i=e("ace/editor").Editor,s=e("ace/virtual_renderer").VirtualRenderer,o=e("ace/lib/dom");e("ace/commands/default_commands").commands.push({name:"openInlineEditor",bindKey:"F3",exec:function(e){var t=window.env.split,n=e.session,u=new i(new s),a=t.$cloneSession(n),f=e.getCursorPosition().row;if(e.session.lineWidgets&&e.session.lineWidgets[f]){e.session.lineWidgets[f].destroy();return}var l=10,c={row:f,fixedWidth:!0,el:o.createElement("div"),editor:e},h=c.el;h.appendChild(u.container),e.session.widgetManager||(e.session.widgetManager=new r(e.session),e.session.widgetManager.attach(e));var p=l*e.renderer.layerConfig.lineHeight;u.container.style.height=p+"px",h.style.position="absolute",h.style.zIndex="4",h.style.borderTop="solid blue 2px",h.style.borderBottom="solid blue 2px",u.setSession(a),e.session.widgetManager.addLineWidget(c);var d={handleKeyboard:function(e,t,n){if(t===0&&n==="esc")return c.destroy(),!0}};c.destroy=function(){e.keyBinding.removeKeyboardHandler(d),n.widgetManager.removeLineWidget(c)},e.keyBinding.addKeyboardHandler(d),u.keyBinding.addKeyboardHandler(d),e.on("changeSession",function(e){c.el.parentNode&&c.el.parentNode.removeChild(c.el)}),u.setTheme("ace/theme/solarized_light")}})});