module.exports = function(io) {

	var colors = ['#dfe937', '#ff9b39', '#2fa9f0', '#946af1', '#39f0c3'];
	var connections = {};

	io
		.of('/chat')
		.on('connection', function( socket ) {

			// record client connection to connections obj
			connections[socket.id] = { data: {} };

			// give each connected user a random color so it's easier to tell them apart in the chat log
			socket.on('userReady', function( data ) {
				// pass socket id to client
				data.id = socket.id;
				// save client username in the socket session for this client
				connections[socket.id].data.name = data.name;
				// save client color in the socket session for this client
				data.color = colors[Math.floor(Math.random() * colors.length)];
				connections[socket.id].data.color =  data.color;
				
				// send user to main room and let everyone know
				data.connections = connections;
				broadcastMessage( 'userReady', data );
			});

			socket.on('userMessage', function( data ) {
				data.color = connections[socket.id].data.color || '#ffffff';
				broadcastMessage( 'userMessage', data );
			});

			socket.on('disconnect', function() {
				broadcastMessage('userDisconnected', { name : connections[socket.id].data.name });
				delete connections[socket.id];	
			});

			function broadcastMessage( message, data ) {
				data.connections = connections;
				// remove socket.emit if you don't want the sender to receive their own message
				socket.emit( message, data );
				socket.broadcast.emit( message, data );
			}

			function getObjectSize( obj ) {
				var size = 0, key;
				for (key in obj) {
					if (obj.hasOwnProperty(key)) size++;
				}
				return size;
			}
		});
};