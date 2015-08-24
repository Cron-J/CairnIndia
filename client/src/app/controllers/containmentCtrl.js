app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams) {
        var getalldata = function() {
            $http.get('/getPipeline')
                .success(function(data, status) {
                    $scope.getpipedata = data;
                    console.log(data)
                });
        }

        getalldata();

        $scope.newpipedata = function(pipedata) {
            $http.post('/createPipeline', pipedata)
                .success(function(data, status) {
                    if ($rootScope.user.scope == "Admin") {
                        growl.addSuccessMessage('Pipe created Successfully');
                    }
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                });

        }

        $scope.getPipeDataEditPage = function(id) {
            $http.get('/getPipeLinebyId/' + id)
                .success(function(data, status) {
                    $scope.pipe = data;
                    // singlePipeData.set($scope.pipe);
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                });

        }

        if ($stateParams.id || $location.path == '/containment') {
            $scope.getPipeDataEditPage($stateParams.id);
        }


        $scope.getEditData = function(data) {
            $location.path('/edit-pipeline-data/' + data._id);
        }

        $scope.goBack = function() {
            $location.path('/containment');
        }


        $scope.savePipeData = function(savedpipedata) {
            
            $http.put('/updatePipeline/' +savedpipedata._id,savedpipedata)
                .success(function(data, status) {
                    if ($rootScope.user.scope == "Admin") {
                        growl.addSuccessMessage('Pipe updated Successfully');
                        $location.path('/containment');
                    }
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                    console.log('======',savedpipedata._id);
                });

        }


    }
]);
