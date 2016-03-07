angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        }).state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'MenuController'
        }).state('app.index', {
            url: '/index',
            views: {
                'menuContent': {
                    templateUrl: 'templates/tasks.html',
                    controller: 'ToDoListActiveController'
                }
            }
        }).state('app.history', {
            url: '/history',
            views: {
                'menuContent': {
                    templateUrl: 'templates/history.html',
                    controller: 'HistoryController'
                }
            }
        }).state('app.friends', {
            url: '/friends',
            views: {
                'menuContent': {
                    templateUrl: 'templates/friends.html',
                    controller: 'FriendsController'
                }
            }
        }).state('app.task', {
            url: '/owner/:ownerId/task/:taskId/',
            views: {
                'menuContent': {
                    templateUrl: 'templates/task.html',
                    controller: 'TaskController'
                }
            }
        }).state('app.map', {
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map.html',
                    controller: 'MapController'
                }
            }
        }).state('app.chat', {
                url: '/owner/:friendName/friendId/:friendId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/chat.html',
                        controller: 'ChatController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/login');
    });
