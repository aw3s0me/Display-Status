/*
 * jquery.coords
 * https://github.com/ducksboard/gridster.js
 *
 * Copyright (c) 2012 ducksboard
 * Licensed under the MIT licenses.
 */

(function(e,t,n,r){function i(t){return t[0]&&e.isPlainObject(t[0])?this.data=t[0]:this.el=t,this.isCoords=!0,this.coords={},this.init(),this}var s=i.prototype;s.init=function(){this.set(),this.original_coords=this.get()},s.set=function(e,t){var n=this.el;n&&!e&&(this.data=n.offset(),this.data.width=n.width(),this.data.height=n.height());if(n&&e&&!t){var r=n.offset();this.data.top=r.top,this.data.left=r.left}var i=this.data;return typeof i.left=="undefined"&&(i.left=i.x1),typeof i.top=="undefined"&&(i.top=i.y1),this.coords.x1=i.left,this.coords.y1=i.top,this.coords.x2=i.left+i.width,this.coords.y2=i.top+i.height,this.coords.cx=i.left+i.width/2,this.coords.cy=i.top+i.height/2,this.coords.width=i.width,this.coords.height=i.height,this.coords.el=n||!1,this},s.update=function(t){if(!t&&!this.el)return this;if(t){var n=e.extend({},this.data,t);return this.data=n,this.set(!0,!0)}return this.set(!0),this},s.get=function(){return this.coords},s.destroy=function(){this.el.removeData("coords"),delete this.el},e.fn.coords=function(){if(this.data("coords"))return this.data("coords");var e=new i(this,arguments[0]);return this.data("coords",e),e}})(jQuery,window,document);