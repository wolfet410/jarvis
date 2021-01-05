'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'ngAria',
  'ngAnimate',
  'ngMessages',
  'ngMaterial',
  'myApp.main',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});
}]).
config(function ($mdThemingProvider) {
  $mdThemingProvider.definePalette('black', {
    '50': '000000',
    '100': '000000',
    '200': '000000',
    '300': '000000',
    '400': '000000',
    '500': '000000',
    '600': '000000',
    '700': '000000',
    '800': '000000',
    '900': '000000',
    'A100': '000000',
    'A200': '000000',
    'A400': '000000',
    'A700': '000000',
    'contrastDefaultColor': 'light'
  });
  
  $mdThemingProvider
    .theme('default')
    .primaryPalette('indigo')
    .accentPalette('cyan')
    .warnPalette('red')
    .backgroundPalette('black')
    .dark();
});
