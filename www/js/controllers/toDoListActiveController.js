letsDoApp.controller('ToDoListActiveController', function ($rootScope, $state, $scope,
                                                     $ionicModal, Auth, UserTasks,
                                                     UserFinishedTasks, $ionicListDelegate) {
    $scope.authUser = Auth.$getAuth();
    $scope.items = UserTasks($scope.authUser.uid);
    $scope.finishedItems = UserFinishedTasks($scope.authUser.uid);

    $scope.archiveItem = function (item) {
        if (!item) {
            return;
        }

        $scope.finishedItems.$add({message: item.message}).then(function (ref) {
            console.log(">> Successfully saved a message to finished Items ", ref.key(), ref.$id);
        }).catch(function (error) {
            // TODO show error on the modal itself.
        });
        $scope.items.$remove(item).then(function (ref) {
            if (ref.key() == item.$id) {
                console.log(">> Successfully archived ", ref.key());
                $rootScope.$broadcast(ITEMS_ARCHIVED_EVENT, [item]);
                $ionicListDelegate.closeOptionButtons();
            }
        }).catch(function (error) {
        });
    };
});
