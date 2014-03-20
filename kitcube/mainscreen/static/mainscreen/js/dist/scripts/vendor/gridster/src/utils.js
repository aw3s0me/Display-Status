/* Delay, debounce and throttle functions taken from underscore.js
     *
     * Copyright (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and
     * Investigative Reporters & Editors
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without
     * restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following
     * conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     * OTHER DEALINGS IN THE SOFTWARE.
     */

(function(e,t){e.delay=function(e,t){var n=Array.prototype.slice.call(arguments,2);return setTimeout(function(){return e.apply(null,n)},t)},e.debounce=function(e,t,n){var r;return function(){var i=this,s=arguments,o=function(){r=null,n||e.apply(i,s)};n&&!r&&e.apply(i,s),clearTimeout(r),r=setTimeout(o,t)}},e.throttle=function(e,t){var n,r,i,s,o,u,a=debounce(function(){o=s=!1},t);return function(){n=this,r=arguments;var f=function(){i=null,o&&e.apply(n,r),a()};return i||(i=setTimeout(f,t)),s?o=!0:u=e.apply(n,r),a(),s=!0,u}}})(window);