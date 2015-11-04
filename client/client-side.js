var server = io.connect('http://Rahuls-MacBook-Pro.local:8080/');

server.on('connect', function(data){
  var nickname = prompt("Please enter your nickname for THE chatroom:");
  server.emit('join', nickname);

  while(nickname === null || nickname === ''){
    nickname = prompt("Please enter your nickname for THE chatroom:");
  }

  $("ul#chatters").append("<li data-nickname='"+nickname+"'>" + nickname + "</li>");

  $('input#chatInput').focus();
});

server.on('add chatter', function(nickname){
  var chatter = "<li data-nickname='"+nickname+"'>" + nickname + "</li>";
  $("ul#chatters").append(chatter);
  $('input#chatInput').focus();
});

server.on('messages', function(messages) {
  $("div#chatLog").append("<p>" + messages + "</p>");
  $("div#chatLog").animate({ scrollTop: $(document).height() }, 500);
  $('input#chatInput').focus();
});

$(document).on("submit", "form#chatForm", function(e){
  e.preventDefault();
  var message = $("input#chatInput").val();
  $('input#chatInput').val('').focus();
  $("div#chatLog").append("<p><strong>Me: </strong>" + message + "</p>");
  server.emit("messages", message);
  $("div#chatLog").animate({ scrollTop: $(document).height() }, 500);
  $('input#chatInput').focus();
});

$(window).bind("beforeunload", function() { 
    return confirm("Do you really want to close?"); 
});