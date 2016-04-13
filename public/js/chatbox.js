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
        $('#messages').prepend($('<li>').html(messageTemplate(parsedData)));

        // You may use this for updating new message
        function messageTemplate(template) {
            var result = '<div class="user">' +
                '<div class="user-image">' +
                '<img src="' + template.photo + '" alt="">' +
                '</div>' +
                '<div class="user-info">' +
                '<span class="username">' + template.user + '</span><br/>' +
                '<span class="posted">' + template.posted + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="message-content">' +
                template.message +
                '</div>';
            return result;
        }
    });
})($);