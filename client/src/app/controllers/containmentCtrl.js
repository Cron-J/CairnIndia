app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams', 'getGasOilRatio','$localStorage',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams, getGasOilRatio,$localStorage) {
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
        $scope.gotoCalculation =function(data){
            $location.path('/oilcalculation');
            // singlePipeData.set(data);
           $localStorage.message = data;
        }
        $scope.pipe =$localStorage.message;

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
            $scope.result = false;
        }

        $scope.clearforminclination = function() {
            $scope.area = {};
            $scope.result = false;
        }

        //Rupture shape and area 

        $scope.shapes = ['Rectangular', 'Triangular', 'Square', 'Circular'];
        $scope.diameter = [10,24];
        $scope.result = false;
        $scope.area = {};
        var getAGIdata = function() {
            $http.get('/getAGIData')
                .success(function(data, status) {
                    $scope.getagidata = data;
                });
        }

        getAGIdata();

        $scope.calcVolume = function(area, shape, olddata) {
            $scope.loading = true;
            var areaprops = {
                density: $scope.pipe.density,
                pressure: $scope.pipe.pressure,
                viscosity: $scope.pipe.viscosity,
                diameter:$scope.pipe.diameter,
                length: $scope.pipe.length,
                area: area,
                shape: shape
            };
            $scope.result = true;
            $http.post('/calculatePipelinedata', areaprops)
                .success(function(data, status) {
                    $scope.barrels = data;
                    $scope.data = $scope.getData;
                    $scope.loading = false;
                    // $scope.area ={};
                })
                .error(function(data, status) {
                    console.log('data', data);
                    growl.addErrorMessage(data.message);
                });

        }

        $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                // width:300,
                // margin: {
                //     top: 20,
                //     right: 20,
                //     bottom: 60,
                //     left: 40
                // },
                x: function(d) {
                    return d['flowrate'];
                },
                y: function(d) {
                    return d['pressure'];
                },
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    axisLabel: 'Spill Flow Rate (In Barrels/Hour)',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Pressure (In Bar)',
                    tickFormat: function(d) {
                        return d3.format(',.2f')(d);
                    }
                }
            }
        };

        $scope.getData = [{
            values: [{
                "flowrate": 179,
                "pressure": 21
            }, {
                "flowrate": 255,
                "pressure": 26
            }, {
                "flowrate": 284,
                "pressure": 31
            }, {
                "flowrate": 378,
                "pressure": 36
            }, {
                "flowrate": 454,
                "pressure": 41
            }, {
                "flowrate": 587,
                "pressure": 46
            }, {
                "flowrate": 686,
                "pressure": 51
            }, {
                "flowrate": 784,
                "pressure": 56
            }, {
                "flowrate": 888,
                "pressure": 61
            }, {
                "flowrate": 976,
                "pressure": 66
            }, {
                "flowrate": 1067,
                "pressure": 71
            }],

            key: 'Pressure', //key  - the name of the series.
            color: '#ff7f0e'
        }]
    }
]);
