letsDoApp.controller('ChatController', function($scope, Auth, ChatMessages, $stateParams, ChatMessages2){
    $scope.messagesFriend = ChatMessages(Auth.$getAuth().uid, $stateParams.friendId);
    $scope.messagesUser = ChatMessages2($stateParams.friendId, Auth.$getAuth().uid)
    $scope.friendName = $stateParams.friendName;
    $scope.addMessage = function(message){
        if(message == undefined || message.message.trim() == ''){
            return;
        }
            $scope.message = {
                owner:  getDisplayNameFromAuth(Auth.$getAuth()).split(" ").shift(),
                message: message.message
            };
            $scope.messagesFriend.$add($scope.message);
            $scope.messagesUser.$add($scope.message);
            $scope.message.message = '';
    }
});
