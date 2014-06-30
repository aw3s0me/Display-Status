define(['jquery', 'underscore', 'backbone', 'jqueryui', 'bootstrap', 'text!templates/pres/txtEditor.html'], function($, _, Backbone, jqueryui, bootstrap, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: undefined,
		editor: undefined,
		appendElem: $('#guiEditor'),
		externEditor: null,
		choice: {
			project: undefined,
			config: undefined
		},
		projects: {

		},
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

				//this.getprojectsonstart(); //need server side
				/* Some ajax code to load content + event listener */

				/* Change label when dropdown value changes */

				$('#txtCfgList').find(".dropdown-menu li a").click(function() {
			        self.choice.config = $(this).attr('data');
			        console.log($(this).attr('data'));
			        $("#settName").text(self.choice.project + " : " + self.choice.config);
			        $(this).addClass('active');
			    });
				console.log(self.choice.config);

				$('#txtProjectList').find(".dropdown-menu li a").click(function() {
			        self.choice.project = $(this).attr('data');
			        console.log($(this).attr('data'));
			        $(this).addClass('active');
			    });

			    $('#saveTxt').click(function(event) {
			    	self.saveToServ();
			    });

			}
		},
		settext: function(text) {
			this.externEditor.setValue(data);
		},
		setlabel: function(text) {

		},
		saveCfg: function() {
			var textToSave = this.externEditor.getValue();
		}

	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return txtEditorView;
	// What we return here will be used by other modules
});