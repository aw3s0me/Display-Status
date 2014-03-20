/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

window.log=function(){log.history=log.history||[],log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var e=[].slice.call(arguments);typeof console.log=="object"?log.apply.call(console.log,console,e):console.log.apply(console,e)}},function(e){function t(){}for(var n="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),r;r=n.pop();)e[r]=e[r]||t}(function(){try{return console.log(),window.console}catch(e){return window.console={}}}()),function(e,t){var n=e.jQuery||e.Cowboy||(e.Cowboy={}),r;n.throttle=r=function(e,r,i,s){function a(){function p(){u=+(new Date),i.apply(n,l)}function v(){o=t}var n=this,a=+(new Date)-u,l=arguments;s&&!o&&p(),o&&clearTimeout(o),s===t&&a>e?p():r!==!0&&(o=setTimeout(s?v:p,s===t?e-a:e))}var o,u=0;return typeof r!="boolean"&&(s=i,i=r,r=t),n.guid&&(a.guid=i.guid=i.guid||n.guid++),a},n.debounce=function(e,n,i){return i===t?r(e,n,!1):r(e,i,n!==!1)}}(this);