!function(e){var t=function(e,t){this.init(e,t)};t.prototype={constructor:t,init:function(t,n){var r=this.$element=e(t);this.options=e.extend({},e.fn.checkbox.defaults,n),r.before(this.options.template),this.setState()},setState:function(){var e=this.$element,t=e.closest(".checkbox");e.prop("disabled")&&t.addClass("disabled"),e.prop("checked")&&t.addClass("checked")},toggle:function(){var t="checked",n=this.$element,r=n.closest(".checkbox"),i=n.prop(t),s=e.Event("toggle");n.prop("disabled")==0&&(r.toggleClass(t)&&i?n.removeAttr(t):n.prop(t,t),n.trigger(s).trigger("change"))},setCheck:function(t){var n="disabled",r="checked",i=this.$element,s=i.closest(".checkbox"),o=t=="check"?!0:!1,u=e.Event(t);s[o?"addClass":"removeClass"](r)&&o?i.prop(r,r):i.removeAttr(r),i.trigger(u).trigger("change")}};var n=e.fn.checkbox;e.fn.checkbox=function(n){return this.each(function(){var r=e(this),i=r.data("checkbox"),s=e.extend({},e.fn.checkbox.defaults,r.data(),typeof n=="object"&&n);i||r.data("checkbox",i=new t(this,s)),n=="toggle"&&i.toggle(),n=="check"||n=="uncheck"?i.setCheck(n):n&&i.setState()})},e.fn.checkbox.defaults={template:'<span class="icons"><span class="first-icon fui-checkbox-unchecked"></span><span class="second-icon fui-checkbox-checked"></span></span>'},e.fn.checkbox.noConflict=function(){return e.fn.checkbox=n,this},e(document).on("click.checkbox.data-api","[data-toggle^=checkbox], .checkbox",function(t){var n=e(t.target);t.target.tagName!="A"&&(t&&t.preventDefault()&&t.stopPropagation(),n.hasClass("checkbox")||(n=n.closest(".checkbox")),n.find(":checkbox").checkbox("toggle"))}),e(function(){e('[data-toggle="checkbox"]').each(function(){var t=e(this);t.checkbox()})})}(window.jQuery);