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

define(["require","exports","module","../lib/useragent","../tokenizer","./searchbox"],function(require,exports,module){function patch(obj,name,regexp,replacement){eval("obj['"+name+"']="+obj[name].toString().replace(regexp,replacement))}var MAX_TOKEN_COUNT=1e3,useragent=require("../lib/useragent"),TokenizerModule=require("../tokenizer");useragent.isIE&&useragent.isIE<10&&window.top.document.compatMode==="BackCompat"&&(useragent.isOldIE=!0);if(typeof document!="undefined"&&!document.documentElement.querySelector){useragent.isOldIE=!0;var qs=function(e,t){if(t.charAt(0)==".")var n=t.slice(1);else var r=t.match(/(\w+)=(\w+)/),i=r&&r[1],s=r&&r[2];for(var o=0;o<e.all.length;o++){var u=e.all[o];if(n){if(u.className.indexOf(n)!=-1)return u}else if(i&&u.getAttribute(i)==s)return u}},sb=require("./searchbox").SearchBox.prototype;patch(sb,"$initElements",/([^\s=]*).querySelector\((".*?")\)/g,"qs($1, $2)")}var compliantExecNpcg=/()??/.exec("")[1]===undefined;if(compliantExecNpcg)return;var proto=TokenizerModule.Tokenizer.prototype;TokenizerModule.Tokenizer_orig=TokenizerModule.Tokenizer,proto.getLineTokens_orig=proto.getLineTokens,patch(TokenizerModule,"Tokenizer","ruleRegExps.push(adjustedregex);\n",function(e){return e+'        if (state[i].next && RegExp(adjustedregex).test(""))\n            rule._qre = RegExp(adjustedregex, "g");\n        '}),TokenizerModule.Tokenizer.prototype=proto,patch(proto,"getLineTokens",/if \(match\[i \+ 1\] === undefined\)\s*continue;/,"if (!match[i + 1]) {\n        if (value)continue;\n        var qre = state[mapping[i]]._qre;\n        if (!qre) continue;\n        qre.lastIndex = lastIndex;\n        if (!qre.exec(line) || qre.lastIndex != lastIndex)\n            continue;\n    }"),useragent.isOldIE=!0});