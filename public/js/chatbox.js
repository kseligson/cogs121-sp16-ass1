(function($) {
    "use strict";
    /* TODO: Start your Javascript code here */
    var socket = io();
    $('#send_message').submit(function(e){
        socket.emit('newsfeed', $('#user_input').val());
        $('#user_input').val('');
        return false;
    });

    socket.on("newsfeed", function(data) {
        var parsedData = data;
        if(messageTemplate(parsedData) != -1)
          $('#messages').prepend($('<li>').html(messageTemplate(parsedData)));

        // You may use this for updating new message
        function messageTemplate(template) {
          var blank = '';
          if(template.message.localeCompare(blank) == 0) {
            alert("Please enter a caption!");
            return -1;
          }
            var result = '<div class="user">' +
                '<div class="user-image">' +
                '<img src="' + template.photo + '" alt="">' +
                '</div>' +
                '<div class="user-info">' +
                '<span class="username">' + template.user + '</span><br/>' +
                '<span class="posted">' + template.posted + '</span>' +
                '</div>' +
                '</div>' +
                '<div style="text-align:center;">' +
                '<img class="cat-img" src="http://breadedcat.com/wp-content/uploads/2012/02/cat-breading-tutorial-004.jpg" alt="cat">' +
                '<div class="message-content">' +
                template.message +
                '</div>' +
                '</div>';
            return result;
        }
    });
})($);
