define(["require","exports","module","ace/lib/fixoldbrowsers","asyncjs","asyncjs"],function(e,t,n){e("ace/lib/fixoldbrowsers");var r=e("asyncjs").test,i=e("asyncjs"),s=0,o=0,u=document.getElementById("log"),a=["ace/anchor_test","ace/background_tokenizer_test","ace/commands/command_manager_test","ace/config_test","ace/document_test","ace/edit_session_test","ace/editor_change_document_test","ace/editor_highlight_selected_word_test","ace/editor_navigation_test","ace/editor_text_edit_test","ace/ext/static_highlight_test","ace/incremental_search_test","ace/keyboard/emacs_test","ace/keyboard/keybinding_test","ace/keyboard/vim_test","ace/layer/text_test","ace/lib/event_emitter_test","ace/mode/coffee/parser_test","ace/mode/coldfusion_test","ace/mode/css_test","ace/mode/css_worker","ace/mode/html_test","ace/mode/javascript_test","ace/mode/javascript_worker_test","ace/mode/logiql_test","ace/mode/python_test","ace/mode/text_test","ace/mode/xml_test","ace/mode/folding/cstyle_test","ace/mode/folding/html_test","ace/mode/folding/pythonic_test","ace/mode/folding/xml_test","ace/mode/folding/coffee_test","ace/multi_select_test","ace/occur_test","ace/range_test","ace/range_list_test","ace/search_test","ace/selection_test","ace/snippets_test","ace/token_iterator_test","ace/tokenizer_test","ace/virtual_renderer_test"],f=["<a href='?'>all tests</a><br>"];for(var l in a){var c=a[l];f.push("<a href='?",c,"'>",c.replace(/^ace\//,""),"</a><br>")}var h=document.createElement("div");h.innerHTML=f.join(""),h.style.cssText="position:absolute;right:0;top:0",document.body.appendChild(h),location.search&&(a=location.search.substr(1).split(",")),e(a,function(){var t=a.map(function(t){var n=e(t);return n.href=t,n});i.list(t).expand(function(e){return r.testcase(e)},r.TestGenerator).run().each(function(e,t){if(e.index==1&&e.context.href){var n=e.context.href,r=document.createElement("div");r.innerHTML="<a href='?"+n+"'>"+n.replace(/^ace\//,"")+"</a>",u.appendChild(r)}var r=document.createElement("div");r.className=e.passed?"passed":"failed";var i=e.name;e.suiteName&&(i=e.suiteName+": "+e.name);var s="["+e.count+"/"+e.index+"] "+i+" "+(e.passed?"OK":"FAIL");if(!e.passed){if(e.err.stack)var o=e.err.stack;else var o=e.err;console.error(s),console.error(o),s+="<pre class='error'>"+o+"</pre>"}else console.log(s);r.innerHTML=s,u.appendChild(r),t()}).each(function(e){e.passed?s+=1:o+=1}).end(function(){u.innerHTML+=["<div class='summary'>","<br>","Summary: <br>","<br>","Total number of tests: "+(s+o)+"<br>",s?"Passed tests: "+s+"<br>":"",o?"Failed tests: "+o+"<br>":""].join(""),console.log("Total number of tests: "+(s+o)),console.log("Passed tests: "+s),console.log("Failed tests: "+o)})})});