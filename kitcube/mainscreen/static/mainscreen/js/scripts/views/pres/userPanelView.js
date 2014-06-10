define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var userPanelView = Backbone.View.extend({
        el: undefined,
        timeLabel: $('#lblFromNow'),
        initialize: function() {
            var self = this;
            this.eventAggregator.on('loadingfinished', function(data) {
                self.timeLabel.text(data.lastUpdatedTime);
            }, this);
            this.eventAggregator.on('userLoaded', this.onUserLoggedIn, this);
            this.render();
        },
        render: function() {
            this.el = $('#userPanel');
            if (window.activeSessionUser.get('logged_in'))  {
               $('#logoutButton').show();
            }
            else {
                $('#loginButton').show();
            }
            $('#toggleGridButton').show();
        },
        onUserLoggedIn: function() {
            var userName = window.activeSessionUser;
            $('#lblUserInfo').text("Welcome, <span id='userName'>" + userName + "</span> !");
            var template = '<button onclick="window.openWindow()"; class="btn btn-default circle-btn" id="goEditorButton" data-toggle="tooltip" data-placement="bottom" title="Go to Editor"><span class="glyphicon glyphicon-edit"></span></button>';
            self.el.append(template);
            $('#loginButton').hide();
            $('#logoutButton').show();
        },
        onUserLogout: function() {
            $('#loginButton').show();
            $('#logoutButton').hide();
            $('#lblUserInfo').text("No user authorized");
        }

    });

    return userPanelView;

}) 
