define(['jquery', 'underscore', 'backbone', 'text!templates/txtEditor.html'], function($, _, Backbone, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: 'kitcube-console',
		appendElem: $('#kitcube-container'),
		externEditor: null,
		initialize: function() {
			var elem = $('#kitcube-console').val();
			if (elem === undefined) {
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

			}
		}
	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return txtEditorView;
	// What we return here will be used by other modules
});