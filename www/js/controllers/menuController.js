letsDoApp.controller('MenuController', function ($scope, $state, $ionicSideMenuDelegate, Auth) {
    $scope.username = getDisplayNameFromAuth(Auth.$getAuth());
    $scope.$on('$ionicView.enter', function () {
        $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.logout = function () {
        usersRef.unauth();
        $state.go('login');
    }
});
