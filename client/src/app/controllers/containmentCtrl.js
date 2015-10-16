app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams) {
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

        getalldata();

        $scope.pipe.diameterSizeIn = "inch";

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

        //Rupture shape and area 

        $scope.shapes = ['Rectangular', 'Triangular', 'Square', 'Circular', 'Sector'];

        $scope.result = false;
        $scope.calcVolume = function(area, shape) {
             inchtometer = 0.0254;
            $scope.result = true;
            if (shape == "Rectangular") {

                res = parseFloat(area.length) * parseFloat(area.breadth);
                spillVolume(res * inchtometer * inchtometer);

            } else
            if (shape == "Triangular") {
                s = (parseFloat(area.sidea) + parseFloat(area.sideb) + parseFloat(area.sidec)) / 2;
                res = Math.sqrt(s * (s - parseFloat(area.sidea)) * (s - parseFloat(area.sideb)) * (s - parseFloat(area.sidec)));
                spillVolume(res * inchtometer * inchtometer);

            } else
            if (shape == "Square") {
                res = parseFloat(area.length) * inchtometer * inchtometer * parseFloat(area.length);
                spillVolume(res);
            } else
            if (shape == "Circular") {
                res = Math.PI * parseFloat(area.radius) * parseFloat(area.radius);
                spillVolume(res * inchtometer * inchtometer);

            } else
            if (shape == "Sector") {
                res = (parseFloat(area.radius) * Math.PI) / 360;
                spillVolume(res * inchtometer * inchtometer);
            }

        }

        var spillVolume = function(area) {
            var velocity, rho=2.5, pressure = $scope.pipe.pressure;
            // var GRAVITY = 9.8; //In meter/second square
            // if (height >= $scope.pipe.diameter) {
            //     $scope.barrels = 0;
            // } else {
                // velocity = Math.sqrt(2 * GRAVITY * height*inchtometer);
                velocity= Math.sqrt((2*pressure)/rho);
                $scope.barrels = parseFloat(Math.round(area * velocity * 1000 * 0.0062898 * 3600 * 100) / 100).toFixed(2);
            // }           
        }

    }
]);
