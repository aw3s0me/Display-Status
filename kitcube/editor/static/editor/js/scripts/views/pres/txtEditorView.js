define(['jquery', 'underscore', 'backbone', 'jqueryui', 'bootstrap', 'text!templates/pres/txtEditor.html'], function($, _, Backbone, jqueryui, bootstrap, textEditorTemplate) {
	var txtEditorView = Backbone.View.extend({
		el: undefined,
		editor: undefined,
		appendElem: $('#container'),
		externEditor: null,
		viewSizeDetector: null,
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
					$('#txtEditor').css('height', '90%');
					$('#settDivName').css('height', '10%');
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
		hide: function() {
			this.el.hide();
		},
		show: function() {
			this.el.show();
		},
		isHidden: function() {
			if (this.el.is(':hidden')) {
				return true;
			} else
				return false;
		},
		isShown: function() {
			if (this.el.is(':hidden')) {
				return false;
			} else
				return true;
		},
		settext: function(text) {
			this.externEditor.setValue(data);
		},
		setlabel: function(text) {

		},
		getdata: function(url) {
			var self = this;
			var testUrl = 'static/mainscreen/tempcfg/empty.json';
			$.ajax({
				url: testUrl,
				async: true,
				dataType: 'text',
				success: function(data) {
					console.log(data);
					self.settext(data);
				}
			});
		},
		getProjectsOnStart: function() {
			var self = this;
			var testUrl = '';
			$.ajax({
				url: testUrl,
				type: 'GET',
				dataType: 'text',
				data: {param1: 'value1'},
			})
			.done(function(data) {
				console.log("success");
				self.projects = data;
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		},
		saveToServ: function() {
			var self = this;
			var testUrl = '';
			var textToSave = this.externEditor.getValue();
			$.ajax({
				url: testUrl,
				type: 'POST',
				dataType: 'text',
				data: textToSave,
			})
			.done(function(data) {
				console.log("success: " + data);
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		}

	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return txtEditorView;
	// What we return here will be used by other modules
});