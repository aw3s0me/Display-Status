/**
 * Copyright (c) 2009-2013 Jeremy Ashkenas
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

define(["require","exports","module"],function(e,t,n){var r,i,s,o,u,a,f;t.starts=function(e,t,n){return t===e.substr(n,t.length)},t.ends=function(e,t,n){var r;return r=t.length,t===e.substr(e.length-r-(n||0),r)},t.repeat=u=function(e,t){var n;n="";while(t>0)t&1&&(n+=e),t>>>=1,e+=e;return n},t.compact=function(e){var t,n,r,i;i=[];for(n=0,r=e.length;n<r;n++)t=e[n],t&&i.push(t);return i},t.count=function(e,t){var n,r;n=r=0;if(!t.length)return 1/0;while(r=1+e.indexOf(t,r))n++;return n},t.merge=function(e,t){return i(i({},e),t)},i=t.extend=function(e,t){var n,r;for(n in t)r=t[n],e[n]=r;return e},t.flatten=s=function(e){var t,n,r,i;n=[];for(r=0,i=e.length;r<i;r++)t=e[r],t instanceof Array?n=n.concat(s(t)):n.push(t);return n},t.del=function(e,t){var n;return n=e[t],delete e[t],n},t.last=o=function(e,t){return e[e.length-(t||0)-1]},t.some=(f=Array.prototype.some)!=null?f:function(e){var t,n,r;for(n=0,r=this.length;n<r;n++){t=this[n];if(e(t))return!0}return!1},t.invertLiterate=function(e){var t,n,r;return r=!0,n=function(){var n,i,s,o;s=e.split("\n"),o=[];for(n=0,i=s.length;n<i;n++)t=s[n],r&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?o.push(t):(r=/^\s*$/.test(t))?o.push(t):o.push("# "+t);return o}(),n.join("\n")},r=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},t.addLocationDataFn=function(e,t){return function(n){return typeof n=="object"&&!!n.updateLocationDataIfMissing&&n.updateLocationDataIfMissing(r(e,t)),n}},t.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?""+(t.first_line+1)+":"+(t.first_column+1)+"-"+(""+(t.last_line+1)+":"+(t.last_column+1)):"No location data"},t.baseFileName=function(e,t,n){var r,i;return t==null&&(t=!1),n==null&&(n=!1),i=n?/\\|\//:/\//,r=e.split(i),e=r[r.length-1],t&&e.indexOf(".")>=0?(r=e.split("."),r.pop(),r[r.length-1]==="coffee"&&r.length>1&&r.pop(),r.join(".")):e},t.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md)$/.test(e)},t.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},t.throwSyntaxError=function(e,t){var n;throw t.last_line==null&&(t.last_line=t.first_line),t.last_column==null&&(t.last_column=t.first_column),n=new SyntaxError(e),n.location=t,n.toString=a,n.stack=n.toString(),n},t.updateSyntaxError=function(e,t,n){return e.toString===a&&(e.code||(e.code=t),e.filename||(e.filename=n),e.stack=e.toString()),e},a=function(){var e,t,n,r,i,s,o,a,f,l,c,h,p;if(!this.code||!this.location)return Error.prototype.toString.call(this);h=this.location,o=h.first_line,s=h.first_column,f=h.last_line,a=h.last_column,f==null&&(f=o),a==null&&(a=s),i=this.filename||"[stdin]",e=this.code.split("\n")[o],c=s,r=o===f?a+1:e.length,l=u(" ",c)+u("^",r-c),typeof process!="undefined"&&process!==null&&(n=process.stdout.isTTY&&!process.env.NODE_DISABLE_COLORS);if((p=this.colorful)!=null?p:n)t=function(e){return"[1;31m"+e+"[0m"},e=e.slice(0,c)+t(e.slice(c,r))+e.slice(r),l=t(l);return""+i+":"+(o+1)+":"+(s+1)+": error: "+this.message+"\n"+e+"\n"+l}});