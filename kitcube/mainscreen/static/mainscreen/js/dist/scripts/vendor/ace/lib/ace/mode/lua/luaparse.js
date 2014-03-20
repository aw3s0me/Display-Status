define(["require","exports","module"],function(e,t,n){(function(e,n,r){r(t)})(this,"luaparse",function(e){function m(e){if(mt){var t=vt.pop();t.complete(),n.locations&&(e.loc=t.loc),n.ranges&&(e.range=t.range)}return e}function w(e,t,n){for(var r=0,i=e.length;r<i;r++)if(e[r][t]===n)return r;return-1}function E(e){var t=g.call(arguments,1);return e=e.replace(/%(\d)/g,function(e,n){return""+t[n-1]||""}),e}function S(){var e=g.call(arguments),t={},n,r;for(var i=0,s=e.length;i<s;i++){n=e[i];for(r in n)n.hasOwnProperty(r)&&(t[r]=n[r])}return t}function x(e){var t=E.apply(null,g.call(arguments,1)),n,r;throw"undefined"!=typeof e.line?(r=e.range[0]-e.lineStart,n=new SyntaxError(E("[%1:%2] %3",e.line,r,t)),n.line=e.line,n.index=e.range[0],n.column=r):(r=C-D+1,n=new SyntaxError(E("[%1:%2] %3",_,r,t)),n.index=C,n.line=_,n.column=r),n}function T(e,t){x(t,d.expectedToken,e,t.value)}function N(e,t){"undefined"==typeof t&&(t=A.value);if("undefined"!=typeof e.type){var n;switch(e.type){case o:n="string";break;case u:n="keyword";break;case a:n="identifier";break;case f:n="number";break;case l:n="symbol";break;case c:n="boolean";break;case h:return x(e,d.unexpected,"symbol","nil",t)}return x(e,d.unexpected,n,e.value,t)}return x(e,d.unexpected,"symbol",e,t)}function P(){H();while(45===t.charCodeAt(C)&&45===t.charCodeAt(C+1))X(),H();if(C>=r)return{type:s,value:"<eof>",line:_,lineStart:D,range:[C,C]};var e=t.charCodeAt(C),n=t.charCodeAt(C+1);M=C;if(et(e))return B();switch(e){case 39:case 34:return I();case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return R();case 46:if(Y(n))return R();if(46===n)return 46===t.charCodeAt(C+2)?F():j("..");return j(".");case 61:if(61===n)return j("==");return j("=");case 62:if(61===n)return j(">=");return j(">");case 60:if(61===n)return j("<=");return j("<");case 126:if(61===n)return j("~=");return x({},d.expected,"=","~");case 58:if(58===n)return j("::");return j(":");case 91:if(91===n||61===n)return q();return j("[");case 42:case 47:case 94:case 37:case 44:case 123:case 125:case 93:case 40:case 41:case 59:case 35:case 45:case 43:return j(t.charAt(C))}return N(t.charAt(C))}function H(){while(C<r){var e=t.charCodeAt(C);if(Q(e))C++;else{if(!G(e))break;_++,D=++C}}}function B(){var e,n;while(tt(t.charCodeAt(++C)));return e=t.slice(M,C),nt(e)?n=u:"true"===e||"false"===e?(n=c,e="true"===e):"nil"===e?(n=h,e=null):n=a,{type:n,value:e,line:_,lineStart:D,range:[M,C]}}function j(e){return C+=e.length,{type:l,value:e,line:_,lineStart:D,range:[M,C]}}function F(){return C+=3,{type:p,value:"...",line:_,lineStart:D,range:[M,C]}}function I(){var e=t.charCodeAt(C++),n=C,i="",s;while(C<r){s=t.charCodeAt(C++);if(e===s)break;if(92===s)i+=t.slice(n,C-1)+W(),n=C;else if(C>=r||G(s))i+=t.slice(n,C-1),x({},d.unfinishedString,i+String.fromCharCode(s))}return i+=t.slice(n,C-1),{type:o,value:i,line:_,lineStart:D,range:[M,C]}}function q(){var e=V();return!1===e&&x(k,d.expected,"[",k.value),{type:o,value:e,line:_,lineStart:D,range:[M,C]}}function R(){var e=t.charAt(C),n=t.charAt(C+1),r="0"===e&&"xX".indexOf(n||null)>=0?U():z();return{type:f,value:r,line:_,lineStart:D,range:[M,C]}}function U(){var e=0,n=1,r=1,i,s,o,u;u=C+=2,Z(t.charCodeAt(C))||x({},d.malformedNumber,t.slice(M,C));while(Z(t.charCodeAt(C)))C++;i=parseInt(t.slice(u,C),16);if("."===t.charAt(C)){s=++C;while(Z(t.charCodeAt(C)))C++;e=t.slice(s,C),e=s===C?0:parseInt(e,16)/Math.pow(16,C-s)}if("pP".indexOf(t.charAt(C)||null)>=0){C++,"+-".indexOf(t.charAt(C)||null)>=0&&(r="+"===t.charAt(C++)?1:-1),o=C,Y(t.charCodeAt(C))||x({},d.malformedNumber,t.slice(M,C));while(Y(t.charCodeAt(C)))C++;n=t.slice(o,C),n=Math.pow(2,n*r)}return(i+e)*n}function z(){while(Y(t.charCodeAt(C)))C++;if("."===t.charAt(C)){C++;while(Y(t.charCodeAt(C)))C++}if("eE".indexOf(t.charAt(C)||null)>=0){C++,"+-".indexOf(t.charAt(C)||null)>=0&&C++,Y(t.charCodeAt(C))||x({},d.malformedNumber,t.slice(M,C));while(Y(t.charCodeAt(C)))C++}return parseFloat(t.slice(M,C))}function W(){var e=C;switch(t.charAt(C)){case"n":return C++,"\n";case"r":return C++,"\r";case"t":return C++,"	";case"v":return C++,"";case"b":return C++,"\b";case"f":return C++,"\f";case"z":return C++,H(),"";case"x":if(Z(t.charCodeAt(C+1))&&Z(t.charCodeAt(C+2)))return C+=3,"\\"+t.slice(e,C);return"\\"+t.charAt(C++);default:if(Y(t.charCodeAt(C))){while(Y(t.charCodeAt(++C)));return"\\"+t.slice(e,C)}return t.charAt(C++)}}function X(){M=C,C+=2;var e=t.charAt(C),i="",s=!1,o=C,u=D,a=_;"["===e&&(i=V(),!1===i?i=e:s=!0);if(!s){while(C<r){if(G(t.charCodeAt(C)))break;C++}n.comments&&(i=t.slice(o,C))}if(n.comments){var f=v.comment(i,t.slice(M,C));n.locations&&(f.loc={start:{line:a,column:M-u},end:{line:_,column:C-D}}),n.ranges&&(f.range=[M,C]),O.push(f)}}function V(){var e=0,n="",i=!1,s,o;C++;while("="===t.charAt(C+e))e++;if("["!==t.charAt(C+e))return!1;C+=e+1,G(t.charCodeAt(C))&&(_++,D=C++),o=C;while(C<r){s=t.charAt(C++),G(s.charCodeAt(0))&&(_++,D=C);if("]"===s){i=!0;for(var u=0;u<e;u++)"="!==t.charAt(C+u)&&(i=!1);"]"!==t.charAt(C+e)&&(i=!1)}if(i)break}return n+=t.slice(o,C-1),C+=e+1,n}function $(){L=k,k=A,A=P()}function J(e){return e===k.value?($(),!0):!1}function K(e){e===k.value?$():x(k,d.expected,e,k.value)}function Q(e){return 9===e||32===e||11===e||12===e}function G(e){return 10===e||13===e}function Y(e){return e>=48&&e<=57}function Z(e){return e>=48&&e<=57||e>=97&&e<=102||e>=65&&e<=70}function et(e){return e>=65&&e<=90||e>=97&&e<=122||95===e}function tt(e){return e>=65&&e<=90||e>=97&&e<=122||95===e||e>=48&&e<=57}function nt(e){switch(e.length){case 2:return"do"===e||"if"===e||"in"===e||"or"===e;case 3:return"and"===e||"end"===e||"for"===e||"not"===e;case 4:return"else"===e||"goto"===e||"then"===e;case 5:return"break"===e||"local"===e||"until"===e||"while"===e;case 6:return"elseif"===e||"repeat"===e||"return"===e;case 8:return"function"===e}return!1}function rt(e){return l===e.type?"#-".indexOf(e.value)>=0:u===e.type?"not"===e.value:!1}function it(e){switch(e.type){case"CallExpression":case"TableCallExpression":case"StringCallExpression":return!0}return!1}function st(e){if(s===e.type)return!0;if(u!==e.type)return!1;switch(e.value){case"else":case"elseif":case"end":case"until":return!0;default:return!1}}function ft(){ot.push(Array.apply(null,ot[ut++]))}function lt(){ot.pop(),ut--}function ct(e){if(-1!==b(ot[ut],e))return;ot[ut].push(e)}function ht(e){ct(e.name),pt(e,!0)}function pt(e,t){!t&&-1===w(at,"name",e.name)&&at.push(e),e.isLocal=t}function dt(e){return-1!==b(ot[ut],e)}function gt(){return new yt(k)}function yt(e){n.locations&&(this.loc={start:{line:e.line,column:e.range[0]-e.lineStart},end:{line:0,column:0}}),n.ranges&&(this.range=[e.range[0],0])}function bt(){mt&&vt.push(gt())}function wt(e){mt&&vt.push(e)}function Et(){$(),bt();var e=St();return s!==k.type&&N(k),mt&&!e.length&&(L=k),m(v.chunk(e))}function St(e){var t=[],r;n.scope&&ft();while(!st(k)){if("return"===k.value){t.push(xt());break}r=xt(),r&&t.push(r)}return n.scope&&lt(),t}function xt(){bt();if(u===k.type)switch(k.value){case"local":return $(),Dt();case"if":return $(),Mt();case"return":return $(),Ot();case"function":$();var e=jt();return Bt(e);case"while":return $(),Lt();case"for":return $(),_t();case"repeat":return $(),At();case"break":return $(),Nt();case"do":return $(),kt();case"goto":return $(),Ct()}if(l===k.type&&J("::"))return Tt();mt&&vt.pop();if(J(";"))return;return Pt()}function Tt(){var e=k.value,t=Ht();return n.scope&&(ct("::"+e+"::"),pt(t,!0)),K("::"),m(v.labelStatement(t))}function Nt(){return m(v.breakStatement())}function Ct(){var e=k.value,t=Ht();return n.scope&&(t.isLabel=dt("::"+e+"::")),m(v.gotoStatement(t))}function kt(){var e=St();return K("end"),m(v.doStatement(e))}function Lt(){var e=qt();K("do");var t=St();return K("end"),m(v.whileStatement(e,t))}function At(){var e=St();K("until");var t=qt();return m(v.repeatStatement(t,e))}function Ot(){var e=[];if("end"!==k.value){var t=It();null!=t&&e.push(t);while(J(","))t=qt(),e.push(t);J(";")}return m(v.returnStatement(e))}function Mt(){var e=[],t,n,r;mt&&(r=vt[vt.length-1],vt.push(r)),t=qt(),K("then"),n=St(),e.push(m(v.ifClause(t,n))),mt&&(r=gt());while(J("elseif"))wt(r),t=qt(),K("then"),n=St(),e.push(m(v.elseifClause(t,n))),mt&&(r=gt());return J("else")&&(mt&&(r=new yt(L),vt.push(r)),n=St(),e.push(m(v.elseClause(n)))),K("end"),m(v.ifStatement(e))}function _t(){var e=Ht(),t;n.scope&&ht(e);if(J("=")){var r=qt();K(",");var i=qt(),s=J(",")?qt():null;return K("do"),t=St(),K("end"),m(v.forNumericStatement(e,r,i,s,t))}var o=[e];while(J(","))e=Ht(),n.scope&&ht(e),o.push(e);K("in");var u=[];do{var a=qt();u.push(a)}while(J(","));return K("do"),t=St(),K("end"),m(v.forGenericStatement(o,u,t))}function Dt(){var e;if(a===k.type){var t=[],r=[];do e=Ht(),t.push(e);while(J(","));if(J("="))do{var i=qt();r.push(i)}while(J(","));if(n.scope)for(var s=0,o=t.length;s<o;s++)ht(t[s]);return m(v.localStatement(t,r))}if(J("function"))return e=Ht(),n.scope&&ht(e),Bt(e,!0);T("<name>",k)}function Pt(){var e=k,t,n;mt&&(n=gt()),t=zt();if(null==t)return N(k);if(",=".indexOf(k.value)>=0){var r=[t],i=[],s;while(J(","))s=zt(),null==s&&T("<expression>",k),r.push(s);K("=");do s=qt(),i.push(s);while(J(","));return wt(n),m(v.assignmentStatement(r,i))}return it(t)?(wt(n),m(v.callStatement(t))):N(e)}function Ht(){bt();var e=k.value;return a!==k.type&&T("<name>",k),$(),m(v.identifier(e))}function Bt(e,t){var r=[];K("(");if(!J(")"))for(;;)if(a===k.type){var i=Ht();n.scope&&ht(i),r.push(i);if(J(","))continue;if(J(")"))break}else{if(p===k.type){r.push(Xt()),K(")");break}T("<name> or '...'",k)}var s=St();return K("end"),t=t||!1,m(v.functionStatement(e,r,t,s))}function jt(){var e,t,r;mt&&(r=gt()),e=Ht(),n.scope&&pt(e,!1);while(J("."))wt(r),t=Ht(),n.scope&&pt(t,!1),e=m(v.memberExpression(e,".",t));return J(":")&&(wt(r),t=Ht(),n.scope&&pt(t,!1),e=m(v.memberExpression(e,":",t))),e}function Ft(){var e=[],t,n;for(;;){bt();if(l===k.type&&J("["))t=qt(),K("]"),K("="),n=qt(),e.push(m(v.tableKey(t,n)));else if(a===k.type)t=qt(),J("=")?(n=qt(),e.push(m(v.tableKeyString(t,n)))):e.push(m(v.tableValue(t)));else{if(null==(n=It())){vt.pop();break}e.push(m(v.tableValue(n)))}if(",;".indexOf(k.value)>=0){$();continue}if("}"===k.value)break}return K("}"),m(v.tableConstructorExpression(e))}function It(){var e=Ut(0);return e}function qt(){var e=It();if(null!=e)return e;T("<expression>",k)}function Rt(e){var t=e.charCodeAt(0),n=e.length;if(1===n)switch(t){case 94:return 10;case 42:case 47:case 37:return 7;case 43:case 45:return 6;case 60:case 62:return 3}else if(2===n)switch(t){case 46:return 5;case 60:case 62:case 61:case 126:return 3;case 111:return 1}else if(97===t&&"and"===e)return 2;return 0}function Ut(e){var t=k.value,n,r;mt&&(r=gt());if(rt(k)){bt(),$();var i=Ut(8);i==null&&T("<expression>",k),n=m(v.unaryExpression(t,i))}null==n&&(n=Xt(),null==n&&(n=zt()));if(null==n)return null;var s;for(;;){t=k.value,s=l===k.type||u===k.type?Rt(t):0;if(s===0||s<=e)break;("^"===t||".."===t)&&s--,$();var o=Ut(s);null==o&&T("<expression>",k),mt&&vt.push(r),n=m(v.binaryExpression(t,n,o))}return n}function zt(){var e,t,r,i;mt&&(r=gt());if(a===k.type)t=k.value,e=Ht(),n.scope&&pt(e,i=dt(t));else{if(!J("("))return null;e=qt(),K(")"),n.scope&&(i=e.isLocal)}var s,u;for(;;)if(l===k.type)switch(k.value){case"[":wt(r),$(),s=qt(),e=m(v.indexExpression(e,s)),K("]");break;case".":wt(r),$(),u=Ht(),n.scope&&pt(u,i),e=m(v.memberExpression(e,".",u));break;case":":wt(r),$(),u=Ht(),n.scope&&pt(u,i),e=m(v.memberExpression(e,":",u)),wt(r),e=Wt(e);break;case"(":case"{":wt(r),e=Wt(e);break;default:return e}else{if(o!==k.type)break;wt(r),e=Wt(e)}return e}function Wt(e){if(l===k.type)switch(k.value){case"(":$();var t=[],n=It();null!=n&&t.push(n);while(J(","))n=qt(),t.push(n);return K(")"),m(v.callExpression(e,t));case"{":bt(),$();var r=Ft();return m(v.tableCallExpression(e,r))}else if(o===k.type)return m(v.stringCallExpression(e,Xt()));T("function arguments",k)}function Xt(){var e=o|f|c|h|p,n=k.value,r=k.type,i;mt&&(i=gt());if(r&e){wt(i);var s=t.slice(k.range[0],k.range[1]);return $(),m(v.literal(r,n,s))}if(u===r&&"function"===n)return wt(i),$(),Bt(null);if(J("{"))return wt(i),Ft()}function Vt(s,o){return"undefined"==typeof o&&"object"==typeof s&&(o=s,s=undefined),o||(o={}),t=s||"",n=S(i,o),C=0,_=1,D=0,r=t.length,ot=[[]],ut=0,at=[],vt=[],n.comments&&(O=[]),n.wait?e:Jt()}function $t(n){return t+=String(n),r=t.length,e}function Jt(e){"undefined"!=typeof e&&$t(e),r=t.length,mt=n.locations||n.ranges,A=P();var i=Et();n.comments&&(i.comments=O),n.scope&&(i.globals=at);if(vt.length>0)throw new Error("Location tracking failed. This is most likely a bug in luaparse");return i}e.version="0.1.4";var t,n,r,i=e.defaultOptions={wait:!1,comments:!0,scope:!1,locations:!1,ranges:!1},s=1,o=2,u=4,a=8,f=16,l=32,c=64,h=128,p=256;e.tokenTypes={EOF:s,StringLiteral:o,Keyword:u,Identifier:a,NumericLiteral:f,Punctuator:l,BooleanLiteral:c,NilLiteral:h,VarargLiteral:p};var d=e.errors={unexpected:"Unexpected %1 '%2' near '%3'",expected:"'%1' expected near '%2'",expectedToken:"%1 expected near '%2'",unfinishedString:"unfinished string near '%1'",malformedNumber:"malformed number near '%1'"},v=e.ast={labelStatement:function(e){return{type:"LabelStatement",label:e}},breakStatement:function(){return{type:"BreakStatement"}},gotoStatement:function(e){return{type:"GotoStatement",label:e}},returnStatement:function(e){return{type:"ReturnStatement",arguments:e}},ifStatement:function(e){return{type:"IfStatement",clauses:e}},ifClause:function(e,t){return{type:"IfClause",condition:e,body:t}},elseifClause:function(e,t){return{type:"ElseifClause",condition:e,body:t}},elseClause:function(e){return{type:"ElseClause",body:e}},whileStatement:function(e,t){return{type:"WhileStatement",condition:e,body:t}},doStatement:function(e){return{type:"DoStatement",body:e}},repeatStatement:function(e,t){return{type:"RepeatStatement",condition:e,body:t}},localStatement:function(e,t){return{type:"LocalStatement",variables:e,init:t}},assignmentStatement:function(e,t){return{type:"AssignmentStatement",variables:e,init:t}},callStatement:function(e){return{type:"CallStatement",expression:e}},functionStatement:function(e,t,n,r){return{type:"FunctionDeclaration",identifier:e,isLocal:n,parameters:t,body:r}},forNumericStatement:function(e,t,n,r,i){return{type:"ForNumericStatement",variable:e,start:t,end:n,step:r,body:i}},forGenericStatement:function(e,t,n){return{type:"ForGenericStatement",variables:e,iterators:t,body:n}},chunk:function(e){return{type:"Chunk",body:e}},identifier:function(e){return{type:"Identifier",name:e}},literal:function(e,t,n){return e=e===o?"StringLiteral":e===f?"NumericLiteral":e===c?"BooleanLiteral":e===h?"NilLiteral":"VarargLiteral",{type:e,value:t,raw:n}},tableKey:function(e,t){return{type:"TableKey",key:e,value:t}},tableKeyString:function(e,t){return{type:"TableKeyString",key:e,value:t}},tableValue:function(e){return{type:"TableValue",value:e}},tableConstructorExpression:function(e){return{type:"TableConstructorExpression",fields:e}},binaryExpression:function(e,t,n){var r="and"===e||"or"===e?"LogicalExpression":"BinaryExpression";return{type:r,operator:e,left:t,right:n}},unaryExpression:function(e,t){return{type:"UnaryExpression",operator:e,argument:t}},memberExpression:function(e,t,n){return{type:"MemberExpression",indexer:t,identifier:n,base:e}},indexExpression:function(e,t){return{type:"IndexExpression",base:e,index:t}},callExpression:function(e,t){return{type:"CallExpression",base:e,arguments:t}},tableCallExpression:function(e,t){return{type:"TableCallExpression",base:e,arguments:t}},stringCallExpression:function(e,t){return{type:"StringCallExpression",base:e,argument:t}},comment:function(e,t){return{type:"Comment",value:e,raw:t}}},g=Array.prototype.slice,y=Object.prototype.toString,b=function(t,n){for(var r=0,i=t.length;r<i;r++)if(t[r]===n)return r;return-1},C,k,L,A,O,M,_,D;e.lex=P;var ot,ut,at,vt=[],mt;yt.prototype.complete=function(){n.locations&&(this.loc.end.line=L.line,this.loc.end.column=L.range[1]-L.lineStart),n.ranges&&(this.range[1]=L.range[1])},e.parse=Vt,e.write=$t,e.end=Jt})});