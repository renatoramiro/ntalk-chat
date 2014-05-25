
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var load = require('express-load');
var error = require('./middleware/error');

var server = require('http').createServer(3000);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('ntalk'));
app.use(express.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(error.notFound);
app.use(error.serverError);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

load('models').then('controllers').then('routes').into(app);

io.sockets.on('connection', function (client) {
  client.on('send-server', function (data) {
    var msg = "<b>"+data.nome+":</b> "+data.msg+"<br>";
    client.emit('send-client', msg);
    client.broadcast.emit('send-client', msg);
	});
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
