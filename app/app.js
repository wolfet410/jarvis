'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'ngAria',
  'ngAnimate',
  'ngMessages',
  'ngMaterial',
  'myApp.mainfloor',
  'myApp.basement',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/mainfloor'});
}]).
config(function ($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('indigo')
    .accentPalette('cyan')
    .warnPalette('red')
    .backgroundPalette('grey')
    .dark();
});
