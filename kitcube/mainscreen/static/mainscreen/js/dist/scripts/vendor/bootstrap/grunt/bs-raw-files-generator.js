/*!
 * Bootstrap Grunt task for generating raw-files.min.js for the Customizer
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

function getFiles(e){var t={};return fs.readdirSync(e).filter(function(t){return e==="fonts"?!0:(new RegExp("\\."+e+"$")).test(t)}).forEach(function(n){var r=e+"/"+n;t[n]=e==="fonts"?btoa(fs.readFileSync(r)):fs.readFileSync(r,"utf8")}),"var __"+e+" = "+JSON.stringify(t)+"\n"}var btoa=require("btoa"),fs=require("fs");module.exports=function(t){t||(t="");var n=t+getFiles("js")+getFiles("less")+getFiles("fonts");fs.writeFileSync("docs/assets/js/raw-files.min.js",n)};