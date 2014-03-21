define(['jquery', 'underscore', 'backbone', 'text!templates/txtEditor.html'],function($, _, Backbone,  textEditorTemplate){
	var txtEditorView = Backbone.View.extend({
		el: 'kitcube-console',
		appendElem: $('#kitcube-container'), 
		externEditor: null,
		initialize: function() {
			//console.log(_.template(textEditorTemplate, {}));
			//console.log(this.appendElem);
			var elem = $('#kitcube-console').val();
			console.log('initialize');
			if (elem === undefined) {
				var data = {};
				var compiledTemplate = _.template(textEditorTemplate, data);
				console.log('not inserted yet');
				this.appendElem.append(compiledTemplate);
				this.externEditor = ace.edit('kitcube-console');
				if ($('#kitcube-console').val() === undefined){
					console.log($('#kitcube-console'));
				}
				//else 
					//$('#kitcube-console').style.fontSize = '14px';
				this.externEditor.resize();
				this.externEditor.setTheme("ace/theme/monokai");
    			this.externEditor.getSession().setMode("ace/mode/yaml");

    			//this.render(this.externEditor);
			}
			
		}
	});
	
	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
  	return txtEditorView;
  	// What we return here will be used by other modules
}); 
