'use strict';

angular.module('myApp.mainfloor', ['ngRoute', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/mainfloor', {
    templateUrl: 'mainfloor/mainfloor.html',
    controller: 'MainfloorCtrl'
  });
}])

.controller('MainfloorCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
  var originatorEv;
  $scope.openMenu = function($mdMenu, ev) {
console.warn('here' + ev);
    originatorEv = ev;
    $mdMenu.open(ev);
  };
    
  $scope.sendcommand = function(command) {
    
    var data = {
      command: command,
      converse: false,
      user: "wolfet410@gmail.com"
    };
    
    $http.post('http://192.168.86.26:3001/assistant', JSON.stringify(data))
      .then(function(response) {
        console.warn(response);
    });
  }
}]);
