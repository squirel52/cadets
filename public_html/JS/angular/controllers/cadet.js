myApp.controller('cadetController', ['$scope','$firebase','$firebaseObject','$firebaseArray','$firebaseAuth','filterFilter','$routeParams','FIREBASE_URL',
    function($scope,$firebase,$firebaseObject,$firebaseArray,$firebaseAuth,filterFilter,$routeParams,FIREBASE_URL){
    $scope.showKit = true;
    $scope.manageKit = false;
    $scope.whichCadet = $routeParams.cId;
    
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    // Get objects set up
    var cadetRef = new Firebase(FIREBASE_URL + $scope.selectedUnit + '/cadets/'+$scope.whichCadet);
    $scope.cadetInfo = $firebaseObject(cadetRef);    
    //var cadetStoreRef = new Firebase(FIREBASE_URL + $scope.selectedUnit + '/cadets/'+$scope.whichCadet + '/storeItems');
    $scope.cadetKit = $firebaseArray(cadetRef.child('storeItems'));    
    var storeRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems');
    var ranksRef = new Firebase(FIREBASE_URL + '/RO_DATA/Ranks');
    $scope.rankArray = $firebaseArray(ranksRef);
    //console.log($scope.rankArray);

//    $scope.cadetInfo.dateOfBirth = new Date();

    auth.$onAuth(function(authUser) {
        if (authUser) {
            $scope.addItems = function(){
                var storeArray = $firebaseArray(storeRef);
                storeArray.$loaded().then(function(){
                    angular.forEach(storeArray, function(entry){
                        if (filterFilter($scope.cadetKit,entry.$id).length === 0) {
                            $scope.cadetKit.$add({
                                name: entry.name,
                                quantity: 0,
                                uid: entry.$id
                            });
                        }
                    });
                });
            };
            
            $scope.changeItemValue = function(item,property,newValue){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/cadets/'+$scope.whichCadet +'/storeItems/'+item.$id+'/'+property);
                var oldValue;
                itemRef.on("value", function(snapshot) {
                    oldValue = snapshot.val();
                });
                // Change the stored value for the cadet
                itemRef.transaction(function(){
                    return newValue;
                });
                // Change the central quantity stored
                var itemCentralRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/onLoan');
                itemCentralRef.transaction(function(value){
                    return value+newValue-oldValue;
                });
            };
            
            $scope.increaseItemValue = function(item,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/cadets/'+$scope.whichCadet +'/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(value){
                    return value+1;
                });
                
                var itemCentralRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/onLoan');
                itemCentralRef.transaction(function(value){
                    return value+1;
                });
            };
            
            $scope.decreaseItemValue = function(item,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/cadets/'+$scope.whichCadet +'/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(value){
                    return value-1;
                });
                
                var itemCentralRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/onLoan');
                itemCentralRef.transaction(function(value){
                    return value-1;
                });
            };
            
            $scope.addItem = function(item,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/cadets/'+$scope.whichCadet +'/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(value){
                    return value+1;
                });
                
                var itemCentralLoanRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/onLoan');
                itemCentralLoanRef.transaction(function(value){
                    return value+1;
                });
                var itemCentralTotalRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/total');
                itemCentralTotalRef.transaction(function(value){
                    return value+1;
                });
            };
            
            $scope.removeItem = function(item,property){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/cadets/'+$scope.whichCadet +'/storeItems/'+item.$id+'/'+property);
                itemRef.transaction(function(value){
                    return value-1;
                });
                
                var itemCentralLoanRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/onLoan');
                itemCentralLoanRef.transaction(function(value){
                    return value-1;
                });
                var itemCentralTotalRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/storeItems/'+item.uid+'/total');
                itemCentralTotalRef.transaction(function(value){
                    return value-1;
                });
            };
            
            $scope.delete = function(item){
                var itemRef = new Firebase(FIREBASE_URL + '/'+ $scope.selectedUnit + '/cadets/'+$scope.whichCadet +'/storeItems/'+item.$id);
                if (itemRef.quantity === 0) {
                    itemRef.remove();
                } else {
                    
                }
                
            }
        };
    });

}])
.config(['$mdDateLocaleProvider',function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY-MM-DD');
  };
}]);