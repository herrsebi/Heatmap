
/**
 * Module dependencies.
 */
var express = require('express');

var app = module.exports = express.createServer();

// Add socket.io
var io = require('socket.io').listen(app);

// Add redis support
var redis = require('redis');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Fancy Random Lat/Long stuff 

function outLatLong(socket, data, counter) {
	var coords = data[counter].split(',');
	socket.emit('registration', {latitude: coords[0], longitude: coords[1]});
	setTimeout(outLatLong, 200 + Math.floor(Math.random() * 1000), socket, data, ++counter );
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function(socket){
	console.log('Initial connection');
	client = redis.createClient();
	client.on("message", function(channel, message){
		var coords = message.split(',');
		socket.emit('registration', {latitude: coords[0], longitude: coords[1]});
	});
	client.subscribe('registrations');
});