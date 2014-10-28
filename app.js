var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {

	//var nickname_global;
	
	client.on('join', function(nickname){
		client.nickname = nickname;
		console.log(client.nickname + " has joined!");
		client.broadcast.emit("messages", "<strong>" + client.nickname + "</strong> has joined!");
		//var clients = findClientsSocket();
		//console.log(clients);

        var rooms = io.sockets.adapter.rooms;
        var roomId = Object.keys(rooms);
        console.log(roomId[0]);

        var clients = io.sockets.adapter.rooms[roomId[0]];

        for (var clientId in clients ) {

             //this is the socket of each client in the room.
             var clientSocket = io.sockets.connected[clientId];

             console.dir(clientSocket);

        }
	});
	
	client.on('messages', function (messages) {
		client.broadcast.emit("messages", "<strong>" + client.nickname + ":</strong> " + messages);
	});
});

function findClientsSocketByRoomId(roomId) {
    var res = []
    , room = io.sockets.adapter.rooms[roomId];
    if (room) {
        for (var id in room) {
        res.push(io.sockets.adapter.nsp.connected[id]);
        }
    }
    return res;
}