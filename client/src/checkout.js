var Checkout = angular.module('myApp');

Checkout.controller('checkoutCtrl', function($scope, $location, $rootScope, $stateParams, $timeout,	$http, transformRequestAsFormPost){
  $rootScope.thankYou, $rootScope.checkout;
  $rootScope.isGradient = true;

  $rootScope.checkout = {
                          id: '',
                          number:       '4242424242424242',
                          expiry_month: '02',
                          expiry_year:  '2017',
                          cvv:  '756'
                        };




  $rootScope.cartToOrder = function(thisGateway){
        $http({
          url: '/cartToOrder',
          method: 'POST',
          headers: {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: transformRequestAsFormPost,
          data: {
                  gateway: thisGateway
                }
        }).then(function(response){

          console.log();

          $rootScope.checkout.id = response.data.id;
          $rootScope.pageLoading = false;
          console.log(response);
        });
  }//cartToOrder



  $rootScope.cartToOrder('stripe');





  $rootScope.orderToPayment = function(){


        $http({
          url: '/orderToPayment',
          method: 'POST',
          headers: {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: transformRequestAsFormPost,
          data: $rootScope.checkout
        }).then(function(response){

          $rootScope.thankYou = response.data;
          $rootScope.pageLoading = false;
          console.log(response);
        });
  }//cartToOrder






});
