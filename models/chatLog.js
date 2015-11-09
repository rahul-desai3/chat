var mongoose = require('mongoose');

var chatLogSchema = new mongoose.Schema({
	timestamp: {
		type: String,
        required: true,
        unique: true
	},
    nickname: String,
    message: String
});

module.exports = mongoose.model('chat-log', chatLogSchema);