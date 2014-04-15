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

define(["require","exports","module","../lib/dom","../incremental_search","../commands/incremental_search_commands","./hash_handler","../lib/keys"],function(e,t,n){var r=e("../lib/dom");e("../incremental_search");var i=e("../commands/incremental_search_commands"),s=function(e,t){var n=this.scroller.getBoundingClientRect(),r=Math.floor((e+this.scrollLeft-n.left-this.$padding)/this.characterWidth),i=Math.floor((t+this.scrollTop-n.top)/this.lineHeight);return this.session.screenToDocumentPosition(i,r)},o=e("./hash_handler").HashHandler;t.handler=new o,t.handler.isEmacs=!0,t.handler.$id="ace/keyboard/emacs";var u=!1,a,f;t.handler.attach=function(e){u||(u=!0,r.importCssString("            .emacs-mode .ace_cursor{                border: 2px rgba(50,250,50,0.8) solid!important;                -moz-box-sizing: border-box!important;                -webkit-box-sizing: border-box!important;                box-sizing: border-box!important;                background-color: rgba(0,250,0,0.9);                opacity: 0.5;            }            .emacs-mode .ace_hidden-cursors .ace_cursor{                opacity: 1;                background-color: transparent;            }            .emacs-mode .ace_overwrite-cursors .ace_cursor {                opacity: 1;                background-color: transparent;                border-width: 0 0 2px 2px !important;            }            .emacs-mode .ace_text-layer {                z-index: 4            }            .emacs-mode .ace_cursor-layer {                z-index: 2            }","emacsMode")),a=e.session.$selectLongWords,e.session.$selectLongWords=!0,f=e.session.$useEmacsStyleLineStart,e.session.$useEmacsStyleLineStart=!0,e.session.$emacsMark=null,e.session.$emacsMarkRing=e.session.$emacsMarkRing||[],e.emacsMark=function(){return this.session.$emacsMark},e.setEmacsMark=function(e){this.session.$emacsMark=e},e.pushEmacsMark=function(e,t){var n=this.session.$emacsMark;n&&this.session.$emacsMarkRing.push(n),!e||t?this.setEmacsMark(e):this.session.$emacsMarkRing.push(e)},e.popEmacsMark=function(){var e=this.emacsMark();return e?(this.setEmacsMark(null),e):this.session.$emacsMarkRing.pop()},e.getLastEmacsMark=function(e){return this.session.$emacsMark||this.session.$emacsMarkRing.slice(-1)[0]},e.on("click",c),e.on("changeSession",l),e.renderer.screenToTextCoordinates=s,e.setStyle("emacs-mode"),e.commands.addCommands(v),t.handler.platform=e.commands.platform,e.$emacsModeHandler=this,e.addEventListener("copy",this.onCopy),e.addEventListener("paste",this.onPaste)},t.handler.detach=function(e){delete e.renderer.screenToTextCoordinates,e.session.$selectLongWords=a,e.session.$useEmacsStyleLineStart=f,e.removeEventListener("click",c),e.removeEventListener("changeSession",l),e.unsetStyle("emacs-mode"),e.commands.removeCommands(v),e.removeEventListener("copy",this.onCopy),e.removeEventListener("paste",this.onPaste)};var l=function(e){e.oldSession&&(e.oldSession.$selectLongWords=a,e.oldSession.$useEmacsStyleLineStart=f),a=e.session.$selectLongWords,e.session.$selectLongWords=!0,f=e.session.$useEmacsStyleLineStart,e.session.$useEmacsStyleLineStart=!0,e.session.hasOwnProperty("$emacsMark")||(e.session.$emacsMark=null),e.session.hasOwnProperty("$emacsMarkRing")||(e.session.$emacsMarkRing=[])},c=function(e){e.editor.session.$emacsMark=null},h=e("../lib/keys").KEY_MODS,p={C:"ctrl",S:"shift",M:"alt",CMD:"command"},d=["C-S-M-CMD","S-M-CMD","C-M-CMD","C-S-CMD","C-S-M","M-CMD","S-CMD","S-M","C-CMD","C-M","C-S","CMD","M","S","C"];d.forEach(function(e){var t=0;e.split("-").forEach(function(e){t|=h[p[e]]}),p[t]=e.toLowerCase()+"-"}),t.handler.onCopy=function(e,n){if(n.$handlesEmacsOnCopy)return;n.$handlesEmacsOnCopy=!0,t.handler.commands.killRingSave.exec(n),delete n.$handlesEmacsOnCopy},t.handler.onPaste=function(e,t){t.pushEmacsMark(t.getCursorPosition())},t.handler.bindKey=function(e,t){if(!e)return;var n=this.commandKeyBinding;e.split("|").forEach(function(e){e=e.toLowerCase(),n[e]=t;var r=e.split(" ").slice(0,-1);r.reduce(function(e,t,n){var r=e[n-1]?e[n-1]+" ":"";return e.concat([r+t])},[]).forEach(function(e){n[e]||(n[e]="null")})},this)},t.handler.handleKeyboard=function(e,t,n,r){var i=e.editor;if(t==-1){i.pushEmacsMark();if(e.count){var s=(new Array(e.count+1)).join(n);return e.count=null,{command:"insertstring",args:s}}}if(n=="\0")return undefined;var o=p[t];if(o=="c-"||e.universalArgument){var u=String(e.count||0),a=parseInt(n[n.length-1]);if(typeof a=="number"&&!isNaN(a))return e.count=parseInt(u+a),{command:"null"};e.universalArgument&&(e.count=4)}e.universalArgument=!1,o&&(n=o+n),e.keyChain&&(n=e.keyChain+=" "+n);var f=this.commandKeyBinding[n];e.keyChain=f=="null"?n:"";if(!f)return undefined;if(f==="null")return{command:"null"};if(f==="universalArgument")return e.universalArgument=!0,{command:"null"};var l;typeof f!="string"&&(l=f.args,f.command&&(f=f.command),f==="goorselect"&&(f=i.emacsMark()?l[1]:l[0],l=null));if(typeof f=="string"){(f==="insertstring"||f==="splitline"||f==="togglecomment")&&i.pushEmacsMark(),f=this.commands[f]||i.commands.commands[f];if(!f)return undefined}!f.readonly&&!f.isYank&&(e.lastCommand=null);if(e.count){var a=e.count;e.count=0;if(!f||!f.handlesCount)return{args:l,command:{exec:function(e,t){for(var n=0;n<a;n++)f.exec(e,t)}}};l||(l={}),typeof l=="object"&&(l.count=a)}return{command:f,args:l}},t.emacsKeys={"Up|C-p":{command:"goorselect",args:["golineup","selectup"]},"Down|C-n":{command:"goorselect",args:["golinedown","selectdown"]},"Left|C-b":{command:"goorselect",args:["gotoleft","selectleft"]},"Right|C-f":{command:"goorselect",args:["gotoright","selectright"]},"C-Left|M-b":{command:"goorselect",args:["gotowordleft","selectwordleft"]},"C-Right|M-f":{command:"goorselect",args:["gotowordright","selectwordright"]},"Home|C-a":{command:"goorselect",args:["gotolinestart","selecttolinestart"]},"End|C-e":{command:"goorselect",args:["gotolineend","selecttolineend"]},"C-Home|S-M-,":{command:"goorselect",args:["gotostart","selecttostart"]},"C-End|S-M-.":{command:"goorselect",args:["gotoend","selecttoend"]},"S-Up|S-C-p":"selectup","S-Down|S-C-n":"selectdown","S-Left|S-C-b":"selectleft","S-Right|S-C-f":"selectright","S-C-Left|S-M-b":"selectwordleft","S-C-Right|S-M-f":"selectwordright","S-Home|S-C-a":"selecttolinestart","S-End|S-C-e":"selecttolineend","S-C-Home":"selecttostart","S-C-End":"selecttoend","C-l":"recenterTopBottom","M-s":"centerselection","M-g":"gotoline","C-x C-p":"selectall","C-Down":{command:"goorselect",args:["gotopagedown","selectpagedown"]},"C-Up":{command:"goorselect",args:["gotopageup","selectpageup"]},"PageDown|C-v":{command:"goorselect",args:["gotopagedown","selectpagedown"]},"PageUp|M-v":{command:"goorselect",args:["gotopageup","selectpageup"]},"S-C-Down":"selectpagedown","S-C-Up":"selectpageup","C-s":"iSearch","C-r":"iSearchBackwards","M-C-s":"findnext","M-C-r":"findprevious","S-M-5":"replace",Backspace:"backspace","Delete|C-d":"del","Return|C-m":{command:"insertstring",args:"\n"},"C-o":"splitline","M-d|C-Delete":{command:"killWord",args:"right"},"C-Backspace|M-Backspace|M-Delete":{command:"killWord",args:"left"},"C-k":"killLine","C-y|S-Delete":"yank","M-y":"yankRotate","C-g":"keyboardQuit","C-w":"killRegion","M-w":"killRingSave","C-Space":"setMark","C-x C-x":"exchangePointAndMark","C-t":"transposeletters","M-u":"touppercase","M-l":"tolowercase","M-/":"autocomplete","C-u":"universalArgument","M-;":"togglecomment","C-/|C-x u|S-C--|C-z":"undo","S-C-/|S-C-x u|C--|S-C-z":"redo","C-x r":"selectRectangularRegion","M-x":{command:"focusCommandLine",args:"M-x "}},t.handler.bindKeys(t.emacsKeys),t.handler.addCommands({recenterTopBottom:function(e){var t=e.renderer,n=t.$cursorLayer.getPixelPosition(),r=t.$size.scrollerHeight-t.lineHeight,i=t.scrollTop;Math.abs(n.top-i)<2?i=n.top-r:Math.abs(n.top-i-r*.5)<2?i=n.top:i=n.top-r*.5,e.session.setScrollTop(i)},selectRectangularRegion:function(e){e.multiSelect.toggleBlockSelection()},setMark:{exec:function(e,t){if(t&&t.count){var n=e.popEmacsMark();n&&e.selection.moveCursorToPosition(n);return}var n=e.emacsMark(),r=!0;if(r&&(n||!e.selection.isEmpty())){e.pushEmacsMark(),e.clearSelection();return}if(n){var i=e.getCursorPosition();if(e.selection.isEmpty()&&n.row==i.row&&n.column==i.column){e.pushEmacsMark();return}}n=e.getCursorPosition(),e.setEmacsMark(n),e.selection.setSelectionAnchor(n.row,n.column)},readonly:!0,handlesCount:!0,multiSelectAction:"forEach"},exchangePointAndMark:{exec:function(e,t){var n=e.selection;if(t.count){var r=e.getCursorPosition();n.clearSelection(),n.moveCursorToPosition(e.popEmacsMark()),e.pushEmacsMark(r);return}var i=e.getLastEmacsMark(),s=n.getRange();if(s.isEmpty()){n.selectToPosition(i);return}n.setSelectionRange(s,!n.isBackwards())},readonly:!0,handlesCount:!0,multiSelectAction:"forEach"},killWord:{exec:function(e,n){e.clearSelection(),n=="left"?e.selection.selectWordLeft():e.selection.selectWordRight();var r=e.getSelectionRange(),i=e.session.getTextRange(r);t.killRing.add(i),e.session.remove(r),e.clearSelection()},multiSelectAction:"forEach"},killLine:function(e){e.pushEmacsMark(null);var n=e.getCursorPosition();n.column===0&&e.session.doc.getLine(n.row).length===0?e.selection.selectLine():(e.clearSelection(),e.selection.selectLineEnd());var r=e.getSelectionRange(),i=e.session.getTextRange(r);t.killRing.add(i),e.session.remove(r),e.clearSelection()},yank:function(e){e.onPaste(t.killRing.get()||""),e.keyBinding.$data.lastCommand="yank"},yankRotate:function(e){if(e.keyBinding.$data.lastCommand!="yank")return;e.undo(),e.onPaste(t.killRing.rotate()),e.keyBinding.$data.lastCommand="yank"},killRegion:{exec:function(e){t.killRing.add(e.getCopyText()),e.commands.byName.cut.exec(e)},readonly:!0,multiSelectAction:"forEach"},killRingSave:{exec:function(e){t.killRing.add(e.getCopyText()),setTimeout(function(){var t=e.selection,n=t.getRange();e.pushEmacsMark(t.isBackwards()?n.end:n.start),t.clearSelection()},0)},readonly:!0},keyboardQuit:function(e){e.selection.clearSelection(),e.setEmacsMark(null)},focusCommandLine:function(e,t){e.showCommandLine&&e.showCommandLine(t)}}),t.handler.addCommands(i.iSearchStartCommands);var v=t.handler.commands;v.yank.isYank=!0,v.yankRotate.isYank=!0,t.killRing={$data:[],add:function(e){e&&this.$data.push(e),this.$data.length>30&&this.$data.shift()},get:function(e){return e=e||1,this.$data.slice(this.$data.length-e,this.$data.length).reverse().join("\n")},pop:function(){return this.$data.length>1&&this.$data.pop(),this.get()},rotate:function(){return this.$data.unshift(this.$data.pop()),this.get()}}});