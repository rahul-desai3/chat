var mongoose = require('mongoose');

var onlineChattersSchema = new mongoose.Schema({
	nickname: String
});

module.exports = mongoose.model('online-chatters', onlineChattersSchema);