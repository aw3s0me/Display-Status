define(["../core","../manipulation"],function(e){function r(t,n){var r=e(n.createElement(t)).appendTo(n.body),i=window.getDefaultComputedStyle?window.getDefaultComputedStyle(r[0]).display:e.css(r[0],"display");return r.detach(),i}function i(i){var s=document,o=n[i];if(!o){o=r(i,s);if(o==="none"||!o)t=(t||e("<iframe frameborder='0' width='0' height='0'/>")).appendTo(s.documentElement),s=t[0].contentDocument,s.write(),s.close(),o=r(i,s),t.detach();n[i]=o}return o}var t,n={};return i});