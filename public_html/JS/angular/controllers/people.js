/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

myApp.controller('peopleController',['$scope', '$rootScope','$firebaseArray','$firebaseObject', '$firebaseAuth','FIREBASE_URL', 
    function($scope,$rootScope,$firebaseArray,$firebaseObject,$firebaseAuth,FIREBASE_URL){
        var ranksRef = new Firebase(FIREBASE_URL + '/RO_DATA/Ranks');
    $scope.rankArray = $firebaseArray(ranksRef);
    
    $rootScope.Ranks = [
        {name : "BCT"},
        {name : "OC"}
    ];       
    
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    
    auth.$onAuth(function(authUser) {
        if (authUser) {
            var cadetsRef = new Firebase(FIREBASE_URL + $scope.selectedUnit + '/cadets');
            var cadetsArray = $firebaseArray(cadetsRef);
            $scope.cadets = cadetsArray;
            
//            cadetsArray.$loaded().then(function() {
//                $scope.numOfCadets = cadetsArray.length; //This only updates when loaded, does not update dynamically.
//            });
            
            cadetsArray.$watch(function() {
                $scope.numOfCadets = cadetsArray.length; //This updates whenever the database changes
            });
            
            
            $scope.createNewCadet = function(newCadet){
                $scope.message = "Adding cadet to database.";
                cadetsArray.$add({
                    firstName : newCadet.firstName,
                    lastName : newCadet.lastName,
                    rank : newCadet.rank
                }).then( function() {
                    $scope.message = newCadet.firstName + " " + newCadet.lastName + " successfully added.";
                    $scope.newCadet ='';
                });
            };
            
            
            
        };
    });
}]);
