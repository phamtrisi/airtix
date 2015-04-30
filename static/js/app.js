(function(angular, _) {

  var app = angular.module('airtix', [
        'ui.router', 
        'angularMoment'
      ]);

  app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/__home.html',
        controller: 'HomeCtrl',
        resolve: {
          priceWatches: function($http) {
            return $http({
              url: '/api/price_watches'
            });
          }
        }
      });
  });



  app.controller('HomeCtrl', ['$scope', 'priceWatches', HomeCtrl]);


  function HomeCtrl($scope, priceWatches) {
    $scope.priceWatches = _.map(priceWatches.data, function(priceWatch) {
      var priceLogs = _.filter(priceWatch.PriceLogs, function(priceLog) {
        if (!priceLog.lowest_business_price || 
            !priceLog.lowest_anytime_price || 
            !priceLog.lowest_get_away_price) {
          return false;
        }

        return true;
      });
      if (priceLogs.length) {
        priceWatch.lastPriceLog = priceLogs[priceLogs.length - 1];
        // Get the min and max of each price type
        priceWatch = _.assign({}, priceWatch, {
          businessPrices: {
            min: _.min(priceLogs, 'lowest_business_price').lowest_business_price,
            max: _.max(priceLogs, 'lowest_business_price').lowest_business_price,
            avg: _.sum(priceLogs, 'lowest_business_price')/priceLogs.length
          },
          anytimePrices: {
            min: _.min(priceLogs, 'lowest_anytime_price').lowest_anytime_price,
            max: _.max(priceLogs, 'lowest_anytime_price').lowest_anytime_price,
            avg: _.sum(priceLogs, 'lowest_anytime_price')/priceLogs.length
          },
          getAwayPrices: {
            min: _.min(priceLogs, 'lowest_get_away_price').lowest_get_away_price,
            max: _.max(priceLogs, 'lowest_get_away_price').lowest_get_away_price,
            avg: _.sum(priceLogs, 'lowest_get_away_price')/priceLogs.length
          }
        });
      }
      return priceWatch;
    });

    console.log($scope.priceWatches);
  }

})(angular, _);
