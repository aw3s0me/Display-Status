Modernizr.addTest("regions",function(){var e=Modernizr.prefixed("flowFrom"),t=Modernizr.prefixed("flowInto");if(!e||!t)return!1;var n=document.createElement("div"),r=document.createElement("div"),i=document.createElement("div"),s="modernizr_flow_for_regions_check";r.innerText="M",n.style.cssText="top: 150px; left: 150px; padding: 0px;",i.style.cssText="width: 50px; height: 50px; padding: 42px;",i.style[e]=s,n.appendChild(r),n.appendChild(i),document.documentElement.appendChild(n);var o,u,a=r.getBoundingClientRect();return r.style[t]=s,o=r.getBoundingClientRect(),u=o.left-a.left,document.documentElement.removeChild(n),r=i=n=undefined,u==42});