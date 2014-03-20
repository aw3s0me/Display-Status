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

define(["require","exports","module","../lib/oop","../lib/event_emitter","../config"],function(e,t,n){var r=e("../lib/oop"),i=e("../lib/event_emitter").EventEmitter,s=e("../config"),o=function(t,n,r,i){this.$sendDeltaQueue=this.$sendDeltaQueue.bind(this),this.changeListener=this.changeListener.bind(this),this.onMessage=this.onMessage.bind(this),e.nameToUrl&&!e.toUrl&&(e.toUrl=e.nameToUrl);if(s.get("packaged")||!e.toUrl)i=i||s.moduleUrl(n,"worker");else{var o=this.$normalizePath;i=i||o(e.toUrl("ace/worker/worker.js",null,"_"));var u={};t.forEach(function(t){u[t]=o(e.toUrl(t,null,"_").replace(/(\.js)?(\?.*)?$/,""))})}try{this.$worker=new Worker(i)}catch(a){if(!(a instanceof window.DOMException))throw a;var f=this.$workerBlob(i),l=window.URL||window.webkitURL,c=l.createObjectURL(f);this.$worker=new Worker(c),l.revokeObjectURL(c)}this.$worker.postMessage({init:!0,tlns:u,module:n,classname:r}),this.callbackId=1,this.callbacks={},this.$worker.onmessage=this.onMessage};(function(){r.implement(this,i),this.onMessage=function(e){var t=e.data;switch(t.type){case"log":window.console&&console.log&&console.log.apply(console,t.data);break;case"event":this._signal(t.name,{data:t.data});break;case"call":var n=this.callbacks[t.id];n&&(n(t.data),delete this.callbacks[t.id])}},this.$normalizePath=function(e){return location.host?(e=e.replace(/^[a-z]+:\/\/[^\/]+/,""),e=location.protocol+"//"+location.host+(e.charAt(0)=="/"?"":location.pathname.replace(/\/[^\/]*$/,""))+"/"+e.replace(/^[\/]+/,""),e):e},this.terminate=function(){this._signal("terminate",{}),this.deltaQueue=null,this.$worker.terminate(),this.$worker=null,this.$doc.removeEventListener("change",this.changeListener),this.$doc=null},this.send=function(e,t){this.$worker.postMessage({command:e,args:t})},this.call=function(e,t,n){if(n){var r=this.callbackId++;this.callbacks[r]=n,t.push(r)}this.send(e,t)},this.emit=function(e,t){try{this.$worker.postMessage({event:e,data:{data:t.data}})}catch(n){}},this.attachToDocument=function(e){this.$doc&&this.terminate(),this.$doc=e,this.call("setValue",[e.getValue()]),e.on("change",this.changeListener)},this.changeListener=function(e){this.deltaQueue?this.deltaQueue.push(e.data):(this.deltaQueue=[e.data],setTimeout(this.$sendDeltaQueue,0))},this.$sendDeltaQueue=function(){var e=this.deltaQueue;if(!e)return;this.deltaQueue=null,e.length>20&&e.length>this.$doc.getLength()>>1?this.call("setValue",[this.$doc.getValue()]):this.emit("change",{data:e})},this.$workerBlob=function(e){var t="importScripts('"+e+"');";try{return new Blob([t],{type:"application/javascript"})}catch(n){var r=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder,i=new r;return i.append(t),i.getBlob("application/javascript")}}}).call(o.prototype);var u=function(e,t,n){this.$sendDeltaQueue=this.$sendDeltaQueue.bind(this),this.changeListener=this.changeListener.bind(this),this.callbackId=1,this.callbacks={},this.messageBuffer=[];var r=null,o=!1,u=Object.create(i),a=this;this.$worker={},this.$worker.terminate=function(){},this.$worker.postMessage=function(e){a.messageBuffer.push(e),r&&(o?setTimeout(f):f())},this.setEmitSync=function(e){o=e};var f=function(){var e=a.messageBuffer.shift();e.command?r[e.command].apply(r,e.args):e.event&&u._signal(e.event,e.data)};u.postMessage=function(e){a.onMessage({data:e})},u.callback=function(e,t){this.postMessage({type:"call",id:t,data:e})},u.emit=function(e,t){this.postMessage({type:"event",name:e,data:t})},s.loadModule(["worker",t],function(e){r=new e[n](u);while(a.messageBuffer.length)f()})};u.prototype=o.prototype,t.UIWorkerClient=u,t.WorkerClient=o});