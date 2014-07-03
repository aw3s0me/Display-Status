define(['jquery', 'underscore', 'backbone', 'jqueryui', 'bootstrap', 'text!templates/pres/txtEditor.html'], function($, _, Backbone, jqueryui, bootstrap, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: undefined,
		editor: undefined,
		appendElem: $('#guiEditor'),
		externEditor: null,
		metaName: "txtEditorView",
		initialize: function() {
			this.editor = $('#txtEditorPlaceholder').val();
			if (this.editor === undefined) {
				var data = {};
				var self = this;
				var compiledTemplate = _.template(textEditorTemplate, data);
				this.appendElem.append(compiledTemplate);

				this.externEditor = ace.edit('txtEditorPlaceholder');
				if ($('#txtEditorPlaceholder').val() !== undefined) {
					$('#txtEditorPlaceholder').css('font-size', '14px');
					//$('#txtEditor').css('height', '200px');
					var body = document.body,
        				html = document.documentElement;
					var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

					$('#txtEditorPlaceholder').css('height', height - 260);
				}

				//$('#txtEditor').css('margin-top', marginTop + 'px');
				//$('#txtEditor').css('height', this.viewSizeDetector.boardSizePx.height + 'px');
				//$('#txtEditor').css('width', this.viewSizeDetector.boardSizePx.width + 'px');

				//$('#txtEditor').css('height', $(window).height + 'px');

				this.externEditor.resize();
				this.externEditor.setTheme("ace/theme/monokai");
				this.externEditor.getSession().setMode("ace/mode/yaml");
				this.el = $('#txtEditContainer');
				this.el.hide();
				//var dataReq = window.activeSessionUser.get('cur_data');
				var curData = window.activeSessionUser.get('cur_data_cfg');
				this.settext(curData);

				//this.getprojectsonstart(); //need server side
				
			}
		},
		settext: function(text) {
			this.externEditor.setValue(text);
		},
		setlabel: function(text) {

		},
		saveCfg: function() {
			var textToSave = this.externEditor.getValue();
			return textToSave;
		},
		destroyView: function() {
			this.remove();
			this.el.remove();
  			this.unbind();
		},
		rerender: function() {
			this.destroyView();
			this.initialize();
		}

	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return txtEditorView;
	// What we return here will be used by other modules
});