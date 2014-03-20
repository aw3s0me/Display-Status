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

define(["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/event","ace/range","ace/tooltip"],function(e,t,n){function a(e){if(e.tokenTooltip)return;u.call(this,e.container),e.tokenTooltip=this,this.editor=e,this.update=this.update.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseOut=this.onMouseOut.bind(this),s.addListener(e.renderer.scroller,"mousemove",this.onMouseMove),s.addListener(e.renderer.content,"mouseout",this.onMouseOut)}var r=e("ace/lib/dom"),i=e("ace/lib/oop"),s=e("ace/lib/event"),o=e("ace/range").Range,u=e("ace/tooltip").Tooltip;i.inherits(a,u),function(){this.token={},this.range=new o,this.update=function(){this.$timer=null;var e=this.editor.renderer;this.lastT-(e.timeStamp||0)>1e3&&(e.rect=null,e.timeStamp=this.lastT,this.maxHeight=window.innerHeight,this.maxWidth=window.innerWidth);var t=e.rect||(e.rect=e.scroller.getBoundingClientRect()),n=(this.x+e.scrollLeft-t.left-e.$padding)/e.characterWidth,r=Math.floor((this.y+e.scrollTop-t.top)/e.lineHeight),i=Math.round(n),s={row:r,column:i,side:n-i>0?1:-1},u=this.editor.session,a=u.screenToDocumentPosition(s.row,s.column),f=u.getTokenAt(a.row,a.column);!f&&!u.getLine(a.row)&&(f={type:"",value:"",state:u.bgTokenizer.getState(0)});if(!f){u.removeMarker(this.marker),this.hide();return}var l=f.type;f.state&&(l+="|"+f.state),f.merge&&(l+="\n  merge"),f.stateTransitions&&(l+="\n  "+f.stateTransitions.join("\n  ")),this.tokenText!=l&&(this.setText(l),this.width=this.getWidth(),this.height=this.getHeight(),this.tokenText=l),this.show(null,this.x,this.y),this.token=f,u.removeMarker(this.marker),this.range=new o(a.row,f.start,a.row,f.start+f.value.length),this.marker=u.addMarker(this.range,"ace_bracket","text")},this.onMouseMove=function(e){this.x=e.clientX,this.y=e.clientY,this.isOpen&&(this.lastT=e.timeStamp,this.setPosition(this.x,this.y)),this.$timer||(this.$timer=setTimeout(this.update,100))},this.onMouseOut=function(e){if(e&&e.currentTarget.contains(e.relatedTarget))return;this.hide(),this.editor.session.removeMarker(this.marker),this.$timer=clearTimeout(this.$timer)},this.setPosition=function(e,t){e+10+this.width>this.maxWidth&&(e=window.innerWidth-this.width-10);if(t>window.innerHeight*.75||t+20+this.height>this.maxHeight)t=t-this.height-30;u.prototype.setPosition.call(this,e+10,t+20)},this.destroy=function(){this.onMouseOut(),s.removeListener(this.editor.renderer.scroller,"mousemove",this.onMouseMove),s.removeListener(this.editor.renderer.content,"mouseout",this.onMouseOut),delete this.editor.tokenTooltip}}.call(a.prototype),t.TokenTooltip=a});