// load all node modules
var express = require('express');
var app = express();

var server = require('http').Server(app); // create and start express server
server.listen(5000, function(){ // change 5000 to process.env.PORT if you are deploying to Heroku
    console.log('The chatroom is now live at port # ' + process.env.PORT);
});

var io = require('socket.io')(server);

var mongoose = require('mongoose');
// mongoose.set('debug', true);     // uncomment if needed

// configure mongoose as recommended in: http://blog.mongolab.com/2014/04/mongodb-driver-mongoose/
var mongooseOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://heroku_kjsrj1v0:vontera2014@ds037623-a0.mongolab.com:37623,ds037623-a1.mongolab.com:37623/heroku_kjsrj1v0?replicaSet=rs-ds037623';

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

io.on('connection', function (client) {
    
    client.on('join', function(nickname){

        client.nickname = nickname;
        console.log(client.nickname + " has joined!");
        client.broadcast.emit("messages", "<span class='italic'><strong>" + client.nickname + "</strong> has joined!</span>");
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
                client.emit("messages", "<span class='italic'>Loading recent 1 message.</span>"); // eliminate the s in message(s)
            } else if(messages.length !== 0){
                client.emit("messages", "<span class='italic'>Loading recent " + messages.length + " messages.</span>");
            }

            messages.reverse(); // so that it is in chronological order

            messages.forEach(function(message){
                client.emit("messages", "<strong>" + message.nickname + ":</strong> " + message.message);
            });

            client.emit("messages", "<hr/>");

            client.emit("messages", "<span class='italic'><strong>" + client.nickname + "</strong> has joined!</span>"); // let the user know

        });
    });
    
    client.on('messages', function (messages) {
        client.broadcast.emit("messages", "<strong>" + client.nickname + ":</strong> " + messages);
        // save the new ChatLog
        var newChatLog = new ChatLog({
            timestamp: Date.now(),
            nickname: client.nickname,
            message: messages
        });
        newChatLog.save(function(err) {
            if (err) throw err;
            console.log('newChatLog saved successfully!');
        });
    });

    client.on('disconnect', function(nickname){

        console.log('in disconnect: ', nickname);

        if(client.nickname !== null && typeof client.nickname !== 'undefined'){
            client.broadcast.emit("remove chatter", client.nickname);

            client.broadcast.emit("messages", "<span class='italic'><strong>" + client.nickname + "</strong> has left.</span>"); // let the user know
            
            // remove from database
            OnlineChatters.findOneAndRemove({ nickname: client.nickname }, function(err) {
                if (err) throw err;
                console.log(client.nickname + ' deleted!');
            });
        }
    });
});