/*!
 * Collapse plugin for jQuery
 * http://github.com/danielstocks/jQuery-Collapse/
 *
 * @author Daniel Stocks (http://webcloud.se)
 * @version 0.9.1
 * @updated 17-AUG-2010
 * 
 * Copyright 2010, Daniel Stocks
 * Released under the MIT, BSD, and GPL Licenses.
 */

(function(e){var t=0;e.fn.extend({collapse:function(r){var i={head:"h3",group:"div, ul",cookieName:"collapse",show:function(){this.show()},hide:function(){this.hide()}},s=e.extend(i,r),o="active",u="inactive";return this.each(function(){t++;var r=e(this),i=r.find(s.head).wrapInner('<a href="#"></a>'),a=i.length,f=s.cookieName+"_"+t,l=r.find(s.head).map(function(){var t=e(this);return t.hasClass(o)?t.next(s.group)[0]:t.next(s.group).hide()[0]});r.bind("show",function(t,n){var r=e(t.target);r.attr("aria-hidden",!1).prev().removeClass(u).addClass(o),n?r.show():s.show.call(r)}),r.bind("hide",function(t,n){var r=e(t.target);r.attr("aria-hidden",!0).prev().removeClass(o).addClass(u),n?r.hide():s.hide.call(r)});if(n)for(var c=0;c<=a;c++){var h=e.cookie(f+c);h==c+"open"?l.eq(c).trigger("show",[!0]):h==c+"closed"&&l.eq(c).trigger("hide",[!0])}r.bind("click",function(t){var r=e(t.target);if(!r.is(s.head)){if(!r.parent().is(s.head))return;r=r.parent(),t.preventDefault()}var u=i.index(r),a=f+u,l=u,c=r.next(s.group);if(r.hasClass(o)){c.trigger("hide"),l+="closed",n&&e.cookie(a,l,{path:"/",expires:10});return}c.trigger("show"),l+="open",n&&e.cookie(a,l,{path:"/",expires:10})})})}});var n=function(){try{e.cookie("x","x",{path:"/",expires:10}),e.cookie("x",null)}catch(t){return!1}return!0}()})(jQuery);