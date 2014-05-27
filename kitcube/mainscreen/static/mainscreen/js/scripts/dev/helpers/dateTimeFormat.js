var dateTimeFormat = function()
{
    var me = {};

    me.monthFormats = {
        'Jan': 0,
        'Feb': 1,
        'Mar': 2,
        'Apr': 3,
        'May': 4,
        'Jun': 5,
        'Jul': 6,
        'Aug': 7,
        'Sep': 8,
        'Oct': 9,
        'Nov': 10,
        'Dec': 11
    };

    me.splitTimeFromAny = function(window)
    {
        var Microsec = window.substr(19);
        //window = window.substring(0, 18);
        var year = window.substr(7, 2);
        var month = window.substr(3, 3);
        var day = window.substr(0, 2);
        var hour = window.substr(10, 2);
        var minute = window.substr(13, 2);
        var sec = window.substr(16, 2);
        if (year > 60)
        {
            year = '19' + year;
        }
        else
        {
            year = '20' + year;
        }
        var d = new Date(year, this.monthFormats[month], day, hour, minute, sec);
        var buf = d.toISOString().substr(13).substring(0, 7);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        var Time = d.toISOString().substring(0, 13);
        Time = Time + buf + Microsec;
        return Time;
    };


    me.formatTime = function(window)
    {
        var beginTime = window.split('-')[0];
        var endTime = window.split('-')[1];
        if (beginTime.indexOf('.') - 1)
        {
            beginTime = beginTime.split('.')[0];
        }
        if (endTime.indexOf('.') - 1)
        {
            endTime = endTime.split('.')[0];
        }
        return {begTime: beginTime, endTime: endTime};
    };

    me.splitTimeFromUnix = function(window)
    {
        var Microsec = window.split('.')[1];
        if (Microsec == undefined)
        {
            Microsec = '000000';
        }
        var d = new Date(window * 1000);
        var buf = d.toISOString().substr(13).substring(0, 7);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        var Time = d.toISOString().substring(0, 13);
        Time = Time + buf + Microsec;
        return Time;


    };

    me.checkWindowFormat = function(window)
    {
        var begSec = window.split('-')[0];
        var endSec = window.split('-')[1];
        if (begSec != undefined && endSec != undefined)
        {

            var milBegSec = begSec.split('.')[1];
            var milEndSec = endSec.split('.')[1];
            if (milBegSec !== undefined && milEndSec !== undefined)
            {
                endSec = endSec.split('.')[0];
                begSec = begSec.split('.')[0];
                milBegSec = parseInt(milBegSec);
                milEndSec = parseInt(milEndSec);
                begSec = parseInt(begSec);
                endSec = parseInt(endSec);
                if (milBegSec != NaN &&
                        milEndSec != NaN &&
                        begSec != NaN &&
                        endSec != NaN)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                if (typeof parseInt(begSec) === "number" &&
                        typeof parseInt(endSec) === "number")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        else
        {
            return false;
        }

    };

    return me;

};

