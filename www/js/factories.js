
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
app.factory("repeatDays" , function($firebaseObject) {
    return function(ownerId, taskId) {
        var itemRef = new Firebase(FIREBASE_URL + "/" + ownerId + "/tasks/" +taskId);
        return $firebaseObject(itemRef);
    }
});
app.factory("FriendsList", function($firebaseArray) {
    var activeRefs = {};
    return function(userId){
        var fireBaseArray = activeRefs[userId]
        if(!fireBaseArray) {
            var friendsRef = new Firebase(FIREBASE_URL + "/" + userId + "/friends");
            fireBaseArray = $firebaseArray(friendsRef);
            activeRefs[userId] = fireBaseArray;
        }
        console.log(fireBaseArray);
        return fireBaseArray;
    }
});
app.factory("ChatMessages2",function($firebaseArray){
    return function(friendId, userId){
        console.log("friendId: " ,friendId , userId)
        var user = userId.split(":").pop();
        var friendRef = new Firebase(FIREBASE_URL + "/facebook:"+friendId + "/friends/" +user);
        return $firebaseArray(friendRef);
    }
});
app.factory("ChatMessages", function($firebaseArray){
    return function(userId, friendId){

        var friendRef = new  Firebase(FIREBASE_URL + "/" +userId +"/friends/" +friendId);
        return $firebaseArray(friendRef);
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
