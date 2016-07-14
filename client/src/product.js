

var Product = angular.module('myApp');

Product.controller('productCtrl', [ '$scope','$location', '$rootScope', '$http','transformRequestAsFormPost', function($scope, $location, $rootScope, $http, transformRequestAsFormPost){

  $rootScope.Product = [];
  $rootScope.isGradient = true;
  $rootScope.selectedVariation=false;


  $http({method: 'GET', url: '/getProducts'}).then(function(response){
    console.log(response);
    $rootScope.Product = response.data;
    $rootScope.pageLoading = false;
  }).then(function(){
    console.log("an error occurred");
  })




  $rootScope.thisProduct = function(id){
    console.log(id);
    // $location.path("/products/"+id, false);
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
















//......VARIATIONS

  $rootScope.addVariation = function(id, modifier, variation){
    if($rootScope.selectedVariation){
      $http({
        url: '/addVariation',
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: transformRequestAsFormPost,
        data: $rootScope.selectedVariation
      }).then(function(response){
        // $rootScope.Cart = response;
        $rootScope.updateCart();
        $rootScope.pageLoading = false;
        console.log(response);
      });
    }else{
      $scope.variationErrorMessage = "select a size first"
      setTimeout(function(){
        $scope.variationErrorMessage = false;
        $rootScope.$apply();
      });
    }


  }//addToCart


$scope.isSelectionOpen=true;
$rootScope.showAllSelection = function(){
  $scope.isSelectionOpen = !$scope.isSelectionOpen;
}



  $rootScope.thisVariation = function(id, modifier_id, variation_id, title){
    $rootScope.selectedVariation = {
        id: id,
        modifier_id: modifier_id,
        variation_id: variation_id
      }
      $scope.selected=title;
  }

}]);




Product.controller('detailCtrl', function($rootScope, $scope, $location, $routeParams, $route){


  $rootScope.Detail={};

  $rootScope.detailUpdate = (id) => {

    for (var i in $rootScope.Product){
      if ($rootScope.Product[i].sku == id){
        $rootScope.Product[i].sku
        $rootScope.Detail=$rootScope.Product[i];
        $rootScope.Detail.has_variation = $rootScope.has_variation;


        //has variation
        for (i in $rootScope.Detail.modifiers){
          // if($rootScope.Detail.modifiers[i].id){$rootScope.has_variation=true;}else{$rootScope.has_variation=false;}
          $rootScope.Detail.has_variation = true;
          console.log($rootScope.Detail);
          return false;
        }
        //does not have variation
        $rootScope.Detail.has_variation = false;
        console.log($rootScope.Detail);


      }
    }


  }



});
