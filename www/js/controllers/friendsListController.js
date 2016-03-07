letsDoApp.controller('FriendsController', function($scope, $ionicPlatform, $cordovaFacebook, Auth, FriendsList){
    $scope.authUser = Auth.$getAuth();
    console.log("resching friends")
    $scope.friendsList = FriendsList(($scope.authUser).uid);
});
