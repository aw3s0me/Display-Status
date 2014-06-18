define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var userPanelView = Backbone.View.extend({
        el: undefined,
        userPanel: $('#btnUserPanel'),
        initialize: function() {
            var self = this;
            this.eventAggregator.on('userloggedin', this.onUserLoggedIn, this);
            this.eventAggregator.on('onuseratloginscreen', this.onUserAtLoginScreen, this);
            this.eventAggregator.on('onuserateditorscreen', this.onUserAtEditorScreen, this);
            this.eventAggregator.on('onuseratboardscreen', this.onUserAtBoardScreen, this);
            this.eventAggregator.on('onuserloggedout', this.onUserLogout, this);
            this.render();
        },
        render: function() {
            this.el = $('#userPanel');
            this.ifLoggedIn();
            //$('#loginButton').tooltip({});
            //$('#logoutButton').tooltip({});
            //$('#goGuiEditorButton').tooltip({});
            //$('#goHome').tooltip({});
            //$('#toggleGridButton').tooltip({});
            //$('#goHome').show();
        },
        onUserAtBoardScreen: function() {
            $('#toggleGridButton').show();
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
        },
        onUserAtLoginScreen: function() {
            $('#loginButton').hide();
            $('#logoutButton').hide();
        },
        onUserAtMainScreen: function() {
            this.ifLoggedIn();
        },
        onUserLogout: function() {
            $('#loginButton').show();
            $('#logoutButton').hide();
            $('#lblUserInfo').text("No user authorized");

        }

    });

    return userPanelView;

}) 
