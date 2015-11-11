// load all node modules
var express = require('express');
var app = express();

var server = require('http').Server(app); // create and start express server
server.listen(5000, function(){ // change 5000 to process.env.PORT if you are deploying to Heroku
    console.log('The chatroom is now live at port # ' + 5000);
});

var io = require('socket.io')(server);

var mongoose = require('mongoose');
// mongoose.set('debug', true);  // enable if necessary

// configure mongoose as recommended in: http://blog.mongolab.com/2014/04/mongodb-driver-mongoose/
var mongooseOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb-connection-string';

mongoose.connect(mongodbUri, mongooseOptions);

var conn = mongoose.connection;             

conn.on('error', function() {
    console.error('MONGO ERROR!');
    console.error.bind(console, 'MongoDB connection error:');
});  

conn.once('open', function() {
    console.log('MongoDB connection openned');
});

// load MongoDB models
var OnlineChatters = require('./models/onlineChatters');
var ChatLog = require('./models/chatLog');

app.use(express.static(__dirname + '/public'));  // all static resources for the browser

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.set('port', (process.env.PORT || 5000));

function saveChatLog(nickname, newMessage){
    // save the new ChatLog
    var newChatLog = new ChatLog({
        timestamp: Date.now(),
        nickname: nickname,
        message: newMessage
    });
    newChatLog.save(function(err) {
        if (err) throw err;
        console.log('newChatLog saved successfully!');
    });
}

io.on('connection', function (client) {
    
    client.on('join', function(nickname){

        client.nickname = nickname;
        console.log(client.nickname + " has joined!");
        var newMessage = "<span class='italic'><strong>" + client.nickname + "</strong> has joined!</span>"
        client.broadcast.emit("messages", newMessage);
        saveChatLog(undefined, newMessage);  // undefined because message is system generated
        client.broadcast.emit("add chatter", client.nickname);
        console.log('Broadcasted to all clients, except the new one.');

        // get all the users
        OnlineChatters.find({}, function(err, result) {
            if (err) throw err;
            // object of all the users
            console.log('all chatters:', result);

            result.forEach(function(obj){
                client.emit("add chatter", obj.nickname);
                console.log('emitted ' + obj.nickname);
            });
        });

        // save new chatter to MongoDB
        var newChatter = new OnlineChatters({ nickname: nickname });

        newChatter.save(function(err) {
            if (err) throw err;
            console.log('newChatter saved successfully!');
        });


        // load earlier messages
        ChatLog.find({}).sort({'timestamp': -1}).limit(5).exec(function(err, messages){
            if (err) throw err;

            // notify that it is loading
            if(messages.length === 1){
                client.emit("messages", "<span class='italic'>Loading recent 1 message/log.</span>"); // eliminate the s in message(s)
            } else if(messages.length !== 0){
                client.emit("messages", "<span class='italic'>Loading recent " + messages.length + " messages/logs.</span>");
            }

            messages.reverse(); // so that it is in chronological order

            messages.forEach(function(message){
                if(typeof message.nickname !== 'undefined'){ // if not system generated
                    client.emit("messages", "<strong>" + message.nickname + ":</strong> " + message.message);
                } else {
                    client.emit("messages", message.message);
                }
            });

            client.emit("messages", "<hr/>");  // end of recent messages

            var newMessage = "<span class='italic'><strong>" + client.nickname + "</strong> has joined!</span>";
            client.broadcast.emit("messages", newMessage);  // let the user know
            client.emit("messages", newMessage);  // let this user know too
            saveChatLog(undefined, newMessage);  // undefined because message is system generated


        });
    });
    
    client.on('messages', function (messages) {
        client.broadcast.emit("messages", "<strong>" + client.nickname + ":</strong> " + messages);
        // save the new ChatLog
        saveChatLog(client.nickname, messages);
    });

    client.on('disconnect', function(nickname){

        console.log('in disconnect: ', nickname);

        if(client.nickname !== null && typeof client.nickname !== 'undefined'){
            client.broadcast.emit("remove chatter", client.nickname);

            var newMessage = "<span class='italic'><strong>" + client.nickname + "</strong> has left.</span>";

            client.broadcast.emit("messages", newMessage); // let the user know
            
            saveChatLog(undefined, newMessage);  // undefined because message strcture is different, it is system generated, no need to save nickname

            // remove from database
            OnlineChatters.findOneAndRemove({ nickname: client.nickname }, function(err) {
                if (err) throw err;
                console.log(client.nickname + ' deleted!');
            });
        }
    });
});