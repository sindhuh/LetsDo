/**
 * Created by sindhu on 9/20/15.
 */
var app = angular.module('starter.factories', ["firebase"]);
app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase(FIREBASE_URL);
        return $firebaseAuth(ref);
    }
]);
app.factory("UserTasks", function ($firebaseArray) {
    return function (userId) {
        var itemsRef = new Firebase(FIREBASE_URL + "/"  + userId + "/tasks");
        return $firebaseArray(itemsRef);
    }
});
app.factory("UserFinishedTasks", function ($firebaseArray) {
    return function (userId) {
        var finishedItemsRef = new Firebase(FIREBASE_URL + "/"  + userId + "/archived");
        return $firebaseArray(finishedItemsRef);
    }
});
