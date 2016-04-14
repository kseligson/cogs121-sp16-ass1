(function($) {
    "use strict";
    /* TODO: Start your Javascript code here */

    function convertImgToDataURLviaCanvas(url, callback, outputFormat){
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    }
    var catSRC = '';

    var socket = io();
    $("#urlText").on("input", function(e){

        var imageUrl = $("#send_message").find('[name=url]').val();
        var convertType = 'Canvas';
        var convertFunction = convertType === 'FileReader' ?
            convertFileToDataURLviaFileReader :
        	convertImgToDataURLviaCanvas;

        convertFunction(imageUrl, function(base64Img){
        /*    $('#allcontent')
                .find('.cat-img')
                    .attr('src', base64Img)
                    .end()
                .show()*/
                catSRC = base64Img;
        });
    });

    $('#send_message').submit(function(e){
      socket.emit('newsfeed', $('#user_input').val());
      $('#user_input').val('');
      $('#urlText').val('');
      return false;
    })

    socket.on("newsfeed", function(data) {
        var parsedData = data;

        if(messageTemplate(parsedData) != -1) {
          $('#messages').prepend($('<li>').html(messageTemplate(parsedData)));
        }

        // You may use this for updating new message
        function messageTemplate(template) {
          var blank = '';
/*          if(template.message.localeCompare(blank) == 0) {
            alert("Please enter a caption!");
            return -1;
          }*/
            var result = '<div class="user">' +
                '<div class="user-image">' +
                '<img src="' + template.photo + '" alt="">' +
                '</div>' +
                '<div class="user-info">' +
                '<span class="username">' + template.user + '</span><br/>' +
                '<span class="posted">' + template.posted + '</span>' +
                '</div>' +
                '</div>' +
                '<div id="allcontent" style="text-align:center;">' +
                '<img id="img" class="cat-img" src="' + catSRC + '" alt="cat">' +
                '<div class="message-content">' +
                template.message +
                '</div>' +
                '</div>';
            return result;
        }
    });

})($);
