angular
 .module('planetGulp', ['ngMaterial', 'ui.router', 'ngSails'])
 .config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, $sailsProvider) {

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
	  $urlRouterProvider.otherwise("/plugins");
	  //
	  // Now set up the states
	  $stateProvider
	    .state('plugins', {
	      url: "/plugins",
	      templateUrl: "/templates/plugins.html",
	  	      controller: function($scope) {


	  	      	
  			  }
	    });

 })
 .controller('MainController', ['$scope', '$mdSidenav', '$timeout', '$sails', function($scope, $mdSidenav, $timeout, $sails) {

  (function () {

    $sails.get("/plugins")
      .success(function (data, status, headers, jwr) {
        $scope.plugins = data;
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

    $scope.goTo = function() {

    };

    $scope.toggleItem = function(dataKey) {

    	if($scope.itemToggled !== dataKey) {
    		$scope.itemToggled = dataKey;
    	} else {
    		$scope.itemToggled = '';
    	}
		

    };

    $scope.gulpData = {
    	Plugins: [
			'Compilation',
			'Transpilation',
			'Concatenation',
			'Minification',
			'Optimization',
			'Injecting Assets',
			'Templating',
			'Linting',
			'Live Reload',
			'Caching',
			'Flow Control',
			'Logging',
			'Testing',
			'Miscellaneous Plugins'
    	],
    	Resources: [
			'General Resources',
			'Official Documentation',
			'Community',
			'Tutorials'
    	],
    	Scaffolding: [
			'Boilerplates',
			'Yeoman Generators'
    	]
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