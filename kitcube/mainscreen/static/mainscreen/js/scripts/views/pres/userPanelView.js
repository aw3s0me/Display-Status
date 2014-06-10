define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var userPanelView = Backbone.View.extend({
        el: undefined,
        timeLabel: $('#lblFromNow'),
        userInfo: $('#lblUserInfo'),
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
            if (window.activeSessionUser.get('is_logged'))  {
                this.onUserLoggedIn();
            }
            else {
                $('#loginButton').show();
            }
            $('#toggleGridButton').show();
        },
        onUserLoggedIn: function() {
            var userName = window.activeSessionUser;
            self.userInfo.text('Welcome, ' + userName);
            var template = '<button onclick="window.openWindow()"; class="btn btn-default circle-btn" id="goEditorButton" data-toggle="tooltip" data-placement="bottom" title="Go to Editor"><span class="glyphicon glyphicon-edit"></span></button>';
            self.el.append(template);
            $('#loginButton').show();
            $('#logoutButton').hide();
        },
        onUserLogout: function() {
            $('#loginButton').hide();
            $('#logoutButton').show();
        }

    });

    return userPanelView;

}) 
