(function(angular) {

  var app = angular.module('airtix', [
        'ui.router', 
        'firebase'
      ]);

  app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'partials/__home.html',
        controller: 'HomeCtrl'
      });
  });



  app.controller('HomeCtrl', ['$scope', '$http', '$firebaseObject', '$firebaseArray', HomeCtrl]);

  function HomeCtrl($scope, $http, $firebaseObject, $firebaseArray) {
    var subscribersRef = new Firebase("https://airwatch.firebaseio.com/subscribers");
    // download the data into a local object
    $scope.subscribers = $firebaseArray(subscribersRef);

    $scope.subscribe = function(email) {
      if (!email) return;
        
      $scope.subscribers.$add({
        email: email
      });

      $scope.email = '';
      $scope.added = true;
    };
  }

})(angular);
