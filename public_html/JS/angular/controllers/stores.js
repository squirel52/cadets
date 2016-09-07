/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


myApp.controller('storesController', ['$scope','$firebaseArray','$firebaseObject', '$firebaseAuth','FIREBASE_URL',
    function($scope,$firebaseArray,$firebaseObject,$firebaseAuth,FIREBASE_URL){
    
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    
    console.log(auth);
    //$scope.whichCadet = $routeParams.cId;
    auth.$onAuth(function(authUser) {
        if (authUser) {
            var storesRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems');
            var storesArray = $firebaseArray(storesRef);
            $scope.storeItems = storesArray;
            //storesArray.$bindTo($scope,"storeItems");
            
            $scope.addItem = function(){
                console.log("triggered");
                $scope.storeItems.$add({
                    name : $scope.newItem,
                    for: $scope.for
                });
                
                $scope.newItem ="";
            };
            
            $scope.addSize = function(item, size) {
                console.log("Size function");
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/sizes');
                var newSize = itemRef.push();
                newSize.set({'size':size, 'onLoan':0, 'total':0});
                item.newSize = false;
            };
            
            $scope.changeItemValue = function(item,property,newValue){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(total){
                    return newValue;
                });
            };
            
            $scope.increaseItemValue = function(item,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(total){
                    return total+1;
                });
            };
            
            $scope.decreaseItemValue = function(item,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(total){
                    return total-1;
                });
            };
            
            $scope.changeSizeValue = function(item,size,property,newValue){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/total');
//                var itemObj = $firebaseObject(itemRef);
                var sizeRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/sizes/'+size.$id);
                var sizeObj = $firebaseObject(sizeRef);
//                var oldValue = sizeObj.$value === 'NaN' ? 0 : sizeObj.$value;
//                console.log("changeSize");
//                console.log(itemObj);
//                console.log(oldVal);
                sizeObj.$value = newValue;
                sizeObj.$save;
//                itemRef.transaction(function(total){
//                    return total+(newValue - oldValue);
//                });
            };
            
            $scope.increaseSizeValue = function(item,size,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/'+property);
                var sizeRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/sizes/'+size.$id+'/'+property);
                sizeRef.transaction(function(total){
                    return total+1;
                });
                itemRef.transaction(function(total){
                    return total+1;
                });
            };
            
            $scope.decreaseSizeValue = function(item,size,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/'+property);
                var sizeRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.$id+'/sizes/'+size.$id+'/'+property);
                sizeRef.transaction(function(total){
                    return total-1;
                });
                itemRef.transaction(function(total){
                    return total-1;
                });
            };
            
        };
    });
}]);