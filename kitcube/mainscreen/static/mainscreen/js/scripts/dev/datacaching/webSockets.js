

webSockets = function(host)
{
    var me = {};

    me.socket = '';
    me.host = host;

    me.openSocket = function()
    {
        try
        {
            this.socket = new WebSocket(this.host);
            this.socket.binaryType = 'arraybuffer';
        }
        catch (ex)
        {
            console.log(ex);
        }
    };

    me.setOnOpenCallback = function(onOpenCallBack)
    {
        this.socket.onopen = onOpenCallBack;
    };

    me.setOnMessageCallback = function(onMessageCallBack)
    {
        this.socket.onmessage = onMessageCallBack;
    };

    me.setOnCloseCallback = function(onCloseHandler)
    {
        this.socket.onclose = onCloseHandler;
    };

    me.setOnErrorCallback = function(onErrorHandler)
    {
        this.socket.onerror = onErrorHandler;
    };

    me.sendMessage = function(msg)
    {
        try
        {
            this.socket.send(msg);
        }
        catch (ex)
        {
            console.log(ex);
        }

    };

    me.closeSocket = function()
    {
        this.socket.close();
    };

    return me;
};




