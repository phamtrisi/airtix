(function(angular) {
	var itemServices = angular.module('itemServices', []);
	
	itemServices.service('itemService', ['$http', itemService]);

	function itemService($http) {
		function add(newItem) {
      console.log(newItem);
			return $http({
				method: 'POST',
				url: '/api/items',
				data: newItem
			});
		}

    function getAll() {
      return $http({
        url: '/api/items'
      });
    }

		return {
			add: add,
      getAll: getAll
		};
	}

})(angular);