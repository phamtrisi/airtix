(function(angular) {
  var addItemComp = angular.module('addItemComp', ['itemServices']);

  addItemComp.directive('addItemForm', ['itemService', addItemForm]);

  function addItemForm(itemService) {
    function Link($scope, $element, $attrs) {

    }

    function Controller($scope, $element, $attrs) {
      $scope.addItem = function(newItem) {
        itemService.add(newItem).then(function success(res) {
          console.log('Item added!');
          $scope.newItem = {};
        });  
      };
      // INIT
      (function init() {
        $scope.newItem = {};
      })();

    }

    return {
      restrict: 'AE',
      scope: {},
      controller: Controller,
      link: Link,
      templateUrl: '/js/components/addItemComp/addItemComp.html'
    };
  };

})(angular);
