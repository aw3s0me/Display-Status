/*!
 * Bootstrap Grunt task for Glyphicons data generation
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

var fs=require("fs");module.exports=function(){var t=fs.readFileSync("less/glyphicons.less","utf8"),n=t.split("\n"),r=/^\.(glyphicon-[^\s]+)/,i="# This file is generated via Grunt task. **Do not edit directly.**\n# See the 'build-glyphicons-data' task in Gruntfile.js.\n\n";for(var s=0,o=n.length;s<o;s++){var u=n[s].match(r);u!==null&&(i+="- "+u[1]+"\n")}fs.existsSync("docs/_data")||fs.mkdirSync("docs/_data"),fs.writeFileSync("docs/_data/glyphicons.yml",i)};