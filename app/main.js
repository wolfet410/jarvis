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
   
  $scope.sendcommand = function(command) {
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

        //var commands = item.customcommand.split(';');
        //angular.forEach(commands,function(command) {
//          $scope.progresspercent = (i / commands.length) * 100;
 //         $scope.command = command;
   //       $scope.sendcommand(command);
       // });
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
