/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
myApp.factory('Authentication',
    ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location','FIREBASE_URL', 
    function($rootScope,$firebaseAuth,$firebaseObject,$location, FIREBASE_URL) {
    
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    
    $rootScope.selectedUnit = "Gambia";
    
    auth.$onAuth(function(authUser) {
        if (authUser) {
            var userRef = new Firebase(FIREBASE_URL+'users/'+authUser.uid);
            userRef.update({
                lastLoggedIn: Firebase.ServerValue.TIMESTAMP
            });
            var userObj = $firebaseObject(userRef);
            $rootScope.currentUser = userObj;
        } else {
            $rootScope.currentUser = '';
            //window.alert('Your session has expired. You will need to log in again');
            $rootScope.$apply(function() { $location.path("/login"); });
        }
    });
    
    var myObject = {
        login : function(user) {
            auth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function(regUser) {
                $location.path('/cadets');
                $rootScope.message = '';
            }).catch(function(error){
                $rootScope.message = error.message;
            });
            
        },
        
        logout: function() {
            return auth.$unauth();
        },
        
        requireAuth: function() {
            return auth.$requireAuth();
        },
        
        register: function(user) {
                $scope.message = "Triggered";
                auth.$createUser({
                    email: user.email,
                    password: user.password
                }).then(function(regUser){
                    $scope.message = "user created";
                    var regRef = new Firebase(FIREBASE_URL + 'users')
                        .child(regUser.uid).set({
                            creationDate: Firebase.ServerValue.TIMESTAMP,
                            regUser: regUser.uid,
                            firstName: user.firstname,
                            lastName: user.lastname,
                            email: user.email,
                            unit: user.unit
                        });
    //                myObject.login(user);
                    $rootScope.message = "Successfully registered "+user.email;
                }).catch(function(error){
                    $rootScope.message = error.message;
                });
            }       
    };
    
    return myObject;
}]);

