(function(angular) {
  var services = angular.module('moneyAppServices', []);

  services.service('moneyAppPlaid', ['$http', moneyAppPlaid]);

  function moneyAppPlaid($http) {
    var plaidPrefix = 'https://tartan.plaid.com';
    function getInstitutions() {
      console.log('Getting inst');
      return $http({
        method: 'GET',
        url: '/data/institutions.json'
      });
    }

    return {
      getInstitutions: getInstitutions
    };  
  };

})(angular);