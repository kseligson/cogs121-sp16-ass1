var Mongoose = require('mongoose');

var TwitterUserSchema = new Mongoose.Schema({
	"twitterID": String,
    "token": String,
    "username": String,
    "displayName": String,
    "photo": String
});

var FacebookUserSchema = new Mongoose.Schema({
	"facebookID": String,
	"token": String,
	"displayName": String,
	"photo": String
});

var NewsfeedSchema = new Mongoose.Schema({
	"user": String,
    "caption": String,
    "profilephoto": String,
    "photo": String,
    "posted": Date
});

var CatPhotoSchema = new Mongoose.Schema({
	"user": String,
	"caption": String,
	"photo": String,
	"posted": Date
});

exports.TwitterUser = Mongoose.model('TwitterUser', TwitterUserSchema);
exports.Newsfeed = Mongoose.model('Newsfeed', NewsfeedSchema);
exports.FacebookUser = Mongoose.model('FacebookUser', FacebookUserSchema);
exports.CatPhoto = Mongoose.model('CatPhoto', CatPhotoSchema);
