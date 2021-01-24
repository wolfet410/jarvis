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

.controller('Ctrl', ['$scope', '$http', '$location', '$mdDialog', '$filter', '$timeout', 'resolvedViewpagebuttons', 'resolvedPages', 
    function($scope, $http, $location, $mdDialog, $filter, $timeout, resolvedViewpagebuttons, resolvedPages) {

  window.$scope = $scope; // For troubleshooting, can remove in production
  $scope.viewpagebuttons = resolvedViewpagebuttons;
  
  var gotoPage = function(pagesid) {
    $scope.page = resolvedPages.data[pagesid];
    $scope.pagebuttons = $filter('filter')(resolvedViewpagebuttons.data, { pagesid: pagesid }, true);
    for (var i = 1; i < 9; i++) {
      $scope['button' + i] = $filter('filter')($scope.pagebuttons, { position: i }, true)[0];
    }
  };
  gotoPage(0);
  
  var originatorEv;
  $scope.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };
   
  $scope.sendcommand = function(i) {
    $scope.commandsobject[i].status = "Executing";

    var data = {
      command: $scope.commandsobject[i].command,
      converse: false,
      user: "user0121"
      // user: "fail"
    };
    
    $http.post('http://192.168.86.26:3001/assistant', JSON.stringify(data))
      .then(function success(response) {
        if (typeof $scope.commandsobject[i+1] === "undefined") {
          $scope.commandsobject[i].status = "Done";          
          $timeout(function() { $mdDialog.hide(); }, 2000);
        } else {
          $scope.commandsobject[i].status = "Done";
          $scope.sendcommand(i+1);  
        }      
      }, function error(response) {
        if (typeof $scope.commandsobject[i+1] === "undefined") {
          $scope.commandsobject[i].status = "Failed";
          $timeout(function() { $mdDialog.hide(); }, 2000);
        } else {
          $scope.commandsobject[i].status = "Failed";
          $scope.sendcommand(i+1);  
        }
      });
  };

  $scope.send = function(item, action) {
    var command;
    
    switch (action) {
      case 'on':
      case 'off':
        command = "Turn " + action + " the " + item.pagesname + " " + item.elementsname;
        break;
      case 'brighter':
      case 'dimmer':
        command = "Make the " + item.pagesname + " " + item.elementsname + " " + action;
        break;
      case 'purple':
      case 'incandescent':
      case 'white':
        command = "Set the " + item.pagesname + " " + item.elementsname + " to " + action;
        break;
    }

    $scope.commandsobject = {};
    $scope.commandsobject[0] = {
      command: command,
      status: "Waiting"
    };

    $scope.dialog.showstatus = true;
    $scope.dialog.showbuttons = false;
    $scope.sendcommand(0);
  }

  $scope.guess = function(item, event) {
    // Reads the item to determine what action to perform based on the type
    switch (item.type) {
      case 'page':
        gotoPage(item.destpagesid);
        break;
      case 'custom':
        $scope.dialog = {
          showstatus: true,
          showbuttons: false,
          title: $scope[event.target.id].elementsname
        };
        $mdDialog.show({
          targetEvent: event,
          locals: { parent: $scope },
          controller: angular.noop,
          controllerAs: 'dialogctrl',
          bindToController: true,
          templateUrl: 'dialog.html?' + +new Date(),
          clickOutsideToClose: false
        });
        
        // Building commandsobject
        var commands = item.customcommand.split(';');
        $scope.elementsname = item.elementsname;
        $scope.commandsobject = {};
        var i = 0;
        angular.forEach(commands,function(command) {
          $scope.commandsobject[i] = {
            command: command,
            status: "Waiting"
          };
          i++;
        });

        // Sending first command
        $scope.sendcommand(0);
        break;
      case 'light':
      case 'fan':
      case 'plug':
        $scope.dialog = {
          showstatus: false,
          showbuttons: true,
          target: $scope[event.target.id],
          title: $scope[event.target.id].pagesname + " " + $scope[event.target.id].elementsname
        };
        $mdDialog.show({
          targetEvent: event,
          locals: { parent: $scope },
          controller: angular.noop,
          controllerAs: 'dialogctrl',
          bindToController: true,
          templateUrl: 'dialog.html?' + +new Date(),
          clickOutsideToClose: true
        });
        break;
    }
  }

}]);
