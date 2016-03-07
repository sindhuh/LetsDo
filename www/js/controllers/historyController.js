letsDoApp.controller('HistoryController', function ($rootScope, $scope, Auth, UserFinishedTasks) {
    $scope.authUser = Auth.$getAuth();
    $scope.finishedItems = UserFinishedTasks($scope.authUser.uid);
    $scope.clearAll = function () {
        console.log(">>>> " + UserFinishedTasks($scope.authUser.uid).length);
    }
});
