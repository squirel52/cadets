/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

myApp.controller('RegistrationController',['$scope', 'Authentication', 
    function($scope,Authentication) {
    
    $scope.Units = [
        {name: "Gambia"},
        {name: "Leander"},
        {name: "Archilles"}
    ];
    
    $scope.login = function() {
        Authentication.login($scope.user);
    };
    
    $scope.logout = function() {
        Authentication.logout();
    };
    
    $scope.register = function() {
        Authentication.register($scope.user);
    };
}]);
 