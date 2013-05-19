
/**
 * Subnodes is an open source project that enables people to easily set up portable access points for serving content.
 * Author : Sarah Grant
 * Github : http://github.com/chootka/subnodes
 */


/**
 * Module dependencies.
 */
var express     = require('express'),
	app         = express(),
    http		= require('http'),
    server 		= http.createServer(app),
    io			= require('socket.io').listen(server);

app.root    	= __dirname;

io.configure('production', function(){
  io.enable('browser client etag');
  io.set('log level', 1);

  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function(){
  io.set('transports', ['websocket']);
});

// finally create this application, our root server //
require('./app/config')(app, express);
require('./app/server/router')(app);
require('./app/server/db')
require('./app/server/modules/chat')(io);

server.listen(80, function() {
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});