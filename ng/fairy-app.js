var $fairyApp = angular.module('fairyApp', ['ngRoute', 'firebase']);

// Routing
// ----------------------------------------

//This configures the routes and associates each route with a view and a controller
$fairyApp.config(function ($routeProvider) {
    $routeProvider
        .when('/vouchers',
            {
                controller: 'vouchersController',
                templateUrl: '/ng/templates/vouchers.html'
            })
        .otherwise({ redirectTo: '/vouchers' });
});

// Controllers
// ----------------------------------------


$fairyApp.controller("vouchersController", ["$scope", "$firebase", 
    function($scope, $firebase) {
        
        $scope.doneLoading = function(){
            console.log('bajskorv');
            $("table.responsive").table();
            $("#purchases ").show();
            $("#revenues").show();
        };
        
        var ref = new Firebase("https://scorching-fire-7581.firebaseIO.com/");
        ref.child('partners').once('value', function(partnersSnap) {
            $scope.partners = $firebase(partnersSnap.ref());
            ref.child('vouchers').once('value', function(vouchersSnap) {
                $scope.vouchers = $firebase(vouchersSnap.ref());
                $scope.doneLoading();
            });
        });
        
        $scope.openAddPurchaseModal = function(e) {
            $('#add-purchase-modal').modal('show');
        }
    }
]);

$fairyApp.controller("testController", ["$scope", "$firebase", 
    function($scope, $firebase) {
        var ref = new Firebase("https://scorching-fire-7581.firebaseIO.com/");
        $scope.comments = $firebase(ref);
        $scope.username = 'Guest' + Math.floor(Math.random() * 101);
        
        $scope.addComment = function(e) {
            if(e.keyCode != 13) {
                return;
            }
            
            $scope.comments.$add({
                from: $scope.username,
                body: $scope.newComment
            });
            
            $scope.newComment = "";
            e.preventDefault();
        }
    }
]);