/*!
 * typeahead.js 0.9.3
 * https://github.com/twitter/typeahead
 * Copyright 2013 Twitter, Inc. and other contributors; Licensed MIT
 */

(function(e){var t="0.9.3",n={isMsie:function(){var e=/(msie) ([\w.]+)/i.exec(navigator.userAgent);return e?parseInt(e[2],10):!1},isBlankString:function(e){return!e||/^\s*$/.test(e)},escapeRegExChars:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},isString:function(e){return typeof e=="string"},isNumber:function(e){return typeof e=="number"},isArray:e.isArray,isFunction:e.isFunction,isObject:e.isPlainObject,isUndefined:function(e){return typeof e=="undefined"},bind:e.proxy,bindAll:function(t){var n;for(var r in t)e.isFunction(n=t[r])&&(t[r]=e.proxy(n,t))},indexOf:function(e,t){for(var n=0;n<e.length;n++)if(e[n]===t)return n;return-1},each:e.each,map:e.map,filter:e.grep,every:function(t,n){var r=!0;return t?(e.each(t,function(e,i){if(!(r=n.call(null,i,e,t)))return!1}),!!r):r},some:function(t,n){var r=!1;return t?(e.each(t,function(e,i){if(r=n.call(null,i,e,t))return!1}),!!r):r},mixin:e.extend,getUniqueId:function(){var e=0;return function(){return e++}}(),defer:function(e){setTimeout(e,0)},debounce:function(e,t,n){var r,i;return function(){var s=this,o=arguments,u,a;return u=function(){r=null,n||(i=e.apply(s,o))},a=n&&!r,clearTimeout(r),r=setTimeout(u,t),a&&(i=e.apply(s,o)),i}},throttle:function(e,t){var n,r,i,s,o,u;return o=0,u=function(){o=new Date,i=null,s=e.apply(n,r)},function(){var a=new Date,f=t-(a-o);return n=this,r=arguments,f<=0?(clearTimeout(i),i=null,o=a,s=e.apply(n,r)):i||(i=setTimeout(u,f)),s}},tokenizeQuery:function(t){return e.trim(t).toLowerCase().split(/[\s]+/)},tokenizeText:function(t){return e.trim(t).toLowerCase().split(/[\s\-_]+/)},getProtocol:function(){return location.protocol},noop:function(){}},r=function(){var e=/\s+/;return{on:function(t,n){var r;if(!n)return this;this._callbacks=this._callbacks||{},t=t.split(e);while(r=t.shift())this._callbacks[r]=this._callbacks[r]||[],this._callbacks[r].push(n);return this},trigger:function(t,n){var r,i;if(!this._callbacks)return this;t=t.split(e);while(r=t.shift())if(i=this._callbacks[r])for(var s=0;s<i.length;s+=1)i[s].call(this,{type:r,data:n});return this}}}(),i=function(){function r(t){(!t||!t.el)&&e.error("EventBus initialized without el"),this.$el=e(t.el)}var t="typeahead:";return n.mixin(r.prototype,{trigger:function(e){var n=[].slice.call(arguments,1);this.$el.trigger(t+e,n)}}),r}(),s=function(){function i(e){this.prefix=["__",e,"__"].join(""),this.ttlKey="__ttl__",this.keyMatcher=new RegExp("^"+this.prefix)}function s(){return(new Date).getTime()}function o(e){return JSON.stringify(n.isUndefined(e)?null:e)}function u(e){return JSON.parse(e)}var e,t;try{e=window.localStorage,e.setItem("~~~","!"),e.removeItem("~~~")}catch(r){e=null}return e&&window.JSON?t={_prefix:function(e){return this.prefix+e},_ttlKey:function(e){return this._prefix(e)+this.ttlKey},get:function(t){return this.isExpired(t)&&this.remove(t),u(e.getItem(this._prefix(t)))},set:function(t,r,i){return n.isNumber(i)?e.setItem(this._ttlKey(t),o(s()+i)):e.removeItem(this._ttlKey(t)),e.setItem(this._prefix(t),o(r))},remove:function(t){return e.removeItem(this._ttlKey(t)),e.removeItem(this._prefix(t)),this},clear:function(){var t,n,r=[],i=e.length;for(t=0;t<i;t++)(n=e.key(t)).match(this.keyMatcher)&&r.push(n.replace(this.keyMatcher,""));for(t=r.length;t--;)this.remove(r[t]);return this},isExpired:function(t){var r=u(e.getItem(this._ttlKey(t)));return n.isNumber(r)&&s()>r?!0:!1}}:t={get:n.noop,set:n.noop,remove:n.noop,clear:n.noop,isExpired:n.noop},n.mixin(i.prototype,t),i}(),o=function(){function e(e){n.bindAll(this),e=e||{},this.sizeLimit=e.sizeLimit||10,this.cache={},this.cachedKeysByAge=[]}return n.mixin(e.prototype,{get:function(e){return this.cache[e]},set:function(e,t){var n;this.cachedKeysByAge.length===this.sizeLimit&&(n=this.cachedKeysByAge.shift(),delete this.cache[n]),this.cache[e]=t,this.cachedKeysByAge.push(e)}}),e}(),u=function(){function u(e){n.bindAll(this),e=n.isString(e)?{url:e}:e,s=s||new o,i=n.isNumber(e.maxParallelRequests)?e.maxParallelRequests:i||6,this.url=e.url,this.wildcard=e.wildcard||"%QUERY",this.filter=e.filter,this.replace=e.replace,this.ajaxSettings={type:"get",cache:e.cache,timeout:e.timeout,dataType:e.dataType||"json",beforeSend:e.beforeSend},this._get=(/^throttle$/i.test(e.rateLimitFn)?n.throttle:n.debounce)(this._get,e.rateLimitWait||300)}function a(){t++}function f(){t--}function l(){return t<i}var t=0,r={},i,s;return n.mixin(u.prototype,{_get:function(e,t){function r(r){var i=n.filter?n.filter(r):r;t&&t(i),s.set(e,r)}var n=this;l()?this._sendRequest(e).done(r):this.onDeckRequestArgs=[].slice.call(arguments,0)},_sendRequest:function(t){function s(){f(),r[t]=null,n.onDeckRequestArgs&&(n._get.apply(n,n.onDeckRequestArgs),n.onDeckRequestArgs=null)}var n=this,i=r[t];return i||(a(),i=r[t]=e.ajax(t,this.ajaxSettings).always(s)),i},get:function(e,t){var r=this,i=encodeURIComponent(e||""),o,u;return t=t||n.noop,o=this.replace?this.replace(this.url,i):this.url.replace(this.wildcard,i),(u=s.get(o))?n.defer(function(){t(r.filter?r.filter(u):u)}):this._get(o,t),!!u}}),u}(),a=function(){function i(t){n.bindAll(this),n.isString(t.template)&&!t.engine&&e.error("no template engine specified"),!t.local&&!t.prefetch&&!t.remote&&e.error("one of local, prefetch, or remote is required"),this.name=t.name||n.getUniqueId(),this.limit=t.limit||5,this.minLength=t.minLength||1,this.header=t.header,this.footer=t.footer,this.valueKey=t.valueKey||"value",this.template=o(t.template,t.engine,this.valueKey),this.local=t.local,this.prefetch=t.prefetch,this.remote=t.remote,this.itemHash={},this.adjacencyList={},this.storage=t.name?new s(t.name):null}function o(e,t,r){var i,s;return n.isFunction(e)?i=e:n.isString(e)?(s=t.compile(e),i=n.bind(s.render,s)):i=function(e){return"<p>"+e[r]+"</p>"},i}var r={thumbprint:"thumbprint",protocol:"protocol",itemHash:"itemHash",adjacencyList:"adjacencyList"};return n.mixin(i.prototype,{_processLocalData:function(e){this._mergeProcessedData(this._processData(e))},_loadPrefetchData:function(i){function p(e){var t=i.filter?i.filter(e):e,u=s._processData(t),a=u.itemHash,f=u.adjacencyList;s.storage&&(s.storage.set(r.itemHash,a,i.ttl),s.storage.set(r.adjacencyList,f,i.ttl),s.storage.set(r.thumbprint,o,i.ttl),s.storage.set(r.protocol,n.getProtocol(),i.ttl)),s._mergeProcessedData(u)}var s=this,o=t+(i.thumbprint||""),u,a,f,l,c,h;return this.storage&&(u=this.storage.get(r.thumbprint),a=this.storage.get(r.protocol),f=this.storage.get(r.itemHash),l=this.storage.get(r.adjacencyList)),c=u!==o||a!==n.getProtocol(),i=n.isString(i)?{url:i}:i,i.ttl=n.isNumber(i.ttl)?i.ttl:864e5,f&&l&&!c?(this._mergeProcessedData({itemHash:f,adjacencyList:l}),h=e.Deferred().resolve()):h=e.getJSON(i.url).done(p),h},_transformDatum:function(e){var t=n.isString(e)?e:e[this.valueKey],r=e.tokens||n.tokenizeText(t),i={value:t,tokens:r};return n.isString(e)?(i.datum={},i.datum[this.valueKey]=e):i.datum=e,i.tokens=n.filter(i.tokens,function(e){return!n.isBlankString(e)}),i.tokens=n.map(i.tokens,function(e){return e.toLowerCase()}),i},_processData:function(e){var t=this,r={},i={};return n.each(e,function(e,s){var o=t._transformDatum(s),u=n.getUniqueId(o.value);r[u]=o,n.each(o.tokens,function(e,t){var r=t.charAt(0),s=i[r]||(i[r]=[u]);!~n.indexOf(s,u)&&s.push(u)})}),{itemHash:r,adjacencyList:i}},_mergeProcessedData:function(e){var t=this;n.mixin(this.itemHash,e.itemHash),n.each(e.adjacencyList,function(e,n){var r=t.adjacencyList[e];t.adjacencyList[e]=r?r.concat(n):n})},_getLocalSuggestions:function(e){var t=this,r=[],i=[],s,o=[];return n.each(e,function(e,t){var i=t.charAt(0);!~n.indexOf(r,i)&&r.push(i)}),n.each(r,function(e,n){var r=t.adjacencyList[n];if(!r)return!1;i.push(r);if(!s||r.length<s.length)s=r}),i.length<r.length?[]:(n.each(s,function(r,s){var u=t.itemHash[s],a,f;a=n.every(i,function(e){return~n.indexOf(e,s)}),f=a&&n.every(e,function(e){return n.some(u.tokens,function(t){return t.indexOf(e)===0})}),f&&o.push(u)}),o)},initialize:function(){var t;return this.local&&this._processLocalData(this.local),this.transport=this.remote?new u(this.remote):null,t=this.prefetch?this._loadPrefetchData(this.prefetch):e.Deferred().resolve(),this.local=this.prefetch=this.remote=null,this.initialize=function(){return t},t},getSuggestions:function(e,t){function u(e){s=s.slice(0),n.each(e,function(e,t){var i=r._transformDatum(t),o;return o=n.some(s,function(e){return i.value===e.value}),!o&&s.push(i),s.length<r.limit}),t&&t(s)}var r=this,i,s,o=!1;if(e.length<this.minLength)return;i=n.tokenizeQuery(e),s=this._getLocalSuggestions(i).slice(0,this.limit),s.length<this.limit&&this.transport&&(o=this.transport.get(e,u)),!o&&t&&t(s)}}),i}(),f=function(){function t(t){var r=this;n.bindAll(this),this.specialKeyCodeMap={9:"tab",27:"esc",37:"left",39:"right",13:"enter",38:"up",40:"down"},this.$hint=e(t.hint),this.$input=e(t.input).on("blur.tt",this._handleBlur).on("focus.tt",this._handleFocus).on("keydown.tt",this._handleSpecialKeyEvent),n.isMsie()?this.$input.on("keydown.tt keypress.tt cut.tt paste.tt",function(e){if(r.specialKeyCodeMap[e.which||e.keyCode])return;n.defer(r._compareQueryToInputValue)}):this.$input.on("input.tt",this._compareQueryToInputValue),this.query=this.$input.val(),this.$overflowHelper=i(this.$input)}function i(t){return e("<span></span>").css({position:"absolute",left:"-9999px",visibility:"hidden",whiteSpace:"nowrap",fontFamily:t.css("font-family"),fontSize:t.css("font-size"),fontStyle:t.css("font-style"),fontVariant:t.css("font-variant"),fontWeight:t.css("font-weight"),wordSpacing:t.css("word-spacing"),letterSpacing:t.css("letter-spacing"),textIndent:t.css("text-indent"),textRendering:t.css("text-rendering"),textTransform:t.css("text-transform")}).insertAfter(t)}function s(e,t){return e=(e||"").replace(/^\s*/g,"").replace(/\s{2,}/g," "),t=(t||"").replace(/^\s*/g,"").replace(/\s{2,}/g," "),e===t}return n.mixin(t.prototype,r,{_handleFocus:function(){this.trigger("focused")},_handleBlur:function(){this.trigger("blured")},_handleSpecialKeyEvent:function(e){var t=this.specialKeyCodeMap[e.which||e.keyCode];t&&this.trigger(t+"Keyed",e)},_compareQueryToInputValue:function(){var e=this.getInputValue(),t=s(this.query,e),n=t?this.query.length!==e.length:!1;n?this.trigger("whitespaceChanged",{value:this.query}):t||this.trigger("queryChanged",{value:this.query=e})},destroy:function(){this.$hint.off(".tt"),this.$input.off(".tt"),this.$hint=this.$input=this.$overflowHelper=null},focus:function(){this.$input.focus()},blur:function(){this.$input.blur()},getQuery:function(){return this.query},setQuery:function(e){this.query=e},getInputValue:function(){return this.$input.val()},setInputValue:function(e,t){this.$input.val(e),!t&&this._compareQueryToInputValue()},getHintValue:function(){return this.$hint.val()},setHintValue:function(e){this.$hint.val(e)},getLanguageDirection:function(){return(this.$input.css("direction")||"ltr").toLowerCase()},isOverflow:function(){return this.$overflowHelper.text(this.getInputValue()),this.$overflowHelper.width()>this.$input.width()},isCursorAtEnd:function(){var e=this.$input.val().length,t=this.$input[0].selectionStart,r;return n.isNumber(t)?t===e:document.selection?(r=document.selection.createRange(),r.moveStart("character",-e),e===r.text.length):!0}}),t}(),l=function(){function s(t){n.bindAll(this),this.isOpen=!1,this.isEmpty=!0,this.isMouseOverDropdown=!1,this.$menu=e(t.menu).on("mouseenter.tt",this._handleMouseenter).on("mouseleave.tt",this._handleMouseleave).on("click.tt",".tt-suggestion",this._handleSelection).on("mouseover.tt",".tt-suggestion",this._handleMouseover)}function o(e){return e.data("suggestion")}var t={suggestionsList:'<span class="tt-suggestions"></span>'},i={suggestionsList:{display:"block"},suggestion:{whiteSpace:"nowrap",cursor:"pointer"},suggestionChild:{whiteSpace:"normal"}};return n.mixin(s.prototype,r,{_handleMouseenter:function(){this.isMouseOverDropdown=!0},_handleMouseleave:function(){this.isMouseOverDropdown=!1},_handleMouseover:function(t){var n=e(t.currentTarget);this._getSuggestions().removeClass("tt-is-under-cursor"),n.addClass("tt-is-under-cursor")},_handleSelection:function(t){var n=e(t.currentTarget);this.trigger("suggestionSelected",o(n))},_show:function(){this.$menu.css("display","block")},_hide:function(){this.$menu.hide()},_moveCursor:function(e){var t,n,r,i;if(!this.isVisible())return;t=this._getSuggestions(),n=t.filter(".tt-is-under-cursor"),n.removeClass("tt-is-under-cursor"),r=t.index(n)+e,r=(r+1)%(t.length+1)-1;if(r===-1){this.trigger("cursorRemoved");return}r<-1&&(r=t.length-1),i=t.eq(r).addClass("tt-is-under-cursor"),this._ensureVisibility(i),this.trigger("cursorMoved",o(i))},_getSuggestions:function(){return this.$menu.find(".tt-suggestions > .tt-suggestion")},_ensureVisibility:function(e){var t=this.$menu.height()+parseInt(this.$menu.css("paddingTop"),10)+parseInt(this.$menu.css("paddingBottom"),10),n=this.$menu.scrollTop(),r=e.position().top,i=r+e.outerHeight(!0);r<0?this.$menu.scrollTop(n+r):t<i&&this.$menu.scrollTop(n+(i-t))},destroy:function(){this.$menu.off(".tt"),this.$menu=null},isVisible:function(){return this.isOpen&&!this.isEmpty},closeUnlessMouseIsOverDropdown:function(){this.isMouseOverDropdown||this.close()},close:function(){this.isOpen&&(this.isOpen=!1,this.isMouseOverDropdown=!1,this._hide(),this.$menu.find(".tt-suggestions > .tt-suggestion").removeClass("tt-is-under-cursor"),this.trigger("closed"))},open:function(){this.isOpen||(this.isOpen=!0,!this.isEmpty&&this._show(),this.trigger("opened"))},setLanguageDirection:function(e){var t={left:"0",right:"auto"},n={left:"auto",right:" 0"};e==="ltr"?this.$menu.css(t):this.$menu.css(n)},moveCursorUp:function(){this._moveCursor(-1)},moveCursorDown:function(){this._moveCursor(1)},getSuggestionUnderCursor:function(){var e=this._getSuggestions().filter(".tt-is-under-cursor").first();return e.length>0?o(e):null},getFirstSuggestion:function(){var e=this._getSuggestions().first();return e.length>0?o(e):null},renderSuggestions:function(r,s){var o="tt-dataset-"+r.name,u='<div class="tt-suggestion">%body</div>',a,f,l=this.$menu.find("."+o),c,h,p;l.length===0&&(f=e(t.suggestionsList).css(i.suggestionsList),l=e("<div></div>").addClass(o).append(r.header).append(f).append(r.footer).appendTo(this.$menu)),s.length>0?(this.isEmpty=!1,this.isOpen&&this._show(),c=document.createElement("div"),h=document.createDocumentFragment(),n.each(s,function(t,n){n.dataset=r.name,a=r.template(n.datum),c.innerHTML=u.replace("%body",a),p=e(c.firstChild).css(i.suggestion).data("suggestion",n),p.children().each(function(){e(this).css(i.suggestionChild)}),h.appendChild(p[0])}),l.show().find(".tt-suggestions").html(h)):this.clearSuggestions(r.name),this.trigger("suggestionsRendered")},clearSuggestions:function(e){var t=e?this.$menu.find(".tt-dataset-"+e):this.$menu.find('[class^="tt-dataset-"]'),n=t.find(".tt-suggestions");t.hide(),n.empty(),this._getSuggestions().length===0&&(this.isEmpty=!0,this._hide())}}),s}(),c=function(){function s(e){var t,r,i;n.bindAll(this),this.$node=o(e.input),this.datasets=e.datasets,this.dir=null,this.eventBus=e.eventBus,t=this.$node.find(".tt-dropdown-menu"),r=this.$node.find(".tt-query"),i=this.$node.find(".tt-hint"),this.dropdownView=(new l({menu:t})).on("suggestionSelected",this._handleSelection).on("cursorMoved",this._clearHint).on("cursorMoved",this._setInputValueToSuggestionUnderCursor).on("cursorRemoved",this._setInputValueToQuery).on("cursorRemoved",this._updateHint).on("suggestionsRendered",this._updateHint).on("opened",this._updateHint).on("closed",this._clearHint).on("opened closed",this._propagateEvent),this.inputView=(new f({input:r,hint:i})).on("focused",this._openDropdown).on("blured",this._closeDropdown).on("blured",this._setInputValueToQuery).on("enterKeyed tabKeyed",this._handleSelection).on("queryChanged",this._clearHint).on("queryChanged",this._clearSuggestions).on("queryChanged",this._getSuggestions).on("whitespaceChanged",this._updateHint).on("queryChanged whitespaceChanged",this._openDropdown).on("queryChanged whitespaceChanged",this._setLanguageDirection).on("escKeyed",this._closeDropdown).on("escKeyed",this._setInputValueToQuery).on("tabKeyed upKeyed downKeyed",this._managePreventDefault).on("upKeyed downKeyed",this._moveDropdownCursor).on("upKeyed downKeyed",this._openDropdown).on("tabKeyed leftKeyed rightKeyed",this._autocomplete)}function o(n){var r=e(t.wrapper),s=e(t.dropdown),o=e(n),u=e(t.hint);r=r.css(i.wrapper),s=s.css(i.dropdown),u.css(i.hint).css({backgroundAttachment:o.css("background-attachment"),backgroundClip:o.css("background-clip"),backgroundColor:o.css("background-color"),backgroundImage:o.css("background-image"),backgroundOrigin:o.css("background-origin"),backgroundPosition:o.css("background-position"),backgroundRepeat:o.css("background-repeat"),backgroundSize:o.css("background-size")}),o.data("ttAttrs",{dir:o.attr("dir"),autocomplete:o.attr("autocomplete"),spellcheck:o.attr("spellcheck"),style:o.attr("style")}),o.addClass("tt-query").attr({autocomplete:"off",spellcheck:!1}).css(i.query);try{!o.attr("dir")&&o.attr("dir","auto")}catch(a){}return o.wrap(r).parent().prepend(u).append(s)}function u(e){var t=e.find(".tt-query");n.each(t.data("ttAttrs"),function(e,r){n.isUndefined(r)?t.removeAttr(e):t.attr(e,r)}),t.detach().removeData("ttAttrs").removeClass("tt-query").insertAfter(e),e.remove()}var t={wrapper:'<span class="twitter-typeahead"></span>',hint:'<input class="tt-hint" type="text" autocomplete="off" spellcheck="off" disabled>',dropdown:'<span class="tt-dropdown-menu"></span>'},i={wrapper:{position:"relative",display:"inline-block"},hint:{position:"absolute",top:"0",left:"0",borderColor:"transparent",boxShadow:"none"},query:{position:"relative",verticalAlign:"top",backgroundColor:"transparent"},dropdown:{position:"absolute",top:"100%",left:"0",zIndex:"100",display:"none"}};return n.isMsie()&&n.mixin(i.query,{backgroundImage:"url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"}),n.isMsie()&&n.isMsie()<=7&&(n.mixin(i.wrapper,{display:"inline",zoom:"1"}),n.mixin(i.query,{marginTop:"-1px"})),n.mixin(s.prototype,r,{_managePreventDefault:function(e){var t=e.data,n,r,i=!1;switch(e.type){case"tabKeyed":n=this.inputView.getHintValue(),r=this.inputView.getInputValue(),i=n&&n!==r;break;case"upKeyed":case"downKeyed":i=!t.shiftKey&&!t.ctrlKey&&!t.metaKey}i&&t.preventDefault()},_setLanguageDirection:function(){var e=this.inputView.getLanguageDirection();e!==this.dir&&(this.dir=e,this.$node.css("direction",e),this.dropdownView.setLanguageDirection(e))},_updateHint:function(){var e=this.dropdownView.getFirstSuggestion(),t=e?e.value:null,r=this.dropdownView.isVisible(),i=this.inputView.isOverflow(),s,o,u,a,f;t&&r&&!i&&(s=this.inputView.getInputValue(),o=s.replace(/\s{2,}/g," ").replace(/^\s+/g,""),u=n.escapeRegExChars(o),a=new RegExp("^(?:"+u+")(.*$)","i"),f=a.exec(t),this.inputView.setHintValue(s+(f?f[1]:"")))},_clearHint:function(){this.inputView.setHintValue("")},_clearSuggestions:function(){this.dropdownView.clearSuggestions()},_setInputValueToQuery:function(){this.inputView.setInputValue(this.inputView.getQuery())},_setInputValueToSuggestionUnderCursor:function(e){var t=e.data;this.inputView.setInputValue(t.value,!0)},_openDropdown:function(){this.dropdownView.open()},_closeDropdown:function(e){this.dropdownView[e.type==="blured"?"closeUnlessMouseIsOverDropdown":"close"]()},_moveDropdownCursor:function(e){var t=e.data;!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.dropdownView[e.type==="upKeyed"?"moveCursorUp":"moveCursorDown"]()},_handleSelection:function(e){var t=e.type==="suggestionSelected",r=t?e.data:this.dropdownView.getSuggestionUnderCursor();r&&(this.inputView.setInputValue(r.value),t?this.inputView.focus():e.data.preventDefault(),t&&n.isMsie()?n.defer(this.dropdownView.close):this.dropdownView.close(),this.eventBus.trigger("selected",r.datum,r.dataset))},_getSuggestions:function(){var e=this,t=this.inputView.getQuery();if(n.isBlankString(t))return;n.each(this.datasets,function(n,r){r.getSuggestions(t,function(n){t===e.inputView.getQuery()&&e.dropdownView.renderSuggestions(r,n)})})},_autocomplete:function(e){var t,n,r,i,s;if(e.type==="rightKeyed"||e.type==="leftKeyed"){t=this.inputView.isCursorAtEnd(),n=this.inputView.getLanguageDirection()==="ltr"?e.type==="leftKeyed":e.type==="rightKeyed";if(!t||n)return}r=this.inputView.getQuery(),i=this.inputView.getHintValue(),i!==""&&r!==i&&(s=this.dropdownView.getFirstSuggestion(),this.inputView.setInputValue(s.value),this.eventBus.trigger("autocompleted",s.datum,s.dataset))},_propagateEvent:function(e){this.eventBus.trigger(e.type)},destroy:function(){this.inputView.destroy(),this.dropdownView.destroy(),u(this.$node),this.$node=null},setQuery:function(e){this.inputView.setQuery(e),this.inputView.setInputValue(e),this._clearHint(),this._clearSuggestions(),this._getSuggestions()}}),s}();(function(){var t={},r="ttView",s;s={initialize:function(s){function u(){var t=e(this),s,u=new i({el:t});s=n.map(o,function(e){return e.initialize()}),t.data(r,new c({input:t,eventBus:u=new i({el:t}),datasets:o})),e.when.apply(e,s).always(function(){n.defer(function(){u.trigger("initialized")})})}var o;return s=n.isArray(s)?s:[s],s.length===0&&e.error("no datasets provided"),o=n.map(s,function(e){var n=t[e.name]?t[e.name]:new a(e);return e.name&&(t[e.name]=n),n}),this.each(u)},destroy:function(){function t(){var t=e(this),n=t.data(r);n&&(n.destroy(),t.removeData(r))}return this.each(t)},setQuery:function(t){function n(){var n=e(this).data(r);n&&n.setQuery(t)}return this.each(n)}},jQuery.fn.typeahead=function(e){return s[e]?s[e].apply(this,[].slice.call(arguments,1)):s.initialize.apply(this,arguments)}})()})(window.jQuery);