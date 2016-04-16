(function($) {
    "use strict";
    /* TODO: Start your Javascript code here */
    var socket = io();

    socket.on("newsfeed", function(data) {
        var parsedData = data;

        if(messageTemplate(parsedData) != -1) {
          $('#photos').prepend($('<li>').html(messageTemplate(parsedData)));
        }

        // You may use this for updating new message
        function messageTemplate(template) {
          var blank = '';
/*          if(template.message.localeCompare(blank) == 0) {
            alert("Please enter a caption!");
            return -1;
          }*/
          console.log(template);
          console.log(template._id);
            var result = '<div class="messages" id="post' + template._id + '"><div class="user">' +
                '<div class="user-image">' +
                '<img src="' + template.profilephoto + '" alt="">' +
                '</div>' +
                '<div class="user-info">' +
                '<span class="username">' + template.user + '</span><br/>' +
                '<span class="posted">' + template.posted + '</span>' +
                '</div>' +
                '</div>' +
                '<div id="allcontent" style="text-align:center;">' +
                '<img id="img" class="cat-img" src="' + template.photo + '" alt="cat">' +
                '<div class="message-content">' +
                template.caption +
                '</div>' +
                '</div></div>';
            return result;
        }
    });

})($);
var socket = io();

$('#send_message').submit(function(e){
        var data = {
            "caption": $('#user_input').val(),
            "url": $('#urlText').val()
        };
      socket.emit('newsfeed', data);
      $('#user_input').val('');
      $('#urlText').val('');
      return false;
});