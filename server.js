// Node.js Dependencies
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");

require("dotenv").config();

require("dotenv").load();
var models = require("./models");
var db = mongoose.connection;

var router = { /* TODO */
	index: require("./routes/index"),
	chat: require("./routes/chat")
};

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var strategy = { /* TODO */
	Twitter: require("passport-twitter").Strategy,
	Facebook: require("passport-facebook").Strategy
};

// Database Connection
var db = mongoose.connection;
 mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/cogs121');
 db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
 db.once('open', function(callback) {
     console.log("Database connected successfully.");
 });

// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
});

// Middleware
app.set("port", process.env.PORT || 3000);
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());
app.use(require('method-override')());
app.use(session_middleware);
/* TODO: Passport Middleware Here*/
app.use(passport.initialize());
app.use(passport.session());

/* TODO: Use Twitter Strategy for Passport here */
passport.use(new strategy.Twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    	models.TwitterUser.findOne({ "twitterID": profile.id }, function(err, user) {
    		if(err){
    			return done(err);
    		}
    		if(!user) {
				var newUser = new models.TwitterUser({
		    		"twitterID": profile.id,
		    		"token": token,
		    		"username": profile.username,
		    		"displayName": profile.displayName,
		    		"photo": profile.photos[0].value
				});

   				newUser.save(function(err, user){
   					if(err){
   						console.log(err);
   					}
   					else{
   						console.log("User added: " + user);
   					}
   				});
   				return done(null, profile);
    		}
    		else {
        		user.twitterID = profile.id;
        		user.token = token;
        		user.username = profile.username;
        		user.displayName = profile.displayName;
        		user.photo = profile.photos[0].value;
        
        		user.save(function(err, user){
   					if(err){
   						console.log(err);
   					}
   					else{
   						console.log("User updated: " + user);
   					}
   				});
        
        		process.nextTick(function() {
            		return done(null, profile);
        		});
    		}
  		});
  	}
));

/* Facebook Strategory for Passport here */
passport.use(new strategy.Facebook({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos']
  },
  function(accessToken, refreshToken, profile, cb) {
  	console.log("Profile:");
  	console.log(profile);
  	console.log("End of profile\n\n\n\n\n");
    models.FacebookUser.findOne({ facebookID: profile.id }, function (err, user) {
    	if(err) {
    		cb(err);
    	}
    	if(!user) {
    		var newUser = new models.FacebookUser({
	    		"facebookID": profile.id,
	    		"token": accessToken,
	    		"displayName": profile.displayName,
	    		"photo": profile.photos[0].value
			});

			newUser.save(function(err, user){
				if(err){
					console.log(err);
				}
				else{
					console.log("User added: " + user);
				}
			});
			return cb(null, profile);console.log("Creating new user");
    	}
    	else {
    		user.facebookId = profile.id;
    		user.token = accessToken;
    		user.displayName = profile.displayName;
    		user.photo = profile.photos[0].value;
    
    		user.save(function(err, user){
				if(err){
					console.log(err);
				}
				else{
					console.log("User updated: " + user);
				}
			});
    
    		process.nextTick(function() {
        		return cb(null, profile);
    		});

    	}
    });
  }
));

/* TODO: Passport serialization here */
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Routes
/* TODO: Routes for OAuth using Passport */
app.get("/", router.index.view);
// More routes here if needed
app.get("/chat", router.chat.view);
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/chat',
        failureRedirect: '/'
    }));
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
  		failureRedirect: '/',
  		successRedirect: '/chat'
  	}));

io.use(function(socket, next) {
    session_middleware(socket.request, {}, next);
});

/* TODO: Server-side Socket.io here */
io.on("connection", function(socket) {
	var user = socket.request.session.passport.user;

	socket.on('disconnect', function(){
    	console.log('user disconnected'); 
  	});

	socket.on("newsfeed", function(msg) {
		var NewsFeed = new models.Newsfeed({
	    	"user": user.username,
	    	"photo": user.photos[0].value,
		    "message": msg,
		    "posted": new Date()
	    });
    
    	io.emit("newsfeed", NewsFeed );
	});
});



// Start Server
http.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
