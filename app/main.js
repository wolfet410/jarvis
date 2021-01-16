'use strict';

angular.module('myApp.main', ['ngRoute', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:name', {
    templateUrl: function(urlattr) {
      return urlattr.name + '.html';
    },
    controller: 'Ctrl',
    resolve: {
      resolvedViewpagebuttons: function(factoryApi) {
				return factoryApi.viewpagebuttons.get().$promise;
			}
    }
  });
}])

.controller('Ctrl', ['$scope', '$http', '$location', '$mdDialog', 'resolvedViewpagebuttons', function($scope, $http, $location, $mdDialog, resolvedViewpagebuttons) {
  window.$scope = $scope; // For troubleshooting, can remove in production
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
  
  $scope.send = function(item, action) {
    var command;
    
    switch (action) {
      case 'on':
      case 'off':
        command = "turn " + action + " the " + item.pagesname + " " + item.elementsname;
        break;
      case 'brighter':
      case 'dimmer':
        command = "make the " + item.pagesname + " " + item.elementsname + " " + action;
        break;
      case 'purple':
      case 'incandescent':
      case 'white':
        command = "set the " + item.pagesname + " " + item.elementsname + " to " + action;
        break;
    }

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
  
  $scope.viewpagebuttons = resolvedViewpagebuttons;
}]);
