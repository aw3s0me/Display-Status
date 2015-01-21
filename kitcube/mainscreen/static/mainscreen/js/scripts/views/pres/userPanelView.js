define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var userPanelView = Backbone.View.extend({
        el: undefined,
        timeBlock: $('#time-container'),
        menu: $('#auth-menu'),
        latestInfo: "",
        userNameCont: undefined,
        btns: {
            loginBtn: undefined,
            logoutBtn: undefined,
            editorBtn: undefined,
            boardBtn: undefined,
            gridBtn: undefined,
            regBtn: undefined
        },
        isInit: false,
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
            this.eventAggregator.on('onuseratregscreen', this.onUserAtRegScreen, this);
            this.eventAggregator.on('logout', this.onUserLogout());
            this.render();
            this.initializeBtns();
            this.ifLoggedIn();
            this.isInit = true;
        },
        initializeBtns: function () {
            this.userNameCont = $('#auth-username');
            this.btns.editorBtn = this.el.find('.editor-btn');
            this.btns.boardBtn = this.el.find('.board-btn');
            this.btns.loginBtn = this.el.find('.login-btn');
            this.btns.logoutBtn = this.el.find('.logout-btn');
            this.btns.gridBtn = this.el.find('.grid-btn');
            this.btns.regBtn = this.el.find('.reg-btn');
        },
        render: function() {
            this.el = $('#auth-menu');
        },
        ifLoggedIn: function() {
            if (window.activeSessionUser.get('logged_in'))  {
               this.onUserLoggedIn();
            }
            else {
                this.btns.loginBtn.show();
            }
        },
        onUserLoggedIn: function() {
            if (!window.activeSessionUser.get('logged_in')) {
                return;
            }
            var userName = window.activeSessionUser.get('username');
            this.userNameCont.text(userName);

            this.btns.loginBtn.hide();
            this.btns.logoutBtn.show();
            this.btns.editorBtn.show();
            this.btns.boardBtn.hide();
            this.btns.regBtn.hide();
            //$('#toggleGridButton').show();
        },
        onUserAtLoginScreen: function() {
            this.btns.loginBtn.hide();
            this.btns.logoutBtn.hide();
            this.btns.regBtn.show();
            this.btns.boardBtn.show();
            this.btns.gridBtn.hide();
        },
        onUserAtRegScreen: function () {
            this.btns.regBtn.hide();
            this.btns.loginBtn.show();
            this.btns.logoutBtn.hide();
            this.btns.boardBtn.show();
            this.btns.gridBtn.hide();
        },
        onUserAtMainScreen: function() {
            this.ifLoggedIn();
            this.btns.boardBtn.hide();
            this.btns.gridBtn.show();
        },
        onUserLogout: function() {
            if (!this.isInit) return;

            this.userNameCont.text("Not logged");
            this.btns.loginBtn.show();
            this.btns.regBtn.show();
            this.btns.logoutBtn.hide();
            this.btns.editorBtn.hide();
            this.btns.boardBtn.hide();
        },
        onPortrait: function() {
            //hide all btns
        }

    });

    return userPanelView;

}) 
