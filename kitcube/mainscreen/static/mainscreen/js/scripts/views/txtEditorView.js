define(['jquery', 'underscore', 'backbone', 'text!templates/txtEditor.html'], function($, _, Backbone, textEditorTemplate) {
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
				if ($('#kitcube-console').val() !== undefined) {
					$('#kitcube-console')[0].style.fontSize = '14px';
				}
				this.viewSizeDetector = new sizeDetector(50, 50, '#banner', '#footer');
				console.log(this.viewSizeDetector.detectBannerSize());
				console.log(this.viewSizeDetector.detectFooterSize());
				console.log(this.viewSizeDetector.detectBoardSize());

				var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizeMax.height) / 2;

				$('#kitcube-console').css('margin-top', marginTop + 'px');
				$('#kitcube-console').css('height', this.viewSizeDetector.boardSizeMax.height + 'px');
				$('#kitcube-console').css('width', this.viewSizeDetector.boardSizeMax.width + 'px');
				
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