define(["./core","./var/strundefined","./core/access","./css/var/rnumnonpx","./css/curCSS","./css/addGetHookIf","./css/support","./core/init","./css","./selector"],function(e,t,n,r,i,s,o){function a(t){return e.isWindow(t)?t:t.nodeType===9&&t.defaultView}var u=window.document.documentElement;return e.offset={setOffset:function(t,n,r){var i,s,o,u,a,f,l,c=e.css(t,"position"),h=e(t),p={};c==="static"&&(t.style.position="relative"),a=h.offset(),o=e.css(t,"top"),f=e.css(t,"left"),l=(c==="absolute"||c==="fixed")&&(o+f).indexOf("auto")>-1,l?(i=h.position(),u=i.top,s=i.left):(u=parseFloat(o)||0,s=parseFloat(f)||0),e.isFunction(n)&&(n=n.call(t,r,a)),n.top!=null&&(p.top=n.top-a.top+u),n.left!=null&&(p.left=n.left-a.left+s),"using"in n?n.using.call(t,p):h.css(p)}},e.fn.extend({offset:function(n){if(arguments.length)return n===undefined?this:this.each(function(t){e.offset.setOffset(this,n,t)});var r,i,s=this[0],o={top:0,left:0},u=s&&s.ownerDocument;if(!u)return;return r=u.documentElement,e.contains(r,s)?(typeof s.getBoundingClientRect!==t&&(o=s.getBoundingClientRect()),i=a(u),{top:o.top+i.pageYOffset-r.clientTop,left:o.left+i.pageXOffset-r.clientLeft}):o},position:function(){if(!this[0])return;var t,n,r=this[0],i={top:0,left:0};return e.css(r,"position")==="fixed"?n=r.getBoundingClientRect():(t=this.offsetParent(),n=this.offset(),e.nodeName(t[0],"html")||(i=t.offset()),i.top+=e.css(t[0],"borderTopWidth",!0),i.left+=e.css(t[0],"borderLeftWidth",!0)),{top:n.top-i.top-e.css(r,"marginTop",!0),left:n.left-i.left-e.css(r,"marginLeft",!0)}},offsetParent:function(){return this.map(function(){var t=this.offsetParent||u;while(t&&!e.nodeName(t,"html")&&e.css(t,"position")==="static")t=t.offsetParent;return t||u})}}),e.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,r){var i="pageYOffset"===r;e.fn[t]=function(e){return n(this,function(e,t,n){var s=a(e);if(n===undefined)return s?s[r]:e[t];s?s.scrollTo(i?window.pageXOffset:n,i?n:window.pageYOffset):e[t]=n},t,e,arguments.length,null)}}),e.each(["top","left"],function(t,n){e.cssHooks[n]=s(o.pixelPosition,function(t,s){if(s)return s=i(t,n),r.test(s)?e(t).position()[n]+"px":s})}),e});