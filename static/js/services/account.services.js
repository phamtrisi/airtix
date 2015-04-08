(function(angular) {
	var accountServices = angular.module('accountServices', []);
	
	accountServices.service('accounts', ['$http', accounts]);

	function accounts($http) {
		function add(newAccount) {
			return $http({
				method: 'POST',
				url: '/api/account/add',
				data: newAccount
			});
		}

		function getInstitutions() {
      console.log('Getting inst');
      return $http({
        method: 'GET',
        url: '/data/institutions.json'
      });
    }

		return {
			add: add,
			getInstitutions: getInstitutions
		};
	}

})(angular);