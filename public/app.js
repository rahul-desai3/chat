angular
.module('chatroom', ['ngAnimate', 'ui.bootstrap'])
.controller('mainController', ['$scope', '$http', '$uibModal', '$window', function($scope, $http, $uibModal, $window){

  // first, establish the socket connection
  var server = io('https://my-chatroom-demo.herokuapp.com');

  // hide chatroom until the nickname is entered
  $scope.gotNickname = false;

  // on connect
  server.on('connect', function(data){
    // trigger modal load  
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      backdrop: 'static'
    });

    modalInstance.result.then(function (nickname) {
      server.emit('join', nickname);
      $scope.nicknames = [ {nickname: nickname} ];
      $scope.gotNickname = true;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  });

  // on new chatter
  server.on('add chatter', function(nickname){
    console.log('Got add chatter request for ' + nickname);

    $scope.nicknames.push({nickname: nickname});
    $scope.$apply();
  });

  // on remove chatter
  server.on('remove chatter', function(nickname){
    if(nickname !== null && typeof nickname !== 'undefined'){
      console.log('Someone left: ' + nickname);

      console.log('$scope.nicknames', $scope.nicknames);

      for(var i=0, l=$scope.nicknames.length; i<l; i++){
        if($scope.nicknames[i].nickname === nickname){
          $scope.nicknames.splice(i,1);
          $scope.$apply();
          break;
        }
      }
    }
  });

  server.on('messages', function(message) {
    if(/null/.test(message) === true || /undefined/.test(message) === true){ // temporary fix
      return false;
    }

    angular.element(document.querySelector('#chatLog')).append("<p>" + message + "</p>");
    var chatLogDiv = document.getElementById("chatLog");
    chatLogDiv.scrollTop = chatLogDiv.scrollHeight - chatLogDiv.clientHeight;
  });

  $scope.submitHandler = function($event){
    $event.preventDefault();

    angular.element(document.querySelector('#chatLog')).append("<p class='italic'><strong>Me: </strong>" + $scope.chatInput + "</p>");
    
    var chatLogDiv = document.getElementById("chatLog");
    chatLogDiv.scrollTop = chatLogDiv.scrollHeight;

    server.emit("messages", $scope.chatInput);

    $scope.chatInput = "";
  };

  $window.addEventListener("beforeunload", function (event) {
    return $window.confirm("Do you really want to close?");
  });

}]);

angular.module('chatroom').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
  $scope.nicknameSubmitHandler = function () {
    if($scope.nickname){
      if($scope.nickname.trim() === ''){
        $scope.nickname = '';
        $scope.nicknameError = "Please enter a nickname.";
      } else {
        $uibModalInstance.close($scope.nickname);
      }
    } else {
      $scope.nicknameError = "Please enter a nickname.";
    }
  };
});