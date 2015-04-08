(function(angular, _) {

  var app = angular.module('moneyApp', ['ui.router', 'angularMoment', 'moneyAppServices']);

  app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/__home.html',
        controller: 'HomeCtrl',
        resolve: {}
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'partials/__dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
          transactions: function($http) {
            return $http({
              method: 'GET',
              url: '/api/transactions'
            });
          }
        }
      })
      .state('categories', {
        url: '/categories',
        templateUrl: 'partials/__categories.html',
        controller: 'CategoriesCtrl',
        resolve: {
          categories: function($http) {
            return $http({
              method: 'GET',
              url: '/api/categories'
            });
          }
        }
      });
  });



  app.controller('HomeCtrl', ['$scope', 'moneyAppPlaid', HomeCtrl]);
  app.controller('DashboardCtrl', ['$scope', 'transactions', DashboardCtrl]);
  app.controller('CategoriesCtrl', ['$scope', 'categories', CategoriesCtrl]);


  function CategoriesCtrl($scope, categories) {
    $scope.categories = categories.data;
  }

  function HomeCtrl($scope, moneyAppPlaid) {
    moneyAppPlaid.getInstitutions().then(function success(res) {
      $scope.institutions = res.data;
      console.log($scope.institutions);
    }, function error(err) {
      console.log(err);
    });
  }

  function DashboardCtrl($scope, transactions) {
    var now = new Date(),
        thisMonth = now.getMonth(),
        thisYear = now.getFullYear();

    $scope.transactions = transactions.data;

    // $scope.transactions = _.filter(transactions.data, function(record) {
    //   var thisDate = new Date(record.date);
    //   return thisDate.getMonth() === thisMonth - 1 && thisDate.getFullYear() === thisYear;
    // });

    // // Transform data
    // $scope.transactions = _.map($scope.transactions, function(record) {
    //   record.dayOfWeek = new Date(record.date).getDay();
    //   return record;
    // });

    console.log($scope.transactions);

    $scope.summary = {
      sum: _.sum($scope.transactions, 'amount')
    };
  }

})(angular, _);
