function getDisplayNameFromAuth(Auth) {
    var providerName = Auth.provider;
    return Auth[providerName].displayName;
}

function getDateOptions(format) {
    return {
        date: new Date(),
        mode: format,
        allowOldDates: false,
        allowFutureDates: true,
        minuteInterval: 15
    };
}
var letsDoApp = angular.module('starter.controllers', ['starter.factories', 'angularMoment', 'ngCordova']);
