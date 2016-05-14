angular
 .module('planetGulp', ['ngMaterial', 'ui.router', 'ngSails', 'hc.marked'])
 .config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $sailsProvider, markedProvider) {

 	  $sailsProvider.url = 'http://198.211.121.16:1337';

	  // Extend the red theme with a different color and make the contrast color black instead of white.
	  // For example: raised button text will be black instead of white.
	  var neonRedMap = $mdThemingProvider.extendPalette('red', {
	    '500': '#ff0000',
	    'contrastDefaultColor': 'dark'
	  });
	  // Register the new color palette map with the name <code>neonRed</code>
	  $mdThemingProvider.definePalette('neonRed', neonRedMap);
	  // Use that theme for the primary intentions
	  $mdThemingProvider.theme('default')
	    .primaryPalette('neonRed');

	  //
	  // For any unmatched url, redirect to /state1
	  $urlRouterProvider.otherwise("/");
	  //
	  // Now set up the states
	  $stateProvider
	    .state('/', {
	      url: "/",
	      templateUrl: "/templates/home.html",
	  	      controller: function($scope) {


	  	      	
  			  }
	    })
      .state('/category', {
        url: "/category/:id",
        templateUrl: "/templates/category.html",
            controller: function($scope, $stateParams, $sails, $state) {

              $scope.viewPage = function(page, mode) {

                $state.go('/page', {id: page.id, mode: mode});

              };

              (function () {

                $sails.get("/categories/" + $stateParams.id)
                  .success(function (category, status, headers, jwr) {
                    $scope.category = category;

                    $sails.get("/pages/find?category=" + $stateParams.id)
                      .success(function (pages, status, headers, jwr) {
                        $scope.category.pages = pages;

                        for (var i = $scope.category.pages.length - 1; i >= 0; i--) {
                          $scope.category.pages[i].updatedAt = moment($scope.category.pages[i].updatedAt).format('LLL');
                        };

                      })
                      .error(function (data, status, headers, jwr) {
                        alert('Houston, we got a problem!');
                      });

                  })
                  .error(function (data, status, headers, jwr) {
                    alert('Houston, we got a problem!');
                  });

              }());
              
          }
      })
      .state('/page', {
        url: "/page/:id?mode",
        templateUrl: "/templates/page.html",
            controller: function($scope, $stateParams, $sails, $http, $state) {

              $scope.getPageHeight = function() {

                return $("form").height() - 20;

              };

              $scope.pageHeight = $scope.getPageHeight();

              $scope.fabToolbarOpen = false;
              $scope.fabToolbarCount = 0;
              $scope.fabToolbarDirection = "";

              $scope.goBack = function(id) {

                $state.go('/category', {id: id});

              }

              $scope.pageMode = ($stateParams.mode !== "") ? $stateParams.mode: "view";

              (function () {

                $sails.get("/pages/" + $stateParams.id)
                  .success(function (page, status, headers, jwr) {
                    $scope.page = page;

                    $sails.get("/content/find?page=" + $stateParams.id)
                      .success(function (contents, status, headers, jwr) {
                        $scope.page.content = contents[0];
                      })
                      .error(function (data, status, headers, jwr) {
                        alert('Houston, we got a problem!');
                      });

                  })
                  .error(function (data, status, headers, jwr) {
                    alert('Houston, we got a problem!');
                  });

              }());


              $scope.updateContent = function(content, pageid) {

                content.page = pageid;

                var req = {
                 method: 'POST',
                 url: '/content/update',
                 data: { content }
                }

                $http(req)
                  .then(function() {

                    alert("done");

                  }, function() {

                  });


              }
              
          }
      });

      markedProvider.setOptions({
        gfm: true,
        tables: true,
        highlight: function (code, lang) {
          if (lang) {
            return hljs.highlight(lang, code, true).value;
          } else {
            return hljs.highlightAuto(code).value;
          }
        }
      });

 })
 .controller('MainController', ['$scope', '$mdSidenav', '$timeout', '$sails', '$state', function($scope, $mdSidenav, $timeout, $sails, $state) {

  function getPagesById(categoryId) {

    var tmp = [];

    for (var i = $scope.pages.length - 1; i >= 0; i--) {
      if($scope.pages[i].category == categoryId) {
        tmp.push($scope.pages[i]);
      }
    };

    return tmp;

  }

  function mergePages() {

    var tmp = $scope.categories;

    for (var i = tmp.length - 1; i >= 0; i--) {

      tmp[i].pages = getPagesById(tmp[i].id);

    };

    return tmp;

  }

  (function () {

    $sails.get("/categories")
      .success(function (categories, status, headers, jwr) {
        $scope.categories = categories;

        $sails.get("/pages")
          .success(function (pages, status, headers, jwr) {
            $scope.pages = pages;

            $scope.categories = mergePages();
          })
          .error(function (data, status, headers, jwr) {
            alert('Houston, we got a problem!');
          });

      })
      .error(function (data, status, headers, jwr) {
        alert('Houston, we got a problem!');
      });

  }());


    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    $scope.goTo = function(id) {

      $state.go('/page', {id: id})

    };

    $scope.toggleItem = function(dataKey, dataId) {

      $state.go('/category', {id: dataId});

    	if($scope.itemToggled !== dataKey) {
    		$scope.itemToggled = dataKey;
    	} else {
    		$scope.itemToggled = '';
    	}
		

    };

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle();
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle();
      }
    }

 }]); 