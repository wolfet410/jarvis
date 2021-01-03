'use strict';

angular.module('myApp.basement', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/basement', {
    templateUrl: 'basement/basement.html',
    controller: 'BasementCtrl'
  });
}])

.controller('BasementCtrl', [function() {

}]);
