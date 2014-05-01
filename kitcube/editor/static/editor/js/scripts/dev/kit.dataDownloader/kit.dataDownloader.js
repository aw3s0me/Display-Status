function dataDownloader() {


};

dataDownloader.prototype.formURL = function(db_server, db_name, db_group, window, db_mask, resample, mask_mode, filename, control_group, experiment, history_id, module) {
	var url = 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + db_server + '&db_name=' + db_name + '&db_group=' + db_group + '&window=' + window + '&format=csv';
	if (control_group !== '') {
		url = url + '&control_group=' + control_group;
	}
	if (db_mask !== '') {
		url = url + '&db_mask=' + db_mask;
	}
	if (experiment !== '') {
		url = url + '&experiment=' + experiment;
	}
	if (module !== '') {
		url = url + '&module=' + module;
	}
	if (history_id !== '') {
		url = url + '&history_id=' + history_id;
	}
	if (resample !== '') {
		url = url + '&resample=' + resample;
	}
	if (mask_mode !== '') {
		url = url + '&mask_mode=' + mask_mode;
	}
	if (filename !== '') {
		url = url + '&filename=' + filename;
	}
	return url;
}

dataDownloader.prototype.formURLId = function(db_server, db_name, db_group, db_mask, windowData) {
    var url = 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + db_server + '&db_name=' + db_name + '&db_group=' + db_group + '&db_mask='+ db_mask + '&window=' + windowData + '&format=csv';
    return url;
}

/* Request helper */

dataDownloader.prototype.ajax = function(url, callback, filetype, type) {
    //filetype = filetype ? filetype : 'json';
    type = type ? type : 'GET';
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var success = function(e) {
        var items = '';
        items = xhr.responseText;
        /*switch(filetype) {
            case 'csv': {
            	//items = CSV2JSON(xhr.responseText); 
            	items = xhr.responseText;
            	break;
            }
            case 'json': {
            	items = JSON.parse(xhr.responseText); 
            	break; 
            }
            default: items = xhr.responseText; break;
        } */
        callback(items);
    }
    var error = function(e) { console.log('Please enabled CORS using  access-control-allow-origin'); }
    if (window.XDomainRequest && !sameOrigin(url)) { xhr = new XDomainRequest(); xhr.onload = success; }
    if (filetype == 'image' && xhr.overrideMimeType) { xhr.overrideMimeType('text/plain; charset=x-user-defined'); }
    xhr.onerror = error;
    xhr.onreadystatechange = function(e) { if (xhr.readyState == 4 && xhr.status == 200) { success(e); } }
    try {
        if ('withCredentials' in xhr) { xhr.open(type, url, false); }
        else { xhr.open(type, url, false); }
        xhr.send(null);
    }
    catch(e) { error(e); }
}

// check if url is same domain

function sameOrigin(url){
    var split = url.split('/');
    if (split[0]+'//' == window.location.protocol+'//') { return split[2] != window.location.host ? false : true; }
    else { return true; }
}


dataDownloader.prototype.getDataFromAdei = function(url) {
    //if (!params) {
    //throw 'Params weren\'t setted';
    //}
    
    var data;
    this.ajax(url, function(e) {
        data = e;
    }, '');

    return data;
    //function formURL(db_server, db_name, db_group, window, db_mask, resample, mask_mode, filename, control_group, experiment, history_id, module)
    //var filePath = formURL("orca", "orca_process", "Data_001_PAC_dat", "0", "0,1,2,3,4,5,6,7", "","STANDARD","katrin.csv", "TempMon","-","1394545464085","graph");
    //console.log(filePath);
// cross domain json feed without CORS
//var url = 'http://www.kimturley.co.uk/data/projects.json';

// cross domain json feed with CORS
//var url = 'http://pipes.yahooapis.com/pipes/pipe.run?_id=giWz8Vc33BG6rQEQo_NLYQ&_render=json';

// same domain json feed
//var url = '/echo/json/';

// cross domain json example
//var url = 'http://echo.jsontest.com/key/value/one/two'

// google docs example
//var url = 'https://docs.google.com/spreadsheet/pub?key=0AsnymCBa0S5PdGh4ZVF5Uktfc2hyYm5ibHduTHAzQ1E&output=csv';

//var url='http://miaopdv.ipe.kit.edu/adei/services/getdata.php?db_server=KITCUBE&db_name=HDCP2&db_group=Data_080_RPG_L1A&db_mask=1&window=-1';
} 

dataDownloader.prototype.getSensorData = function(db_server, db_name, db_group, sensorId){
    var url = this.formURLId(db_server, db_name, db_group, sensorId, "-1");
    console.log(url);
    var data = this.getDataFromAdei(url);

    return data;
}






