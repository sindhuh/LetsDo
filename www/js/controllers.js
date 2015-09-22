var app = angular.module('starter.controllers', ['starter.factories']);
var ITEMS_ARCHIVED_EVENT = 'itemsArchived';
var usersRef = new Firebase(FIREBASE_URL + "/users");
app.controller('LoginController', function ($scope, $state, Auth) {
    function getName(authData) {
        switch (authData.provider) {
            case 'facebook':
                return authData.facebook.displayName;
        }
    }
    var isNewUser = false;
    Auth.$onAuth(function (authData) {
        if (authData != null) {
            if (isNewUser) {
                usersRef.child(authData.uid).set({
                    provider: authData.provider,
                    name: getName(authData)
                });
            }
            $state.go('app.tasks');
        } else {
            isNewUser = true;
        }
    });
    $scope.loginWithProvider = function (provider) {
        Auth.$authWithOAuthPopup(provider).then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
        }).catch(function(error) {
            console.log("Login Failed!", error);
        });
    };
});
app.controller('MenuController',  function($scope, $state, $ionicSideMenuDelegate , Auth){
    $scope.providerName = Auth.$getAuth().provider;
    $scope.username = Auth.$getAuth()[$scope.providerName].displayName;
    $scope.$on('$ionicView.enter', function(){
        $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function(){
        $ionicSideMenuDelegate.canDragContent(true);
    });
    $scope.logout = function(){
        usersRef.unauth();
        $state.go('login');
    }
});
app.controller('HistoryController',function($rootScope, $scope, Auth, UserFinishedTasks){
    $scope.authUser = Auth.$getAuth();
    $scope.finishedItems = UserFinishedTasks($scope.authUser.uid);
    $scope.clearAll = function(){
       // finishedItemsRef.remove();
        console.log(">>>> "+UserFinishedTasks($scope.authUser.uid).length);
    }
});
app.controller('ToDoListActiveController', function ($rootScope, $scope, $ionicModal, Auth, UserTasks,UserFinishedTasks,$ionicListDelegate) {
    $scope.authUser = Auth.$getAuth();
    $scope.items = UserTasks($scope.authUser.uid);
    $scope.finishedItems = UserFinishedTasks($scope.authUser.uid);


    $scope.showEditTask = function (item) {
        $scope.isNewTask = item == undefined;
        $scope.task = item ? item : {} ;
        $scope.modal.show();
    };

    $scope.addTask = function (task) {
        if (task.message.trim() == '') {
            // TODO Show error.
            return;
        }
        $scope.items.$add({message: task.message}).then(function(ref) {
            console.log(">> Successfully saved a message ", ref.key(), ref.$id);
            task.message = '';
            $scope.closeNewTask();
        }).catch(function(error) {
            // TODO show error on the modal itself.
        });
    };

    $scope.updateTask = function (item) {
        $scope.items.$save(item).then(function(ref) {
            if (ref.key() == item.$id) {
                console.log(">> Successfully updated ", ref.key());
                $scope.closeNewTask();
                $ionicListDelegate.closeOptionButtons();
            }
        }).catch(function(error) {
        });
    };

    $scope.archiveItem = function (item) {
        if (!item) {
            return;
        }
        console.log(item.$id);
        $scope.finishedItems.$add({message: item.message}).then(function(ref) {
            console.log(">> Successfully saved a message to finished Items ", ref.key(), ref.$id);
            $scope.closeNewTask();
        }).catch(function(error) {
            // TODO show error on the modal itself.
        });
        $scope.items.$remove(item).then(function(ref) {
            if (ref.key() == item.$id) {
                console.log(">> Successfully archived ", ref.key());
                $rootScope.$broadcast(ITEMS_ARCHIVED_EVENT, [item]);
                $ionicListDelegate.closeOptionButtons();
            }
        }).catch(function (error) {
        });
    };

    $ionicModal.fromTemplateUrl('new-task.html', {
        scope: $scope,
        animation: 'slide-in-down',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeNewTask = function () {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
});


