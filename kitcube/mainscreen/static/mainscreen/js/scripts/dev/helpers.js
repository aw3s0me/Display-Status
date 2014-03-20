function getSensorId(db_server, db_name, db_group, sensorId){
    var testDownloader = new dataDownloader();
    var csvDataAboutSensor = testDownloader.getSensorData(db_server, db_name, db_group, sensorId);
    //console.log(csvDataAboutSensor);
    var matchedDataArr = csvDataAboutSensor.match(/.*\[(.*)\].*/);
    sensorId = matchedDataArr[1];
    return sensorId;
}

function requestToServ(url, callback, filetype, type) {
    //filetype = filetype ? filetype : 'json';
    type = type ? type : 'GET';
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var success = function(e) {
        var items = '';
        items = xhr.responseText;
        console.log(items);
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


function getSensorNumber(db_server, db_name, db_group, sensorId) {
	var url = 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + db_server + '&db_name=' + db_name + '&db_group=' + db_group + '&db_mask='+ sensorId + '&window=-1&format=csv';
	console.log(url);
	var data;
    requestToServ(url, function(e) {
        data = e;
    }, ''); 
    //console.log(data);
	var sensorNumber = (data.match(/.*\n{1}.*\,{1}\s{0,1}(.*)/))[1];
	//console.log(sensorNumber);
	return sensorNumber;
}

