var http = require('http');
var io = require('socket.io');

//Websocket
var server = http.createServer(function(request, response) { 
	response.writeHead(200, {'Content-Type': 'text/html'}); 
	response.end('Websocket server is up and running!');
}).listen(8889);
  
//Socket.IO
var socket = io.listen(server).set('log level', 1);

//Listeners for intercepting client messages
socket.on('connection', function(client) { 
	client.on('message', function(data) { 
		console.log('Message from client: ', data);
	});
	client.on('customMessage', function (data) {
		console.log('Custom message from client: ', data);
		
		var now = new Date().getTime();
		
		//Emits back to the client a message
		client.emit('customMessageResponse', data + '->' + now);
		
		//Broadcasts to all the clients a message
		client.broadcast.emit('customMessageResponse', data + '(broadcasted)->' + now);
	});
	client.on('disconnect', function(){
		console.log('Client disconnected');
	});
});