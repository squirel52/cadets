/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myApp = angular.module('nzcfdb',['ngRoute', 'firebase','ngMaterial'])
    .constant('FIREBASE_URL','###########');

myApp.run(['$rootScope','$location', function($rootScope,$location){
    $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
        if (error==='AUTH_REQUIRED') {
            $rootScope.message = 'Sorry, you must log in to access this resource';
            $location.path('/login');
        }
    });    
}]);

myApp.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'RegistrationController'
        }).
        when('/register',{
            templateUrl: 'views/register.html',
            controller: 'RegistrationController',
            resolve: {
                currentAuth: function(Authentication){
                    return Authentication.requireAuth();
                }
            }
        }).
        when('/cadets',{
            templateUrl: 'views/cadets.html',
            controller: 'peopleController',
            resolve: {
                currentAuth: function(Authentication){
                    return Authentication.requireAuth();
                }
            }
        }).
        when('/cadet/:cId',{
            templateUrl: 'views/cadet.html',
            controller: 'cadetController',
            resolve: {
                currentAuth: function(Authentication){
                    return Authentication.requireAuth();
                }
            }
        }).
        when('/stores',{
            templateUrl: 'views/stores.html',
            controller: 'storesController',
            resolve: {
                currentAuth: function(Authentication){
                    return Authentication.requireAuth();
                }
            }
        }).
        otherwise({
            redirectTo: '/cadets'
        });
        
//    $mdDateLocaleProvider.formatDate = function(date) {
//    return moment(date).format('DD-MM-YYYY');
//  };
}]);

myApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});