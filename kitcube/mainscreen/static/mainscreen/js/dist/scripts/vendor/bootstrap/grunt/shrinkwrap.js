/*!
 * Bootstrap Grunt task for generating npm-shrinkwrap.canonical.json
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

function updateShrinkwrap(e){var t=e.file.readJSON(NON_CANONICAL_FILE);e.log.writeln("Deleting "+NON_CANONICAL_FILE.cyan+"..."),e.file.delete(NON_CANONICAL_FILE),e.file.write(DEST_FILE,canonicallyJsonStringify(t)),e.log.writeln("File "+DEST_FILE.cyan+" updated.")}var canonicallyJsonStringify=require("canonical-json"),NON_CANONICAL_FILE="npm-shrinkwrap.json",DEST_FILE="test-infra/npm-shrinkwrap.canonical.json";module.exports=updateShrinkwrap;