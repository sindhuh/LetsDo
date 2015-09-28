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
    var activeRefs = {};
    return function (userId) {
        var fireBaseArray = activeRefs[userId];
        if (!fireBaseArray) {
            var itemsRef = new Firebase(FIREBASE_URL + "/"  + userId + "/tasks");
            fireBaseArray = $firebaseArray(itemsRef);
            activeRefs[userId] = fireBaseArray;
        }
        return fireBaseArray;
    }
});
app.factory("UserTask", function ($firebaseObject) {
    var activeRefs = {};
    return function (ownerId, taskId) {
        var uniqueId = ownerId + "#" + taskId;
        var fireBaseObj = activeRefs[uniqueId];
        if (!fireBaseObj) {
            var itemRef = new Firebase(FIREBASE_URL + "/"  + ownerId + "/tasks/" + taskId);
            fireBaseObj = $firebaseObject(itemRef);
            activeRefs[uniqueId] = fireBaseObj;
        }
        return fireBaseObj;
    }
});
app.factory("UserFinishedTasks", function ($firebaseArray) {
    var activeRefs = {};
    return function (userId) {
        var fireBaseArray = activeRefs[userId];
        if (!fireBaseArray) {
            var itemsRef = new Firebase(FIREBASE_URL + "/"  + userId + "/archived");
            fireBaseArray = $firebaseArray(itemsRef);
            activeRefs[userId] = fireBaseArray;
        }
        return fireBaseArray;
    }
});
