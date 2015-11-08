angular
.module('chatroom', [])
.controller('mainController', ['$scope', function($scope){

  // first, establish the socket connection
  var server = io.connect('http://Rahuls-MacBook-Pro.local:5000/');
  console.log('Main controller loaded.');

  server.on('connect', function(data){
    var nickname = prompt("Please enter your nickname for THE chatroom:");
    server.emit('join', nickname);

    while(nickname === null || nickname === ''){
      nickname = prompt("Please enter your nickname for THE chatroom:");
    }

    var myEl = angular.element(document.querySelector('#chatters'));
    myEl.append("<li data-nickname='"+nickname+"'>" + nickname + "</li>");     

    // $('input#chatInput').focus();
  });

  server.on('add chatter', function(nickname){
    var chatter = "<li data-nickname='"+nickname+"'>" + nickname + "</li>";
    angular.element(document.querySelector('#chatters')).append(chatter);
    // $('input#chatInput').focus();
  });

  server.on('messages', function(messages) {
    angular.element(document.querySelector('#chatLog')).append("<p>" + messages + "</p>");
    // $("div#chatLog").animate({ scrollTop: $(document).height() }, 500);
    // $('input#chatInput').focus();
  });

  $scope.submitHandler = function($event){
    $event.preventDefault();

    angular.element(document.querySelector('#chatLog')).append("<p><strong>Me: </strong>" + $scope.chatInput + "</p>");

    server.emit("messages", $scope.chatInput);

    $scope.chatInput = "";

    // $("div#chatLog").animate({ scrollTop: $(document).height() }, 500);
    // $('input#chatInput').focus();
  };

  // $(document).on("submit", "form#chatForm", function(e){
  //   e.preventDefault();
  //   var message = $("input#chatInput").val();
  //   $('input#chatInput').val('').focus();
  //   $("div#chatLog").append("<p><strong>Me: </strong>" + message + "</p>");
  //   server.emit("messages", message);
  //   $("div#chatLog").animate({ scrollTop: $(document).height() }, 500);
  //   $('input#chatInput').focus();
  // });

  window.addEventListener("beforeunload", function (event) {
    return confirm("Do you really want to close?");
  });

}]);


// $(window).bind("beforeunload", function() { 
//     return confirm("Do you really want to close?"); 
// });