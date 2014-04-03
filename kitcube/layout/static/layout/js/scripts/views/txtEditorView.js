define(['jquery', 'underscore', 'backbone', 'jqueryui', 'bootstrap', 'text!templates/txtEditor.html'], function($, _, Backbone, jqueryui ,bootstrap, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: 'txtEditor',
		appendElem: $('#container'),
		externEditor: null,
		initialize: function() {
			var elem = $('#txtEditor').val();
			if (elem === undefined) {
				var data = {};
				var compiledTemplate = _.template(textEditorTemplate, data);
				this.appendElem.append(compiledTemplate);
				this.externEditor = ace.edit('txtEditor');
				if ($('#txtEditor').val() !== undefined) {
					$('#txtEditor')[0].style.fontSize = '14px';
				}
				this.viewSizeDetector = new sizeDetector(50, 50, '#banner', '#footer');
				this.viewSizeDetector.detectBannerSize();
				this.viewSizeDetector.detectFooterSize();
				this.viewSizeDetector.detectBoardSize();

				var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizeMax.height) / 2;

				$('#txtEditor').css('margin-top', marginTop + 'px');
				$('#txtEditor').css('height', this.viewSizeDetector.boardSizeMax.height + 'px');
				$('#txtEditor').css('width', this.viewSizeDetector.boardSizeMax.width + 'px');
				
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