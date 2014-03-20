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

define(["require","exports","module","./keys","./useragent"],function(e,t,n){function o(e,t,n){var o=s(t);if(!i.isMac&&u){if(u[91]||u[92])o|=8;if(u.altGr){if((3&o)==3)return;u.altGr=0}if(n===18||n===17){var f=t.location||t.keyLocation;if(n===17&&f===1)a=t.timeStamp;else if(n===18&&o===3&&f===2){var l=-a;a=t.timeStamp,l+=a,l<3&&(u.altGr=!0)}}}if(n in r.MODIFIER_KEYS){switch(r.MODIFIER_KEYS[n]){case"Alt":o=2;break;case"Shift":o=4;break;case"Ctrl":o=1;break;default:o=8}n=-1}o&8&&(n===91||n===93)&&(n=-1);if(!o&&n===13)if(t.location||t.keyLocation===3){e(t,o,-n);if(t.defaultPrevented)return}return!!o||n in r.FUNCTION_KEYS||n in r.PRINTABLE_KEYS?e(t,o,n):!1}var r=e("./keys"),i=e("./useragent");t.addListener=function(e,t,n){if(e.addEventListener)return e.addEventListener(t,n,!1);if(e.attachEvent){var r=function(){n.call(e,window.event)};n._wrapper=r,e.attachEvent("on"+t,r)}},t.removeListener=function(e,t,n){if(e.removeEventListener)return e.removeEventListener(t,n,!1);e.detachEvent&&e.detachEvent("on"+t,n._wrapper||n)},t.stopEvent=function(e){return t.stopPropagation(e),t.preventDefault(e),!1},t.stopPropagation=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},t.preventDefault=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},t.getButton=function(e){return e.type=="dblclick"?0:e.type=="contextmenu"||e.ctrlKey&&i.isMac?2:e.preventDefault?e.button:{1:0,2:2,4:1}[e.button]},t.capture=function(e,n,r){function i(e){n&&n(e),r&&r(e),t.removeListener(document,"mousemove",n,!0),t.removeListener(document,"mouseup",i,!0),t.removeListener(document,"dragstart",i,!0)}return t.addListener(document,"mousemove",n,!0),t.addListener(document,"mouseup",i,!0),t.addListener(document,"dragstart",i,!0),i},t.addMouseWheelListener=function(e,n){"onmousewheel"in e?t.addListener(e,"mousewheel",function(e){var t=8;e.wheelDeltaX!==undefined?(e.wheelX=-e.wheelDeltaX/t,e.wheelY=-e.wheelDeltaY/t):(e.wheelX=0,e.wheelY=-e.wheelDelta/t),n(e)}):"onwheel"in e?t.addListener(e,"wheel",function(e){var t=.35;switch(e.deltaMode){case e.DOM_DELTA_PIXEL:e.wheelX=e.deltaX*t||0,e.wheelY=e.deltaY*t||0;break;case e.DOM_DELTA_LINE:case e.DOM_DELTA_PAGE:e.wheelX=(e.deltaX||0)*5,e.wheelY=(e.deltaY||0)*5}n(e)}):t.addListener(e,"DOMMouseScroll",function(e){e.axis&&e.axis==e.HORIZONTAL_AXIS?(e.wheelX=(e.detail||0)*5,e.wheelY=0):(e.wheelX=0,e.wheelY=(e.detail||0)*5),n(e)})},t.addMultiMouseDownListener=function(e,n,r,s){var o=0,u,a,f,l={2:"dblclick",3:"tripleclick",4:"quadclick"};t.addListener(e,"mousedown",function(e){t.getButton(e)!==0?o=0:e.detail>1?(o++,o>4&&(o=1)):o=1;if(i.isIE){var n=Math.abs(e.clientX-u)>5||Math.abs(e.clientY-a)>5;n&&(o=1),o==1&&(u=e.clientX,a=e.clientY)}r[s]("mousedown",e);if(o>4)o=0;else if(o>1)return r[s](l[o],e)}),i.isOldIE&&t.addListener(e,"dblclick",function(e){o=2,f&&clearTimeout(f),f=setTimeout(function(){f=null},n[o-1]||600),r[s]("mousedown",e),r[s](l[o],e)})};var s=!i.isMac||!i.isOpera||"KeyboardEvent"in window?function(e){return 0|(e.ctrlKey?1:0)|(e.altKey?2:0)|(e.shiftKey?4:0)|(e.metaKey?8:0)}:function(e){return 0|(e.metaKey?1:0)|(e.altKey?2:0)|(e.shiftKey?4:0)|(e.ctrlKey?8:0)};t.getModifierString=function(e){return r.KEY_MODS[s(e)]};var u=null,a=0;t.addCommandKeyListener=function(e,n){var r=t.addListener;if(i.isOldGecko||i.isOpera&&!("KeyboardEvent"in window)){var s=null;r(e,"keydown",function(e){s=e.keyCode}),r(e,"keypress",function(e){return o(n,e,s)})}else{var a=null;r(e,"keydown",function(e){u[e.keyCode]=!0;var t=o(n,e,e.keyCode);return a=e.defaultPrevented,t}),r(e,"keypress",function(e){a&&(e.ctrlKey||e.altKey||e.shiftKey||e.metaKey)&&(t.stopEvent(e),a=null)}),r(e,"keyup",function(e){u[e.keyCode]=null}),u||(u=Object.create(null),r(window,"focus",function(e){u=Object.create(null)}))}};if(window.postMessage&&!i.isOldIE){var f=1;t.nextTick=function(e,n){n=n||window;var r="zero-timeout-message-"+f;t.addListener(n,"message",function i(s){s.data==r&&(t.stopPropagation(s),t.removeListener(n,"message",i),e())}),n.postMessage(r,"*")}}t.nextFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame,t.nextFrame?t.nextFrame=t.nextFrame.bind(window):t.nextFrame=function(e){setTimeout(e,17)}});