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

define(["require","exports","module","./lib/oop","./lib/event_emitter","./range","./anchor"],function(e,t,n){var r=e("./lib/oop"),i=e("./lib/event_emitter").EventEmitter,s=e("./range").Range,o=e("./anchor").Anchor,u=function(e){this.$lines=[],e.length===0?this.$lines=[""]:Array.isArray(e)?this._insertLines(0,e):this.insert({row:0,column:0},e)};(function(){r.implement(this,i),this.setValue=function(e){var t=this.getLength();this.remove(new s(0,0,t,this.getLine(t-1).length)),this.insert({row:0,column:0},e)},this.getValue=function(){return this.getAllLines().join(this.getNewLineCharacter())},this.createAnchor=function(e,t){return new o(this,e,t)},"aaa".split(/a/).length===0?this.$split=function(e){return e.replace(/\r\n|\r/g,"\n").split("\n")}:this.$split=function(e){return e.split(/\r\n|\r|\n/)},this.$detectNewLine=function(e){var t=e.match(/^.*?(\r\n|\r|\n)/m);this.$autoNewLine=t?t[1]:"\n",this._signal("changeNewLineMode")},this.getNewLineCharacter=function(){switch(this.$newLineMode){case"windows":return"\r\n";case"unix":return"\n";default:return this.$autoNewLine||"\n"}},this.$autoNewLine="",this.$newLineMode="auto",this.setNewLineMode=function(e){if(this.$newLineMode===e)return;this.$newLineMode=e,this._signal("changeNewLineMode")},this.getNewLineMode=function(){return this.$newLineMode},this.isNewLine=function(e){return e=="\r\n"||e=="\r"||e=="\n"},this.getLine=function(e){return this.$lines[e]||""},this.getLines=function(e,t){return this.$lines.slice(e,t+1)},this.getAllLines=function(){return this.getLines(0,this.getLength())},this.getLength=function(){return this.$lines.length},this.getTextRange=function(e){if(e.start.row==e.end.row)return this.getLine(e.start.row).substring(e.start.column,e.end.column);var t=this.getLines(e.start.row,e.end.row);t[0]=(t[0]||"").substring(e.start.column);var n=t.length-1;return e.end.row-e.start.row==n&&(t[n]=t[n].substring(0,e.end.column)),t.join(this.getNewLineCharacter())},this.$clipPosition=function(e){var t=this.getLength();return e.row>=t?(e.row=Math.max(0,t-1),e.column=this.getLine(t-1).length):e.row<0&&(e.row=0),e},this.insert=function(e,t){if(!t||t.length===0)return e;e=this.$clipPosition(e),this.getLength()<=1&&this.$detectNewLine(t);var n=this.$split(t),r=n.splice(0,1)[0],i=n.length==0?null:n.splice(n.length-1,1)[0];return e=this.insertInLine(e,r),i!==null&&(e=this.insertNewLine(e),e=this._insertLines(e.row,n),e=this.insertInLine(e,i||"")),e},this.insertLines=function(e,t){return e>=this.getLength()?this.insert({row:e,column:0},"\n"+t.join("\n")):this._insertLines(Math.max(e,0),t)},this._insertLines=function(e,t){if(t.length==0)return{row:e,column:0};while(t.length>61440){var n=this._insertLines(e,t.slice(0,61440));t=t.slice(61440),e=n.row}var r=[e,0];r.push.apply(r,t),this.$lines.splice.apply(this.$lines,r);var i=new s(e,0,e+t.length,0),o={action:"insertLines",range:i,lines:t};return this._signal("change",{data:o}),i.end},this.insertNewLine=function(e){e=this.$clipPosition(e);var t=this.$lines[e.row]||"";this.$lines[e.row]=t.substring(0,e.column),this.$lines.splice(e.row+1,0,t.substring(e.column,t.length));var n={row:e.row+1,column:0},r={action:"insertText",range:s.fromPoints(e,n),text:this.getNewLineCharacter()};return this._signal("change",{data:r}),n},this.insertInLine=function(e,t){if(t.length==0)return e;var n=this.$lines[e.row]||"";this.$lines[e.row]=n.substring(0,e.column)+t+n.substring(e.column);var r={row:e.row,column:e.column+t.length},i={action:"insertText",range:s.fromPoints(e,r),text:t};return this._signal("change",{data:i}),r},this.remove=function(e){e instanceof s||(e=s.fromPoints(e.start,e.end)),e.start=this.$clipPosition(e.start),e.end=this.$clipPosition(e.end);if(e.isEmpty())return e.start;var t=e.start.row,n=e.end.row;if(e.isMultiLine()){var r=e.start.column==0?t:t+1,i=n-1;e.end.column>0&&this.removeInLine(n,0,e.end.column),i>=r&&this._removeLines(r,i),r!=t&&(this.removeInLine(t,e.start.column,this.getLine(t).length),this.removeNewLine(e.start.row))}else this.removeInLine(t,e.start.column,e.end.column);return e.start},this.removeInLine=function(e,t,n){if(t==n)return;var r=new s(e,t,e,n),i=this.getLine(e),o=i.substring(t,n),u=i.substring(0,t)+i.substring(n,i.length);this.$lines.splice(e,1,u);var a={action:"removeText",range:r,text:o};return this._signal("change",{data:a}),r.start},this.removeLines=function(e,t){return e<0||t>=this.getLength()?this.remove(new s(e,0,t+1,0)):this._removeLines(e,t)},this._removeLines=function(e,t){var n=new s(e,0,t+1,0),r=this.$lines.splice(e,t-e+1),i={action:"removeLines",range:n,nl:this.getNewLineCharacter(),lines:r};return this._signal("change",{data:i}),r},this.removeNewLine=function(e){var t=this.getLine(e),n=this.getLine(e+1),r=new s(e,t.length,e+1,0),i=t+n;this.$lines.splice(e,2,i);var o={action:"removeText",range:r,text:this.getNewLineCharacter()};this._signal("change",{data:o})},this.replace=function(e,t){e instanceof s||(e=s.fromPoints(e.start,e.end));if(t.length==0&&e.isEmpty())return e.start;if(t==this.getTextRange(e))return e.end;this.remove(e);if(t)var n=this.insert(e.start,t);else n=e.start;return n},this.applyDeltas=function(e){for(var t=0;t<e.length;t++){var n=e[t],r=s.fromPoints(n.range.start,n.range.end);n.action=="insertLines"?this.insertLines(r.start.row,n.lines):n.action=="insertText"?this.insert(r.start,n.text):n.action=="removeLines"?this._removeLines(r.start.row,r.end.row-1):n.action=="removeText"&&this.remove(r)}},this.revertDeltas=function(e){for(var t=e.length-1;t>=0;t--){var n=e[t],r=s.fromPoints(n.range.start,n.range.end);n.action=="insertLines"?this._removeLines(r.start.row,r.end.row-1):n.action=="insertText"?this.remove(r):n.action=="removeLines"?this._insertLines(r.start.row,n.lines):n.action=="removeText"&&this.insert(r.start,n.text)}},this.indexToPosition=function(e,t){var n=this.$lines||this.getAllLines(),r=this.getNewLineCharacter().length;for(var i=t||0,s=n.length;i<s;i++){e-=n[i].length+r;if(e<0)return{row:i,column:e+n[i].length+r}}return{row:s-1,column:n[s-1].length}},this.positionToIndex=function(e,t){var n=this.$lines||this.getAllLines(),r=this.getNewLineCharacter().length,i=0,s=Math.min(e.row,n.length);for(var o=t||0;o<s;++o)i+=n[o].length+r;return i+e.column}}).call(u.prototype),t.Document=u});