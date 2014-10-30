var app = require('express')();
var server = require('http').Server(app);

var io = require('socket.io')(server);

var redis = require('redis');
var redisClient = redis.createClient();

server.listen(8080);

var messages = [];

var storeMessage = function(nickname, message){

    var jsonString = JSON.stringify({nickname: nickname, message: message});

    redisClient.lpush("messages", jsonString, function(error, response){
        redisClient.ltrim("messages", 0, 3);
    });
};

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
	
	client.on('join', function(nickname){
		client.nickname = nickname;
		console.log(client.nickname + " has joined!");
		client.broadcast.emit("messages", "<strong>" + client.nickname + "</strong> has joined!");        

        // load earlier messages
        redisClient.lrange("messages", 0, -1, function(error, messages){
            messages = messages.reverse();  // so that it is in correct order

            // notify that it is loading
            if(messages.length === 1)
                client.emit("messages", "<span class='italic'>Loading recent 1 message.</span>"); // eliminate the s in message(s)
            else if(messages.length !== 0)
                client.emit("messages", "<span class='italic'>Loading recent " + messages.length + " messages.</span>");

            messages.forEach(function(message){
                message = JSON.parse(message);
                client.emit("messages", "<strong>" + message.nickname + ":</strong> " + message.message);
            });

            client.emit("messages", "<span class='italic'><strong>" + client.nickname + "</strong> has joined!</span>"); // let the user know
        });

        // give connection message
        //client.emit("messages", "<p class='italic'>You have joined THE chatroom.</p>");

	});
	
	client.on('messages', function (messages) {
		client.broadcast.emit("messages", "<strong>" + client.nickname + ":</strong> " + messages);

        storeMessage(client.nickname, messages);
	});
});