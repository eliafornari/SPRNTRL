

var Product = angular.module('myApp');

Product.controller('productCtrl', [ '$scope','$location', '$rootScope', '$http','transformRequestAsFormPost', function($scope, $location, $rootScope, $http, transformRequestAsFormPost){

  $rootScope.Product = [];
  $rootScope.isGradient = true;

  // $rootScope.Product = productService.data;
  // console.log(productService.data);
  // $rootScope.pageLoading = false;

  $http({method: 'GET', url: '/getProducts'}).then(function(response){
    console.log(response);
    $rootScope.Product = response.data;
    $rootScope.pageLoading = false;
  }).then(function(){
    console.log("an error occurred");
  })




  $rootScope.thisProduct = function(id){
    console.log(id);
    $location.path("/products/"+id, false);
    $rootScope.detailUpdate(id);
  }




      $rootScope.addToCart = function(id){

        // var token = document.cookie;
        var token = $rootScope.readCookie("access_token");
        console.log(token);
          $http({
            url: '/addProduct',
            method: 'POST',
            headers: {
              // 'Content-Type': 'application/json'
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: transformRequestAsFormPost,
            data: {
                    id: id,
                    access_token:"helloooo"
                  }
          }).then(function(response){
            $rootScope.Cart = response;
            $rootScope.updateCart();
            $rootScope.pageLoading = false;
            console.log(response);
          });
    }//addToCart

}]);




Product.controller('detailCtrl', function($rootScope, $scope, $location, $routeParams, $route){


  $rootScope.Detail={};

  $rootScope.detailUpdate = (id) => {

    for (var i in $rootScope.Product){

      if ($rootScope.Product[i].sku == id){
        $rootScope.Product[i].sku
        $rootScope.Detail=$rootScope.Product[i];

      }
    }


  }



});
