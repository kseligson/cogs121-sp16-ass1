var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
	"twitterID": String,
    "token": String,
    "username": String,
    "displayName": String,
    "photo": String
});

exports.User = Mongoose.model('User', UserSchema);