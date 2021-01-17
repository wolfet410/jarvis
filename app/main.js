'use strict';

angular.module('myApp.main', ['ngRoute', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:name', {
    templateUrl: function(urlattr) {
      return urlattr.name + '.html';
    },
    controller: 'Ctrl',
    resolve: {
      resolvedPages: function(factoryApi) {
				return factoryApi.pages.get().$promise;
			},
      resolvedViewpagebuttons: function(factoryApi) {
				return factoryApi.viewpagebuttons.get().$promise;
			}
    }
  });
}])

.controller('Ctrl', ['$scope', '$http', '$location', '$mdDialog', '$filter', 'resolvedViewpagebuttons', 'resolvedPages', 
    function($scope, $http, $location, $mdDialog, $filter, resolvedViewpagebuttons, resolvedPages) {

  window.$scope = $scope; // For troubleshooting, can remove in production
  var gotoPage = function(pagesid) {
    $scope.page = resolvedPages.data[pagesid];
    $scope.pagebuttons = $filter('filter')(resolvedViewpagebuttons.data, { pagesid: pagesid});
    for (var i = 1; i < 9; i++) {
      $scope['button' + i] = $filter('filter')($scope.pagebuttons, { position: i })[0];
    }
  };
  gotoPage(0);

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

  $scope.guess = function(item, event) {
    // Reads the item to determine what action to perform based on the type
    switch (item.type) {
      case 'page':
        gotoPage(item.destpagesid);
        break;
      case 'custom':
        angular.forEach(item.customcommand.split(';'),function(command) {
          $scope.sendcommand(command);
        });
        break;
      case 'light':
      case 'fan':
      case 'plug':
        $scope.dialogbutton = $scope[event.target.id];
        $mdDialog.show({
          targetEvent: event,
          locals: { parent: $scope },
          controller: angular.noop,
          controllerAs: 'dialogctrl',
          bindToController: true,
          templateUrl: 'dialog.html',
          clickOutsideToClose: true
        });
        break;
    }
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

    $scope.sendcommand(command);
  }
}]);
