var Checkout = angular.module('myApp');

Checkout.controller('checkoutCtrl', function($scope, $location, $rootScope, $stateParams, $timeout,	$http, transformRequestAsFormPost){
  $rootScope.thankYou, $rootScope.payment;
  $rootScope.isGradient = true;

  $rootScope.customer, $rootScope.shipment, $rootScope.billing, $rootScope.Totals;

  $rootScope.payment = {
                          id: '',
                          number: '5555555555554444',
                          expiry_month: '02',
                          expiry_year:  '2018',
                          cvv:  '756'
                        };

$rootScope.checkout={
          shipment:
                   { first_name: 'Elia Fornari',
                     last_name: 'Fornari',
                     address_1: '400 S. Burnside #MH Tower 37-00H',
                     city: 'Los Angeles',
                     county: 'California',
                     country: 'US',
                     postcode: '90036',
                     phone: '3157273461'
                   },
          billing:
                  {
                     first_name: 'Elia Fornari',
                     last_name: 'Fornari',
                     address_1: '400 S. Burnside #MH Tower 37-00H',
                     city: 'Los Angeles',
                     county: 'California',
                     country: 'US',
                     postcode: '90036',
                     phone: '3157273461'
                   }
   };


  $rootScope.shipmentToPayment = function(){
    console.log($rootScope.checkout);
    $rootScope.template = $rootScope.templates[2];

    $http.post('/cartToOrder', $rootScope.checkout)
    .then(function(data) {

      $rootScope.Totals=data.data;
      console.log($rootScope.Totals);
          console.log("posted successfully");
      }, function(data) {
          console.error("error in posting");
      })
        // $http({
        //   url: '/cartToOrder',
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/JSON'
        //   },
        //   transformRequest: transformRequestAsFormPost,
        //   data: {
        //     $rootScope.checkout.shipment,
        //     $rootScope.checkout.shipment
        //   }
        //
        //
        //
        //
        // }).then(function(response){
        //   $rootScope.checkout.id = response.data.id;
        //   $rootScope.pageLoading = false;
        //   console.log(response);
        // });
  }//cartToOrder






  $rootScope.paymentToProcess = function(){
    $rootScope.cartLoading = true;
    $rootScope.thankYou = false;
    $rootScope.errorMessage = false;
    $rootScope.template = $rootScope.templates[4];

    console.log("payment started");

        $http({
          url: '/orderToPayment',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: transformRequestAsFormPost,
          data: $rootScope.payment
        }).then( function(response){

            console.log("payment succeeded");

            if(response.data.paid){
              $rootScope.cartLoading = false;

              $rootScope.paymentProcessed = true;
              $rootScope.thankYou = response;
              console.log($rootScope.thankYou);

            }


        }, function(response){
          console.log("payment failed!");
          console.log(response);
          $rootScope.paymentProcessed = true;
          $rootScope.errorMessage = response.data;
          $rootScope.cartLoading = false;
        })
  }//cartToOrder



  $rootScope.backFromPayment = function(){
    $rootScope.paymentProcessed = false;
    $rootScope.errorMessage = false;
    $rootScope.thankYou = false;
    $rootScope.cartLoading = false;
  }


  $rootScope.backFromCheckout = function(){
    console.log($rootScope.templates[0]);
    $rootScope.template = $rootScope.templates[0];
    $rootScope.showCart=true;
    $rootScope.backFromPayment();
  }






});
