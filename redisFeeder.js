/**
 * Small script to feed the redis channel with faux registrations
 */

var redis = require('redis'),
	client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function outLatLong(client, data, counter) {
	if (counter >= data.length) return;
	var coords = data[counter].split(',');
	//socket.emit('registration', {latitude: coords[0], longitude: coords[1]});
	client.publish('registrations', coords[0] + ',' + coords[1]);
	setTimeout(outLatLong, 200 + Math.floor(Math.random() * 1000), client, data, ++counter );
}

client.on('connect', function(){
	console.log('Starting output:');
	var fs = require('fs');
	fs.readFile('/mnt/sepl/trunk/pssystem/web1.var_www_cron/geoIpRegs.csv', function (err, data) {
	  if (err) throw err;
	  outLatLong(client, data.toString().split("\n"), 1);
	});
});