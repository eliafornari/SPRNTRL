import jQuery from "jquery";
import angular from 'angular'
import 'angular-route'
import 'angular-ui-router'



angular.module('myApp', ["ui.router", "ngRoute"])
.run(['$rootScope', '$location','$route',($rootScope, $location, $route)=>{



    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        else if (reload === true){

          var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);

        var un = $rootScope.$on('$locationChangeSuccess', function () {
              $route.current = 'worldoftheblonds/'+$routeParams.category+'/'+$routeParams.event;
              un();
              $route.reload();
          });
        }
        return original.apply($location, [path]);
    };

}])

.service('anchorSmoothScroll', function(){

    this.scrollTo = function(eID) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };

})


.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
  $routeProvider

    .when('/charity', {
      templateUrl: 'views/home.html',
      controller: 'appCtrl'
    })

    .when('/products/:detail', {
      templateUrl: 'views/home.html',
      controller: 'detailCtrl'
    })

    .when('/products', {
      templateUrl: 'views/home.html',
      controller: 'appCtrl'
    })


    .when('/privacy', {
      templateUrl: 'privacy/privacy.html',
      controller: 'privacyCtrl'
    })

    /*............................. Take-all routing ........................*/


    .when('/', {
      // redirectTo: 'matthew30matthew30matthew'
      templateUrl: 'views/home.html',
      controller: 'appCtrl',
      resolve: {
             function($q, $timeout) {
                var deferred = $q.defer();
                $timeout(function(){
                    return deferred.resolve();
                }, 200);
                return deferred.promise;
            }
        }

    })


    // put your least specific route at the bottom
    .otherwise({redirectTo: '/'})



}]) //config


.filter('trustUrl', function ($sce) {
  return function(url) {
    // if (url){
      var trusted = $sce.trustAsResourceUrl(url);
      return trusted;
    // }
  };
})

.controller('appCtrl', ($rootScope, $location, $window, $timeout, $http, anchorSmoothScroll, $scope)=>{

  $rootScope.token;


  $rootScope.noRefresh = function(url){
    var str = url;
    str = str.substring(1, str.length);
        if ($location.path() !== url) {
          anchorSmoothScroll.scrollTo(str);
          $location.path(url, false);
        } else {
          $anchorScroll();
        }
  }


  function eraseCookie(name) {
    $rootScope.createCookie(name,"",-1);
  }

  function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
      eraseCookie(cookies[i].split("=")[0]);
}

// deleteAllCookies();
$rootScope.createCookie = function(name,value,time) {
	var expires = "; expires="+time;
	document.cookie = name+"="+value+expires+";";
}

$rootScope.readCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0){
        return c.substring(nameEQ.length,c.length);
      }
	}
	// return null;
}




  $rootScope.authentication = function(){

        // Simple GET request example:
        $http({
          method: 'GET',
          url: '/authenticate'
        }).then(function successCallback(response) {

          if(response.data.access_token){
              console.log("response");
              console.log(response);
              // this callback will be called asynchronously
              // when the response is available
              var expires = response.data.expires;
              var identifier = response.data.identifier;
              var expires_in = response.data.expires_in;
              var access_token = response.data.access_token;
              var type = response.data.token_type;

              $rootScope.createCookie( "access_token", response.data.access_token , response.data.expires_in);
              setTimeout(function(){
                console.log(document.cookie);
              },900);
          }

          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

  }//addToCart

  $rootScope.authentication();





$rootScope.windowHeight= $window.innerHeight;
  jQuery($window).resize(function(){
    $rootScope.windowHeight = $window.innerHeight;
    // $rootScope.checkSize();
      $scope.$apply();
  });



$rootScope.logoCorner=false;
$rootScope.showDetail=false;
//remove logo on scroll
angular.element($window).bind("scroll", function() {
 var scroll=this.pageYOffset ;

console.log('$rootScope.windowHeight: '+$rootScope.windowHeight);
 console.log('$rootScope.windowHeight*2: '+$rootScope.windowHeight*2);
console.log(scroll);

  if (scroll < ($rootScope.windowHeight/2)){
    $rootScope.logoCorner=false;
    $rootScope.showDetail=false;
    console.log(false);
  }else if(scroll < ($rootScope.windowHeight/2)) && (scroll <= ($rootScope.windowHeight*2))){
    $rootScope.logoCorner=true;
    $rootScope.showDetail=true;
    console.log(true);

  }else{
    $rootScope.logoCorner=false;
    console.log(false);
  }
  $scope.$apply();

})






})





.directive('productDirective', function($rootScope, $location, $window, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/products.html',
    controller: 'productCtrl',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('charityDirective', function($rootScope, $location, $window, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/charity.html',
    controller: 'charityCtrl',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('productDetail', function($rootScope, $location, $window, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/product-detail.html',
    controller: 'detailCtrl',
    replace: true,
    link: function(scope, elem, attrs) {
    }
  };
})


.directive('logoDirective', function($rootScope, $location, $window, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/components/logo.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('navDirective', function($rootScope, $location, $window, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/components/nav.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
});






var service = require("./service.js");
var product = require("./product.js");
var cart = require("./cart.js");
var cart = require("./checkout.js");
var cart = require("./charity.js");
