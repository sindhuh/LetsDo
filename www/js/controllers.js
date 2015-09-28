var app = angular.module('starter.controllers', ['starter.factories', 'angularMoment', 'ngCordova']);
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
            $state.go('app.index');
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
app.controller('MenuController',  function($scope, $state, $ionicSideMenuDelegate, Auth){
    $scope.username = getDisplayNameFromAuth(Auth.$getAuth());
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
        console.log(">>>> " +UserFinishedTasks($scope.authUser.uid).length);
    }
});
app.controller('TaskController', function($scope, $state, $stateParams, $ionicHistory,
                                          UserTask, UserTasks, Auth, $cordovaDatePicker, $interval,
                                          $ionicListDelegate) {

    $scope.authUser = Auth.$getAuth();
    $scope.isNewTask = $stateParams.taskId == 'new';
    $scope.username = getDisplayNameFromAuth(Auth.$getAuth()).split(" ").shift();
    var ownerId = $stateParams.ownerId;
    if (!ownerId) {
        ownerId = $scope.authUser.uid;
    }
    $scope.setTimer = function(task){
        if(task.dueDate == 0){

        } else {
            $scope.dueTime = task.dueDate - (new Date().getTime());
            var timer = $interval( function(){
                if($scope.dueTime == 0){
                    $interval.cancel(timer);
                }
                $scope.dueTime = $scope.dueTime - 1000;
            }, 1000);
        }
    };
    if ($scope.isNewTask) {
        var createdDate = new  Date();
        $scope.task = {
            ownerId: ownerId,
            ownerName: getDisplayNameFromAuth(Auth.$getAuth()),
            createdAt: createdDate.getTime(),
            dueDate : 0
        }
    } else {
        $scope.task = UserTask(ownerId, $stateParams.taskId);
        $scope.setTimer($scope.task);
    }
    $scope.saveTask = function (task) {
        function failureCallback(error) {
            // TODO Show error.
        }
        if ( task == undefined || task.message.trim() == '') {
            failureCallback();
            return;
        }
        function successCallback(ref) {
            $ionicHistory.goBack();
        }
        if (!task.$id) {
            var tasks = UserTasks(ownerId);
            tasks.$add(task).then(successCallback).catch(failureCallback);
        } else {
            task.$save().then(successCallback).catch(failureCallback);
        }
    };
    $scope.dateReminder =function(task) {
            $cordovaDatePicker.show(getDateOptions('date')).then(function (date) {
                var reminderDate = moment(date).format("ddd MMM D YYYY");
                $scope.timeReminder(task, reminderDate);
            });
    };
    $scope.timeReminder = function(task, reminderDate) {
            $cordovaDatePicker.show(getDateOptions('time')).then(function (date) {
                var reminderTime = moment(date).format("HH:mm:ss");
                task.dueDate = moment(reminderDate + " " +reminderTime).toDate().getTime();
                task.$save().then(function(){
                }).catch(function(){
                    $scope.setTimer(task);
                })
            });
    };
});
app.controller('ToDoListActiveController', function ($rootScope, $state , $scope,
                                                     $ionicModal, Auth, UserTasks,
                                                     UserFinishedTasks, $ionicListDelegate) {
    $scope.authUser = Auth.$getAuth();
    $scope.items = UserTasks($scope.authUser.uid);
    $scope.finishedItems = UserFinishedTasks($scope.authUser.uid);

    $scope.archiveItem = function (item) {
        if (!item) {
            return;
        }

        $scope.finishedItems.$add({message: item.message}).then(function(ref) {
            console.log(">> Successfully saved a message to finished Items ", ref.key(), ref.$id);
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
});


