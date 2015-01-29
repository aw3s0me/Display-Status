define(function () {

    var _dataBrowser = [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome", min_ver: "10"},
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer", min_ver: "10"},
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox", min_ver: "10"},
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari", min_ver: "5"},
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera", min_ver: "12"}
    ];

    function BrowserDetect() {
        this.minVersion = undefined;
        this.browser = undefined;
        this.version = undefined;

    }

    BrowserDetect.prototype.init = function ()
    {
        this.browser = this.searchString(_dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    };

    BrowserDetect.prototype.searchString = function (data)
    {
        for (var i = 0; i < data.length ; i++)   
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                this.minVersion = data[i].min_ver;
                return data[i].identity;
            }
        }
    };

    BrowserDetect.prototype.isUpdateNeeded = function() {
        var browser = this.browser;
        var version = +this.version;
        var minVersion = +this.minVersion;
        if (browser === "Other" || version === "Unknown" || !version || !minVersion)
            return false;
        return minVersion >= version;
    };

    BrowserDetect.prototype.searchVersion = function (dataString)
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    };

    return new BrowserDetect;
});