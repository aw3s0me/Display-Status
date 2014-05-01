define(['jquery', 'underscore', 'backbone', 'jqueryui', 'bootstrap', 'text!templates/txtEditor.html'], function($, _, Backbone, jqueryui ,bootstrap, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: undefined,
		editor: undefined,
		appendElem: $('#container'),
		externEditor: null,
		viewSizeDetector: null,
		initialize: function() {
			this.editor = $('#txtEditor').val();
			if (this.editor === undefined) {
				var data = {};
				var self = this;
				var compiledTemplate = _.template(textEditorTemplate, data);
				this.appendElem.append(compiledTemplate);

				this.externEditor = ace.edit('txtEditor');
				if ($('#txtEditor').val() !== undefined) {
					$('#txtEditor')[0].style.fontSize = '14px';
				}
				this.viewSizeDetector = new sizeDetector(50, 32, 16, '#banner', '#footer');
				this.viewSizeDetector.detectAllSizes();

				var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizePx.height) / 2;

				$('#txtEditor').css('margin-top', marginTop + 'px');
				$('#txtEditor').css('height', this.viewSizeDetector.boardSizePx.height + 'px');
				$('#txtEditor').css('width', this.viewSizeDetector.boardSizePx.width + 'px');
				
				this.externEditor.resize();
				this.externEditor.setTheme("ace/theme/monokai");
				this.externEditor.getSession().setMode("ace/mode/yaml");
				this.el = $('#txtEditContainer');
			}
			},
			hide: function() {
				this.el.hide();
			},	
			show: function() {
				this.el.show();
			},
			isHidden: function() {
				if(this.el.is(':hidden')) {
					return true;
				}
				else 
					return false;
			},
			isShown: function() {
				if(this.el.is(':hidden')) {
					return false;
				}
				else 
					return true;
			}
		
	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return txtEditorView;
	// What we return here will be used by other modules
});