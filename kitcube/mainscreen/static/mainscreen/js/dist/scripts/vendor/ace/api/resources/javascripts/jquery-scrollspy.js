/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 */

(function(e,t,n,r){e.fn.extend({scrollspy:function(n){var r={min:0,max:0,mode:"vertical",buffer:0,container:t,onEnter:n.onEnter?n.onEnter:[],onLeave:n.onLeave?n.onLeave:[],onTick:n.onTick?n.onTick:[]},n=e.extend({},r,n);return this.each(function(t){var r=this,i=n,s=e(i.container),o=i.mode,u=i.buffer,a=leaves=0,f=!1;s.bind("scroll",function(t){var n={top:e(this).scrollTop(),left:e(this).scrollLeft()},l=o=="vertical"?n.top+u:n.left+u,c=i.max,h=i.min;e.isFunction(i.max)&&(c=i.max()),e.isFunction(i.min)&&(h=i.min()),c==0&&(c=o=="vertical"?s.height():s.outerWidth()+e(r).outerWidth()),l>=i.min&&l<=c?(f||(f=!0,a++,e(r).trigger("scrollEnter",{position:n}),e.isFunction(i.onEnter)&&i.onEnter(r,n)),e(r).trigger("scrollTick",{position:n,inside:f,enters:a,leaves:leaves}),e.isFunction(i.onTick)&&i.onTick(r,n,f,a,leaves)):f&&(f=!1,leaves++,e(r).trigger("scrollLeave",{position:n,leaves:leaves}),e.isFunction(i.onLeave)&&i.onLeave(r,n))})})}})})(jQuery,window);