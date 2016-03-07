letsDoApp.controller('TaskController', function ($scope, $state, $stateParams, $ionicHistory,
                                                 UserTask, UserTasks, Auth, $cordovaDatePicker, $interval,
                                                 $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, repeatDays) {
    $scope.authUser = Auth.$getAuth();
    $scope.isNewTask = $stateParams.taskId == 'new';
    $scope.firstName = getDisplayNameFromAuth(Auth.$getAuth()).split(" ").shift();
    var ownerId = $stateParams.ownerId;
    if (!ownerId) {
        ownerId = $scope.authUser.uid;
    }
    $scope.hashCode = function (taskId) {
        return taskId.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    };
    $scope.reminderNotification = function (task) {
        $scope.reminderNotifications = [];
        $scope.notificationObject = {
            id: $scope.hashCode(task.$id),
            title: 'LetsDo reminder',
            text: task.message,
            at: new Date(task.dueDate).getTime()
        };
        $scope.reminderNotifications.push($scope.notificationObject);
        $cordovaLocalNotification.schedule($scope.reminderNotifications).
            then(function (result) {
                console.log("notification success", result);
            }, function (error) {
                console.log("notification failed", error);
            });
    };
    $scope.isActive = false;
    $scope.selectButton = function(day, task, index) {
        console.log("index : " +index);
        $scope.isActive = !$scope.isActive;
    };
    $scope.repeatReminderNotification = function (task, day, time) {
        var repeatDate = moment(Date.parse("next "+ day)).format("ddd MMM D YYYY");
        console.log(" time " +time);
        console.log("date : " +moment(repeatDate + " " + time).toDate());
        $scope.repeatNotifications = [];
        $scope.repeatNotificationObject = {
            id: $scope.hashCode(task.$id),
            title: 'Lets Do',
            text: task.message,
            at : moment(repeatDate + " " + time).toDate(),
            every: 'week'
        };
        $scope.repeatNotifications.push($scope.repeatNotificationObject);
        $cordovaLocalNotification.schedule($scope.repeatNotifications).then(function (result) {
            console.log("notification success : ", result);
        }, function (error) {
            console.log("notification failed", error);
        });
    };
    $scope.repeatCancelTimer = function() {
      /* $cordovaLocalNotification.cancel($scope.hashCode(task.$id)).then(function (result) {
       console.log("notification cancelled");
       }); */
    };
    $scope.setTimer = function (task) {
        $scope.date = moment(new Date(task.dueDate)).format('MMMM Do YYYY, h:mm:ss a');
        if (task.dueDate == undefined || task.dueDate == 0) {
            $scope.timerHide = false;
        } else {
            $scope.timerHide = true;
            $scope.dueInterval = task.dueDate - (new Date().getTime());
            $scope.timer = $interval(function () {
                if ($scope.dueInterval <= 0) {
                    $scope.timerHide = false;
                    $interval.cancel($scope.timer);
                }
                $scope.dueInterval = $scope.dueInterval - 1000;
            }, 1000);
        }
    };
    $scope.cancelTimer = function (task) {
        $scope.timerHide = false;
        $interval.cancel($scope.timer);
        task.dueDate = 0;
        $cordovaLocalNotification.cancel($scope.hashCode(task.$id)).then(function (result) {
            console.log("notification cancelled");
        });
        task.$save().then(function () {
        }).catch(function () {
        })
    };
    if ($scope.isNewTask) {
        $scope.timerHide = false;
        $scope.task = {
            ownerId: ownerId,
            ownerName: getDisplayNameFromAuth(Auth.$getAuth()),
            createdAt: new Date().getTime(),
            dueDate: 0
        }
    } else {
        $scope.task = UserTask(ownerId, $stateParams.taskId);
        $scope.setTimer($scope.task);
    }
    $scope.saveTask = function (task) {
        function failureCallback(error) {
            // TODO Show error.
        }

        if (task == undefined || task.message.trim() == '') {
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
    $scope.dateReminder = function (task) {
        $cordovaDatePicker.show(getDateOptions('date')).then(function (date) {
            var reminderDate = moment(date).format("ddd MMM D YYYY");
            $scope.timeReminder(task, reminderDate);
        });
    };
  var reminderTime = "09:00:00";
    $scope.timeReminder = function (task, reminderDate) {
        $cordovaDatePicker.show(getDateOptions('time')).then(function (date) {
            reminderTime = moment(date).format("HH:mm:ss");
            task.dueDate = moment(reminderDate + " " +reminderTime).toDate().getTime();
            task.$save().then(function () {
                $scope.setTimer(task);
                $scope.reminderNotification(task);
            }).catch(function () {
            })
        });
    };
    $scope.dayNames = [{name: "S"}, {name: "M"}, {name: "Tu"}, {name: "W"}, {name: "Th"}, {name: "F"}, {name: "Sa"}];
    $scope.repeatTimer = function (day, task, index) {
      var repeatDay;
        if(day.name == "S") {
            repeatDay = "sunday";
        } else if(day.name == "M") {
            repeatDay = 'monday';
        } else if(day.name == "tu") {
            repeatDay = "tuesday";
        } else if(day.name == "W") {
            repeatDay = "wednesday";
        } else if(day.name == "Th") {
            repeatDay = "thursday";
        } else if(day.name == "F") {
            repeatDay = "friday";
        } else if(day.name == "Sa") {
            repeatDay = "saturday";
        }
        console.log("repeat day : " +repeatDay);
        $scope.repeatReminderNotification(task, repeatDay, reminderTime);
    };
    $scope.mapSearch = function () {
        $state.go('app.map');
    };
});
