(function(angular) {
  var addAccountComp = angular.module('addAccountComp', [
    'accountServices'
  ]);

  addAccountComp.directive('addAccountForm', ['accounts', addAccountForm]);

  function addAccountForm(accounts) {
    function Link($scope, $element, $attrs) {

    }

    function Controller($scope, $element, $attrs) {
      // Get the list of supported institutions
      // TODO spham HIGH: refactor this to actually use the Plaid API
      function getInstitutions() {
        accounts.getInstitutions().then(function success(res) {
          $scope.institutions = res.data;
          console.log($scope.institutions);
        }, function error(err) {
          console.log(err);
        });
      }


      // INIT
      (function init() {
        $scope.newAccount = {};

        $scope.addAccount = function(newAccount) {
          accounts.add(newAccount).then(
            function success(res) {
            	console.log(res);
            },
            function fail() {

            }
          );
        };

        getInstitutions();
      })();

    }

    return {
      restrict: 'AE',
      scope: {},
      controller: Controller,
      link: Link,
      templateUrl: '/js/components/addAccountComp/addAccountComp.html'
    };
  };

})(angular);
