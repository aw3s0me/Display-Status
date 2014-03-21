function newWidget(dx, dy, px, py, scale) {
    var e = document.createElement('div');
    var holder = $('.canvas');

    scale = defaultFor(scale, holder.data('scale'));
    e.dataset.scale = scale;

    e.className = 'tile';
    e.style.left = px * holder.data('gridUnitX') * scale + 'px';
    e.style.top  = py * holder.data('gridUnitY') * scale + 'px';
    e.style.width   = dx * holder.data('gridUnitX') * scale + 'px';
    e.style.height  = dy * holder.data('gridUnitY') * scale + 'px';

    return e;
}

function sensorTemplate(e) {
    var scale = e.dataset.scale;

    var s0 = document.createElement('div');
    s0.style.position = 'absolute';
    s0.style.fontSize = 13*scale + 'px';
    s0.style.left = 5*scale + 'px';
    s0.innerHTML = this.name;
    s0.innerHTML += '<br>' + this.comment;
 
    var s1 = document.createElement('div');
    s1.id = this.id;
    s1.style.position = 'absolute';
    s1.style.fontSize = 50*scale + 'px';
    s1.style.right = 6*scale + 'px';
    s1.style.bottom = 0*scale + 'px';
    s1.innerHTML = (this.value === undefined)
        ? 'NAN'
        : this.value.toFixed(1);

    var s2 = document.createElement('div');
    s2.style.position = 'absolute';
    s2.style.fontSize = 12*scale + 'px';
    s2.style.right = 5*scale + 'px';
    s2.style.top = 20*scale + 'px';
    s2.innerHTML = this.unit;

    e.appendChild(s0);
    e.appendChild(s1);
    e.appendChild(s2);
}

function sensorFetchData1() {
    var id = this.id;
    $.get(this.url, function(data) {
        var arrayOfData = data.split(',');
        var value = parseFloat(
                arrayOfData[arrayOfData.length-1]
                ).toFixed(1);
        $('#'+id).html(value);
    });
}

function sensorFetchData() {
    var sensor = this;
    $.get(sensor.url, function(data) {
        var arrayOfData = data.split(',');
        var value = parseFloat(
                arrayOfData[arrayOfData.length-1]);
        sensor.value = value;
    });
}


function addSensor(px, py, sensorId, scale) {
    var e = newWidget(4, 2, px, py, scale);
    drawSensor = sensorTemplate.bind(SNS[sensorId]);
    drawSensor(e);
    return e;
}

function updateSensor(sensor) {
    var fetch = sensorFetchData.bind(sensor);
    fetch();
}

function updateAllSensors() {
    for (var key in SNS) {
        sensor = SNS[key];
        updateSensor(sensor);
        var value = (sensor.value === undefined)
            ? 'NAN'
            : sensor.value;
        $('#'+sensor.id).html(value.toFixed(3));
    }
}

