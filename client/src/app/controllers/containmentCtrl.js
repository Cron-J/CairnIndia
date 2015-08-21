app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl','$rootScope',
    function($scope, $location, $http, AuthServ, growl,$rootScope) {

        $scope.editPipelineData = function(pipedata) {

            $scope.pipeinfo = pipedata;

        }

        $scope.pipedataeditpage = function() {
            $location.path('/edit-pipeline-data');
        }

        $scope.newpipedata = function(newpipedata) {
            $http.post('/createPipeline', newpipedata)
                .success(function (data, status) {
                    if($rootScope.user.scope == "Admin") {
                        growl.addSuccessMessage('Pipe created Successfully');
                    }
                        
                })
                .error(function (data, status) {
                    growl.addErrorMessage(data.message);
                });
        
        }

    }
]);

