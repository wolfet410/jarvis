'use strict';

angular.module('myApp.main', ['ngRoute', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main.html',
    controller: 'Ctrl'
  }).when('/deactivate', {
    templateUrl: 'deactivate.html',
    controller: 'Ctrl'
  }).when('/basement', {
    templateUrl: 'basement.html',
    controller: 'Ctrl'
  });
}])

.controller('Ctrl', ['$scope', '$http', '$location', '$mdDialog', function($scope, $http, $location, $mdDialog) {
  var originatorEv;
  $scope.openMenu = function($mdMenu, ev) {
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
