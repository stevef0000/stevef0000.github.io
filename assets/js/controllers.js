function RecordCtrl ($scope, $http) {
        // Historical data
        $scope.history = [];
        // Default data (can be loaded from a database)
		$scope.records = [
			{ state: 'CA', price: 22, tax: 5, include: false },
			{ state: 'MA', price: 32, tax: 8, include: false }
		];
        // Total prices
		$scope.Totals = function () {
			var priceTotal = 0;
            var taxTotal = 0;
            // Loop through main records and calculate aggregate prices and taxes if include is true
			angular.forEach($scope.records, function (record) {
		        if (record.include) {
					priceTotal += record.price;
		            taxTotal += record.tax;
		        }
			});
            // Return aggregate data
            return { price: priceTotal , tax: taxTotal };
		};
        // Delete data
        $scope.Delete = function (index) {
            // Remove first / oldest element from history if it reaches maximum capacity of 10 records
            if ($scope.history.length === 10)
                $scope.history.shift();
            // Add deleted record to historical records
            $scope.history.push($scope.records[index]);
            // Remove from main records (using index)
            $scope.records.splice(index, 1);
        };
        // Reset new data model
        $scope.Reset = function () {
            $scope.newState = '';
            $scope.newPrice = 0;
            $scope.newTax = 0;
        }
        $scope.Reset();
        // Add new data
        $scope.Add = function () {
            // Do nothing if no state is entered (blank)
            if (!$scope.newState)
                return;
            // Add to main records
            $scope.records.push({
                state: $scope.newState,
                price: $scope.newPrice,
                tax: $scope.newTax,
                include: false
            });
            // See $Scope.Reset...
            $scope.Reset();
        }
        // Undo action (delete)
        $scope.Undo = function () {
            // Add last / most recent historical record to the main records
            $scope.records.push($scope.history[ $scope.history.length - 1 ]);
            // Remove last / most recent historical record
            $scope.history.pop();
        }
        /*
        $scope.languages = [        
            {name:"English", value:0},
            {name:"Spanish", value:1},
            {name:"German", value:3},
            {name:"Russian", value:2},
            {name:"Korean", value:1}
        ];
       */

        $http.get('assets/js/data.json')
            .then(function(res){
                $scope.languages = res.data;               
        });

        $scope.save = function() {
            /*$http.post('path/to/server/file/to/save/json', $scope.languages).then(function(data) {
              $scope.msg = 'Data saved';
            });*/
//https://content.dropboxapi.com/1/files_put/auto/<path>?param=val
           // $http.post('assets/js/data.json', $scope.languages).then(function(data) {
            
            $http.post('https://content.dropboxapi.com/1/files_put/auto/assets/js/data.json?param=$scope.languages').then(function(data) {
              $scope.msg = 'Data saved: ' + JSON.stringify($scope.languages);
            });
            //$scope.msg = 'Data sent: '+ JSON.stringify($scope.languages);
      };
	}