define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var userPanelView = Backbone.View.extend({
        el: undefined,
        timeBlock: $('#time-container'),
        menu: $('#auth-menu'),
        latestInfo: "",
        initialize: function() {
            var self = this;


            this.eventAggregator.on('loadingfinished', function(data) {
                self.timeBlock.find('.timelapse-loading').hide();
                self.timeBlock.find('.short-info').text(data['number'] + ' ' + data['format']);
                self.timeBlock.find('.full-info').text(data['lastUpdatedTime']);
                self.latestInfo = data;
            }, this);

            this.timeBlock.on("mouseenter", function () {
                $(this).find('.short-info').hide();
                $(this).find('.full-info').fadeIn();
            });

            this.timeBlock.on("mouseleave", function () {
                $(this).find('.short-info').fadeIn();
                $(this).find('.full-info').hide();
            });

            this.eventAggregator.on('userloggedin', this.onUserLoggedIn, this);
            this.eventAggregator.on('onuseratloginscreen', this.onUserAtLoginScreen, this);
            this.eventAggregator.on('onuseratmainscreen', this.onUserAtMainScreen, this);
            this.render();
        },
        render: function() {
            this.el = $('#auth-menu');
            this.ifLoggedIn();
            $('#toggleGridButton').show();
            
            $('#loginButton').tooltip({});;
            $('#logoutButton').tooltip({});;
            $('#goEditorButton').tooltip({});;
            $('#goMainscreenButton').tooltip({});;
            //$('#toggleGridButton').tooltip({});;
            
        },
        ifLoggedIn: function() {
            if (window.activeSessionUser.get('logged_in'))  {
               this.onUserLoggedIn();
            }
            else {
                $('#loginButton').show();
            }
        },
        onUserLoggedIn: function() {
            if (!window.activeSessionUser.get('logged_in')) {
                return;
            }
            var userName = window.activeSessionUser.get('username');
            $('#lblUserInfo').html("Welcome, <span id='userName'>" + userName + "</span> !");

            $('#loginButton').hide();
            $('#logoutButton').show();
            $('#goEditorButton').show();
            $('#goMainscreenButton').hide();
            //$('#toggleGridButton').show();
        },
        onUserAtLoginScreen: function() {
            $('#loginButton').hide();
            $('#logoutButton').hide();
            $('#goMainscreenButton').show();
            //$('#toggleGridButton').hide();
        },
        onUserAtMainScreen: function() {
            this.ifLoggedIn();
            $('#goMainscreenButton').hide();
            $('#toggleGridButton').show();
        },
        onUserLogout: function() {
            $('#loginButton').show();
            $('#logoutButton').hide();
            $('#lblUserInfo').text("No user authorized");

            $('#goEditorButton').hide();
            $('#goMainscreenButton').hide();
        },
        onPortrait: function() {
            $('#toggleGridButton').hide();
            $('#goMainscreenButton').hide();
            $('#loginButton').hide();
            $('#logoutButton').hide();
            $('#goEditorButton').hide();
        }

    });

    return userPanelView;

}) 
