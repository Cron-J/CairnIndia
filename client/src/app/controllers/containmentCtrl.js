app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl',
    function($scope, $location, $http, AuthServ, growl) {

        $scope.editPipelineData = function(pipedata) {

            $scope.pipeinfo = pipedata;

        }

        $scope.pipedataeditpage = function() {
            $location.path('/edit-pipeline-data');
        }

        $scope.newpipedata = function(newpipedata) {
        	$scope.newpipeinfo = newpipedata;
        	console.log($scope.newpipeinfo);
        }

    }
]);
