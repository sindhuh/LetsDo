var ITEMS_ARCHIVED_EVENT = 'itemsArchived';
var usersRef = new Firebase(FIREBASE_URL + "/users");
letsDoApp.controller('LoginController', function ($scope, $state, Auth, $ionicPlatform, FriendsList, $cordovaFacebook) {
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
                var friendsRef = new Firebase(FIREBASE_URL + "/" + Auth.$getAuth().uid + "/friends");
                $cordovaFacebook.api('/me/friends?fields=id,name,cover', null).then(
                    function (result) {
                        var friendsList = result[Object.keys(result)[0]];
                        angular.forEach(friendsList, function(value, key) {
                            friendsRef.child(friendsList[key].id).set({
                                id:friendsList[key].id,
                                name: friendsList[key].name
                            });
                        })
                    }, function (error) {
                        console.log("Failed: " + error);
                    });            }
            $state.go('app.index');
        } else {
            isNewUser = true;
        }
    });
    $scope.loginWithProvider = function (provider) {
        $cordovaFacebook.login(["public_profile", "email", "user_friends"]).then(function (success) {
            Auth.$authWithOAuthToken(provider, success.authResponse.accessToken).then(function (authData) {
                console.log("Logged in as:", authData.uid);
            }, function (error) {
                console.error("Firebase Authentication failed:", error);
            });
        },function(error){
            console.log("failed facebook login", error);
        });
    };
});
