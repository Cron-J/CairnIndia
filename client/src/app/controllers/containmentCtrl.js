app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams) {

        $scope.createPipeline = function() {
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
        }

        getalldata();


        $scope.newpipedata = function(pipedata) {
            $http.post('/createPipeline', pipedata)
                .success(function(data, status) {
                    if ($rootScope.user.scope == "Admin") {
                        growl.addSuccessMessage('Pipe created Successfully');
                        $scope.createpipe = {};
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
        
        $scope.selectedItem = 0;

        $scope.deletePipeData = function(removePipeData, index) {
            if (removePipeData !== null) {
                $http.delete('/removePipeline/' + removePipeData._id)
                    .success(function(data, status) {
                        if ($rootScope.user.scope == "Admin") {
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
            inchtoMeter = 0.0254;
            $scope.result = true;
            if (shape == "Rectangular") {
                res = area.length * inchtoMeter * inchtoMeter * area.breadth;
                spillVolume(res);

            } else
            if (shape == "Triangular") {
                s = (area.sidea + area.sideb + area.sidec) / 2;
                res = Math.sqrt(s * (s - area.sidea) * (s - area.sideb) * (s - area.sidec));
                spillVolume(res);

            } else
            if (shape == "Square") {
                res = area.length * inchtoMeter * inchtoMeter * area.length;
                spillVolume(res);
            } else
            if (shape == "Circular") {
                res = Math.PI * area.radius * inchtoMeter * inchtoMeter * area.radius;
                spillVolume(res);

            } else
            if (shape == "Sector") {
                res = (area.radius * inchtoMeter * area.angle * Math.PI) / 360;
                spillVolume(res);
            }


        }

        var spillVolume = function(area) {
            var pipeHeight = 10,
                velocity, pressure = 20;
            var GRAVITY = 9.8; //In meter/second square
            velocity = Math.sqrt(2 * GRAVITY * pipeHeight);
            $scope.spillVol = parseFloat(Math.round(area * velocity * 0.00838641436 * 3600 * 100) / 100).toFixed(2);
            $scope.spillLitres = $scope.spillVol * 1000 * 3600;
            $scope.barrels = parseFloat(Math.round($scope.spillLitres * 0.00838641436 * 3600 * 100) / 100).toFixed(2);
        }

    }
]);
