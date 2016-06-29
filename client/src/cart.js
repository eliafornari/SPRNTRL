var Cart = angular.module('myApp');

Cart.controller('cartCtrl', function($scope, $location, $rootScope, $stateParams, $timeout,	$http, transformRequestAsFormPost){

  $rootScope.Cart;
  $rootScope.showCart = false;

  $scope.openCart = function(){
    $rootScope.showCart = !$rootScope.showCart;

    $rootScope.updateCart();
  }



  $scope.$watch('Cart', function(newValue) {
      console.log(newValue);
      $rootScope.Cart = newValue;
  });


  $rootScope.updateCart = function(){
      $http({
        url: '/getCart',
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: transformRequestAsFormPost,
        data: {

              }
      }).then(function(response){
        $rootScope.Cart = response.data;

        console.log($rootScope.Cart);
        $rootScope.pageLoading = false;
        console.log(response);
      });
}//addToCart

});


Cart.directive('cartDirective', function($rootScope, $location, $window, $stateParams, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/cart.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
});
