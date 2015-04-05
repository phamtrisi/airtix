(function(angular, _) {

  var app = angular.module('moneyApp', ['ui.router', 'angularMoment']);

  app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/__home.html',
        controller: 'MainCtrl',
        resolve: {
          transactions: function($http) {
            return $http({
              method: 'GET',
              url: 'data/transactions.json'
            });
          }
        }
      })
  });



  app.controller('MainCtrl', ['$scope', 'transactions', MainCtrl]);


  function MainCtrl($scope, transactions) {
    var now = new Date(),
        thisMonth = now.getMonth(),
        thisYear = now.getFullYear();

    $scope.transactions = _.filter(transactions.data, function(record) {
      var thisDate = new Date(record.date);
      return thisDate.getMonth() === thisMonth - 1 && thisDate.getFullYear() === thisYear;
    });

    $scope.summary = {
      sum: _.sum($scope.transactions, 'amount')
    };
  }

})(angular, _);
