app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams','getGasOilRatio',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams,getGasOilRatio) {
        $scope.pipe = {};
        $scope.createPipeline = function(data) {
            $location.path('/create-pipeline');
        }
        $scope.selectedItem = {};
        var getalldata = function() {
            $http.get('/getPipeline')
                .success(function(data, status) {
                    $scope.getpipedata = data;
                });
            $scope.pipe = singlePipeData.get();
            $scope.selectedItem.pipeName = $scope.pipe._id;
            if ($location.$$path == '/create-pipeline') {
                $scope.pipe = {};
            }
        }
        $scope.getGasOilRatio = getGasOilRatio;
        getalldata();

        $scope.update = function() {
            if ($scope.pipe.toCity == 'undefined' || $scope.pipe.toCity == '')
                $scope.pipe.pipeName = '';
            else
                $scope.pipe.pipeName = $scope.pipe.fromCity + ' to ' + $scope.pipe.toCity;
        }

        $scope.changeSize = function(size) {
            if (size == 'inch') {
                $scope.pipe.pipeHeight = $scope.pipe.pipeHeight / 2.54;

            } else {
                $scope.pipe.pipeHeight = $scope.pipe.pipeHeight * 2.54;
            }
        }

        $scope.newpipedata = function(pipedata) {
            $http.post('/createPipeline', pipedata)
                .success(function(data, status) {
                    if ($rootScope.user.scope == "Admin") {
                        growl.addSuccessMessage('Pipe created Successfully');
                        $scope.pipe = {};
                        $location.path('/containment');
                    }
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                });

        }

        $scope.getPipeDataEditPage = function(pipe) {
            if (pipe.pipeName !== null) {
                var id = pipe.pipeName ? pipe.pipeName : pipe;
                $http.get('/getPipeLinebyId/' + id)
                    .success(function(data, status) {
                        $scope.pipe = data;
                        // singlePipeData.set($scope.pipe);
                    })
                    .error(function(data, status) {
                        $scope.pipe = {};
                    });
            } else {
                $scope.pipe = {};
            }

        }

        if ($stateParams.id || $location.path == '/containment') {
            $scope.getPipeDataEditPage($stateParams.id);
        }


        $scope.getEditData = function(data) {
            $location.path('/edit-pipeline-data/' + data._id);
        }

        $scope.goBack = function(data) {
            $location.path('/containment');
            singlePipeData.set(data);
        }

        $scope.savePipeData = function(savedpipedata) {

            $http.put('/updatePipeline/' + savedpipedata._id, savedpipedata)
                .success(function(data, status) {
                    if ($rootScope.user.scope == "Admin") {
                        $location.path('/containment');
                        growl.addSuccessMessage('Pipe updated Successfully');
                        singlePipeData.set(data);
                    }
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                });
        }

        $scope.deletePipeData = function(removePipeData, index) {
            console.log('======', $scope.getpipedata.indexOf($scope.getpipedata));
            if (removePipeData !== null) {
                $http.delete('/removePipeline/' + removePipeData._id)
                    .success(function(data, status) {
                        if ($rootScope.user.scope == "Admin") {
                            // var indexVal = $scope.getpipedata.indexOf($scope.getpipedata);
                            $scope.getpipedata.splice(index, 1);
                            growl.addSuccessMessage('Pipe deleted Successfully');

                        }
                    })
                    .error(function(data, status) {
                        growl.addErrorMessage(data.message);
                    });

            }
        }


        $scope.clearform = function() {
            $scope.area = {};
        }

        $scope.clearforminclination = function() {
            $scope.area = {};
            $scope.area.inclination = 0;
        }

        //Rupture shape and area 

        $scope.shapes = ['Rectangular', 'Triangular', 'Square', 'Circular'];
        $scope.result = false;
        $scope.area = {};
        $scope.area.inclination = 0;


        $scope.calcVolume = function(area, shape, olddata) {
            $scope.loading = true;
            var areaprops = {
                density: $scope.pipe.density,
                pressure: $scope.pipe.pressure,
                viscosity: $scope.pipe.viscosity,
                length:$scope.pipe.length,
                area: area,
                shape: shape,
                olddata: olddata
            };
            $scope.result = true;
            $http.post('/calculatePipelinedata', areaprops)
                .success(function(data, status) {
                    $scope.barrels = data;
                    $scope.loading = false;
                    // $scope.area ={};
                })
                .error(function(data, status) {
                    console.log('data',data);
                    growl.addErrorMessage(data.message);
                });

        }
    }
]);
