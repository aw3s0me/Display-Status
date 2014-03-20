define(["./core","./var/concat","./var/push","./core/access","./manipulation/var/rcheckableType","./manipulation/support","./data/var/data_priv","./data/var/data_user","./core/init","./data/accepts","./traversing","./selector","./event"],function(e,t,n,r,i,s,o,u){function g(t,n){return e.nodeName(t,"table")&&e.nodeName(n.nodeType!==11?n:n.firstChild,"tr")?t.getElementsByTagName("tbody")[0]||t.appendChild(t.ownerDocument.createElement("tbody")):t}function y(e){return e.type=(e.getAttribute("type")!==null)+"/"+e.type,e}function b(e){var t=d.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function w(e,t){var n=0,r=e.length;for(;n<r;n++)o.set(e[n],"globalEval",!t||o.get(t[n],"globalEval"))}function E(t,n){var r,i,s,a,f,l,c,h;if(n.nodeType!==1)return;if(o.hasData(t)){a=o.access(t),f=o.set(n,a),h=a.events;if(h){delete f.handle,f.events={};for(s in h)for(r=0,i=h[s].length;r<i;r++)e.event.add(n,s,h[s][r])}}u.hasData(t)&&(l=u.access(t),c=e.extend({},l),u.set(n,c))}function S(t,n){var r=t.getElementsByTagName?t.getElementsByTagName(n||"*"):t.querySelectorAll?t.querySelectorAll(n||"*"):[];return n===undefined||n&&e.nodeName(t,n)?e.merge([t],r):r}function x(e,t){var n=t.nodeName.toLowerCase();if(n==="input"&&i.test(e.type))t.checked=e.checked;else if(n==="input"||n==="textarea")t.defaultValue=e.defaultValue}var a=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,f=/<([\w:]+)/,l=/<|&#?\w+;/,c=/<(?:script|style|link)/i,h=/checked\s*(?:[^=]|=\s*.checked.)/i,p=/^$|\/(?:java|ecma)script/i,d=/^true\/(.*)/,v=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,m={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};return m.optgroup=m.option,m.tbody=m.tfoot=m.colgroup=m.caption=m.thead,m.th=m.td,e.extend({clone:function(t,n,r){var i,o,u,a,f=t.cloneNode(!0),l=e.contains(t.ownerDocument,t);if(!s.noCloneChecked&&(t.nodeType===1||t.nodeType===11)&&!e.isXMLDoc(t)){a=S(f),u=S(t);for(i=0,o=u.length;i<o;i++)x(u[i],a[i])}if(n)if(r){u=u||S(t),a=a||S(f);for(i=0,o=u.length;i<o;i++)E(u[i],a[i])}else E(t,f);return a=S(f,"script"),a.length>0&&w(a,!l&&S(t,"script")),f},buildFragment:function(t,n,r,i){var s,o,u,c,h,d,v=n.createDocumentFragment(),g=[],y=0,b=t.length;for(;y<b;y++){s=t[y];if(s||s===0)if(e.type(s)==="object")e.merge(g,s.nodeType?[s]:s);else if(!l.test(s))g.push(n.createTextNode(s));else{o=o||v.appendChild(n.createElement("div")),u=(f.exec(s)||["",""])[1].toLowerCase(),c=m[u]||m._default,o.innerHTML=c[1]+s.replace(a,"<$1></$2>")+c[2],d=c[0];while(d--)o=o.lastChild;e.merge(g,o.childNodes),o=v.firstChild,o.textContent=""}}v.textContent="",y=0;while(s=g[y++]){if(i&&e.inArray(s,i)!==-1)continue;h=e.contains(s.ownerDocument,s),o=S(v.appendChild(s),"script"),h&&w(o);if(r){d=0;while(s=o[d++])p.test(s.type||"")&&r.push(s)}}return v},cleanData:function(t){var n,r,i,s,a,f,l=e.event.special,c=0;for(;(r=t[c])!==undefined;c++){if(e.acceptData(r)){a=r[o.expando];if(a&&(n=o.cache[a])){i=Object.keys(n.events||{});if(i.length)for(f=0;(s=i[f])!==undefined;f++)l[s]?e.event.remove(r,s):e.removeEvent(r,s,n.handle);o.cache[a]&&delete o.cache[a]}}delete u.cache[r[u.expando]]}}}),e.fn.extend({text:function(t){return r(this,function(t){return t===undefined?e.text(this):this.empty().each(function(){if(this.nodeType===1||this.nodeType===11||this.nodeType===9)this.textContent=t})},null,t,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var t=g(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var t=g(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(t,n){var r,i=t?e.filter(t,this):this,s=0;for(;(r=i[s])!=null;s++)!n&&r.nodeType===1&&e.cleanData(S(r)),r.parentNode&&(n&&e.contains(r.ownerDocument,r)&&w(S(r,"script")),r.parentNode.removeChild(r));return this},empty:function(){var t,n=0;for(;(t=this[n])!=null;n++)t.nodeType===1&&(e.cleanData(S(t,!1)),t.textContent="");return this},clone:function(t,n){return t=t==null?!1:t,n=n==null?t:n,this.map(function(){return e.clone(this,t,n)})},html:function(t){return r(this,function(t){var n=this[0]||{},r=0,i=this.length;if(t===undefined&&n.nodeType===1)return n.innerHTML;if(typeof t=="string"&&!c.test(t)&&!m[(f.exec(t)||["",""])[1].toLowerCase()]){t=t.replace(a,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(e.cleanData(S(n,!1)),n.innerHTML=t);n=0}catch(s){}}n&&this.empty().append(t)},null,t,arguments.length)},replaceWith:function(){var t=arguments[0];return this.domManip(arguments,function(n){t=this.parentNode,e.cleanData(S(this)),t&&t.replaceChild(n,this)}),t&&(t.length||t.nodeType)?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(n,r){n=t.apply([],n);var i,u,a,f,l,c,d=0,m=this.length,g=this,w=m-1,E=n[0],x=e.isFunction(E);if(x||m>1&&typeof E=="string"&&!s.checkClone&&h.test(E))return this.each(function(e){var t=g.eq(e);x&&(n[0]=E.call(this,e,t.html())),t.domManip(n,r)});if(m){i=e.buildFragment(n,this[0].ownerDocument,!1,this),u=i.firstChild,i.childNodes.length===1&&(i=u);if(u){a=e.map(S(i,"script"),y),f=a.length;for(;d<m;d++)l=i,d!==w&&(l=e.clone(l,!0,!0),f&&e.merge(a,S(l,"script"))),r.call(this[d],l,d);if(f){c=a[a.length-1].ownerDocument,e.map(a,b);for(d=0;d<f;d++)l=a[d],p.test(l.type||"")&&!o.access(l,"globalEval")&&e.contains(c,l)&&(l.src?e._evalUrl&&e._evalUrl(l.src):e.globalEval(l.textContent.replace(v,"")))}}}return this}}),e.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(t,r){e.fn[t]=function(t){var i,s=[],o=e(t),u=o.length-1,a=0;for(;a<=u;a++)i=a===u?this:this.clone(!0),e(o[a])[r](i),n.apply(s,i.get());return this.pushStack(s)}}),e});