define(["./core","./var/rnotwhite","./core/access","./data/var/data_priv","./data/var/data_user"],function(e,t,n,r,i){function u(t,n,r){var u;if(r===undefined&&t.nodeType===1){u="data-"+n.replace(o,"-$1").toLowerCase(),r=t.getAttribute(u);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:s.test(r)?e.parseJSON(r):r}catch(a){}i.set(t,n,r)}else r=undefined}return r}var s=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,o=/([A-Z])/g;return e.extend({hasData:function(e){return i.hasData(e)||r.hasData(e)},data:function(e,t,n){return i.access(e,t,n)},removeData:function(e,t){i.remove(e,t)},_data:function(e,t,n){return r.access(e,t,n)},_removeData:function(e,t){r.remove(e,t)}}),e.fn.extend({data:function(t,s){var o,a,f,l=this[0],c=l&&l.attributes;if(t===undefined){if(this.length){f=i.get(l);if(l.nodeType===1&&!r.get(l,"hasDataAttrs")){o=c.length;while(o--)a=c[o].name,a.indexOf("data-")===0&&(a=e.camelCase(a.slice(5)),u(l,a,f[a]));r.set(l,"hasDataAttrs",!0)}}return f}return typeof t=="object"?this.each(function(){i.set(this,t)}):n(this,function(n){var r,s=e.camelCase(t);if(l&&n===undefined){r=i.get(l,t);if(r!==undefined)return r;r=i.get(l,s);if(r!==undefined)return r;r=u(l,s,undefined);if(r!==undefined)return r;return}this.each(function(){var e=i.get(this,s);i.set(this,s,n),t.indexOf("-")!==-1&&e!==undefined&&i.set(this,t,n)})},null,s,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){i.remove(this,e)})}}),e});