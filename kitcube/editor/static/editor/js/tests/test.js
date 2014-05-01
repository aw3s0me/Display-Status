test('test', function() {
	ok(1 == 1, '1 equals one');
})

module('module: kit.parser');
test('cfgParser.initCfgFile(cfgFileName)', function() {
	var testCfgParser = new cfgParser('../static/editor/cfg/hatpro.json');
	equal(testCfgParser.cfgFile, '../static/editor/cfg/hatpro.json', 'Constructor cfg init ok');
	testCfgParser.initCfgFile('../static/editor/cfg/hatpro.json');
	equal(testCfgParser.cfgFile, '../static/editor/cfg/hatpro.json', 'Without constructor init ok');
});
test('cfgParser.parseIni', function() {
	var initObject = {
		"sensor1": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l1b",
			"method": "",
			"name": "brightness temperature",
			"sensor": "L1B.BRIGHT.TEMP",
			"server": "server_elv90",
			"source": "file"
		},
		"sensor2": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l1b",
			"method": "",
			"name": "brightness temp. IR",
			"sensor": "L1B.BRIGHT.TEMP.IR",
			"server": "server_elv90",
			"source": "file"
		},
		"sensor3": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l2a",
			"method": "",
			"name": "water-vapor content",
			"sensor": "L2A.ATM.WAT.VAP.CNT",
			"server": "server",
			"source": "file"
		},
		"sensor4": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l2a",
			"method": "",
			"name": "liquid-water content",
			"sensor": "L2A.ATM.LIQ.WAT.CNT",
			"server": "server",
			"source": "file"
		}
	};

	var testCfgParser = new cfgParser('../../hatpro2.ini');
	deepEqual(initObject, testCfgParser.parseIni(), "ok");
});

test('cfgParser.parseJson', function() {
	var initObject = {
		"sensor1": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l1b",
			"method": "",
			"name": "brightness temperature",
			"sensor": "L1B.BRIGHT.TEMP",
			"server": "server_elv90",
			"source": "file"
		},
		"sensor2": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l1b",
			"method": "",
			"name": "brightness temp. IR",
			"sensor": "L1B.BRIGHT.TEMP.IR",
			"server": "server_elv90",
			"source": "file"
		},
		"sensor3": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l2a",
			"method": "",
			"name": "water-vapor content",
			"sensor": "L2A.ATM.WAT.VAP.CNT",
			"server": "server",
			"source": "file"
		},
		"sensor4": {
			"device": "HATPRO",
			"group": "Data_080_RPG_nc_l2a",
			"method": "",
			"name": "liquid-water content",
			"sensor": "L2A.ATM.LIQ.WAT.CNT",
			"server": "server",
			"source": "file"
		}
	};
	var testCfgParser = new cfgParser('../../hatpro.json');
	deepEqual(initObject, testCfgParser.parseJson(), "ok");
});

test('cfgParser.getSensorNumber', function() {

	ok(1 === 1, "ok");
});

module('module: kit.sizedetector');
test('kit test 2', function() {
	ok(1 == 1, 'sizedetect');
});

module('module: kit.dataDownloader');
test('dataDwn.getSensorData', function(){
	var testDownloader = new dataDownloader();
	//testDownloader.getSensorData(db_server, db_name, db_group, sensorId);
	var csvDataAboutSensor = testDownloader.getSensorData('temp0', 'BakeOut2013', 'TempMon', '2');
	if (csvDataAboutSensor === undefined) {
		console.log('data wasn\'t downloaded');
	}
	var testCfgParser = new cfgParser('ff');
	var parsedJson = testCfgParser.parseCSV(csvDataAboutSensor);

	//Its how we get first element in object
	count = 0;
	for (var first in parsedJson[0]) {
		if (count == 1)
			break;
		count++;
	}
	console.log(first);
	var sensorNumber = first.match(/.*\[(.*)\].*/);
	equal(sensorNumber[1], "435-RTP-5-0-0300", 'SensorId = 435-RTP-5-0-0300 for second Sensor');
}); 

test('getSensorId 2', function(){
	var sensorId = getSensorId('temp0', 'BakeOut2013', 'TempMon', '2');
	equal(sensorId, "435-RTP-5-0-0300", 'SensorId = 435-RTP-5-0-0300 for second Sensor');
});
test('getSensorId 115', function(){
	var sensorId = getSensorId('temp0', 'BakeOut2013', 'TempMon', '115');
	equal(sensorId, "435-RTP-5-0-2524", 'SensorId = 435-RTP-5-0-0300 for second Sensor');
});
test('getSensorNumber 2', function(){
	console.log('1');
	var sensorNumber = getSensorNumber('temp0', 'BakeOut2013', 'TempMon', '2');

	console.log(sensorNumber);
	equal(sensorNumber, "17.83474540710449", "1 = sensorNumber");
});
