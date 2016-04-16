var models = require("../models");

exports.view = function(req, res) {
    /* TODO */
    models.Newsfeed
    	.find()
    	.sort({'posted': -1})
    	.exec(displayPictures);

    function displayPictures(err, pics) {
    	if(err) {
    		console.log(err);
    		res.send(500)
    	}
    	res.render("chat", {'newsfeed': pics});
    };
};