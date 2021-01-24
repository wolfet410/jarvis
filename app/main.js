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
   
  $scope.sendcommand = function(command, i) {
console.warn(i);
// closer, i increments but the UI doesn't get updated
// the problem with timeout is it schedules it and then the code moves on, because it's all async
// i need to either make it sync, or rethink this
// now we are back to trying to code this async
// maybe a sendcommand function that tracks i, and calls each one on the success (or failure) of the last one


/** so this
send first command
- if i is undefined, then change dialog buttons to text that says command .... Executing
- on return, close dialog

- if i is defined, then:
- open status modal
- list commands .... Waiting
- first one gets set to .... Executing
- when first is done, on success, change [i]status to Done, increment i, change [i]status to Executing, and send next $http POST
**/


    var data = {
      command: command,
      converse: false,
      user: "user0121"
    };
    
    // Synchronous POST instead of $http async
    var xhr = new XMLHttpRequest();
    var url = "http://192.168.86.26:3001/assistant";
    xhr.open("POST", url, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    if (typeof $scope.commandsobject[i] !== "undefined") {
      $scope.commandsobject[i].status = "Done";
    }
    if (typeof $scope.commandsobject[i+1] !== "undefined") {
      $scope.commandsobject[i+1].status = "Executing";
    }
  };

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

  $scope.guess = function(item, event) {
    // Reads the item to determine what action to perform based on the type
    switch (item.type) {
      case 'page':
        gotoPage(item.destpagesid);
        break;
      case 'custom':
        $scope.dialogbutton = $scope[event.target.id];
        $mdDialog.show({
          targetEvent: event,
          locals: { parent: $scope },
          controller: angular.noop,
          controllerAs: 'dialogctrl',
          bindToController: true,
          templateUrl: 'status.html',
          clickOutsideToClose: false
        });
        
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

        i = 0;
        $scope.commandsobject[0].status = "Executing";
        $timeout(function () {
          angular.forEach(commands,function(command) {
            //$scope.commandsobject[i].status = "Executing";
            $scope.sendcommand(command, i);
            //$scope.commandsobject[i].status = "Done";
            i++;
          });
        }, 500);        
        // $mdDialog.hide();
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

}]);
