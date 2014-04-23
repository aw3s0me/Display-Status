define(['jquery', 'underscore', 'backbone', 'text!templates/txtEditor.html'], function($, _, Backbone, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: 'kitcube-console',
		appendElem: $('#kitcube-container'),
		externEditor: null,
		initialize: function(options) {
			/*var url;
			if (options.url) {
				url = options.url;
			}*/
			var elem = $('#kitcube-console').val();
			if (elem === undefined) {
				var self = this;
				var data = {};
				var compiledTemplate = _.template(textEditorTemplate, data);
				this.appendElem.append(compiledTemplate);
				this.externEditor = ace.edit('kitcube-console');
				if ($('#kitcube-console').val() !== undefined) {
					$('#kitcube-console')[0].style.fontSize = '14px';
				}
				this.viewSizeDetector = new sizeDetector(50, 32, 16, '#banner', '#footer');
				this.viewSizeDetector.detectAllSizes();

				var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizePx.height) / 2;

				$('#kitcube-console').css('margin-top', marginTop + 'px');
				$('#kitcube-console').css('height', this.viewSizeDetector.boardSizePx.height + 'px');
				$('#kitcube-console').css('width', this.viewSizeDetector.boardSizePx.width + 'px');

				this.externEditor.resize();
				this.externEditor.setTheme("ace/theme/monokai");
				this.externEditor.getSession().setMode("ace/mode/yaml");


				//using jQuery to fire off an ajax request to load the xml,
				//using our callback as the success function
				$.ajax({
					url: 'static/mainscreen/cfg/katrincfggrid.json',
					//url: 'static/mainscreen/cfg/katrincfg.json',
					//url: 'static/mainscreen/cfg/katrincfgtilesdouble.json',
					async: false,
					dataType: 'text', //explicitly requesting the xml as text, rather than an xml document
					success: function(data){
						console.log(data);
						//apparently, only modes supported are 'html', 'javascript' & 'text'
						self.externEditor.setValue(data);
					}
				});

			}
		}
	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return txtEditorView;
	// What we return here will be used by other modules
});