app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams', 'getGasOilRatio', '$localStorage',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams, getGasOilRatio, $localStorage) {
        $scope.pipe = {};
        $scope.maphourslider = {
          value: 1,
          options: {
              floor: 1,
              ceil: 48,
              step: 1,
              onChange: function() {
                adjustslider();
              }
          }
        };
        $scope.createPipeline = function(data) {
            $location.path('/create-pipeline');
        }
        $scope.rvpavalue = [{
            key: '37.8',
            value: 8
        }, {
            key: '50',
            value:20.1
        }, {
            key: '60',
            text: 27.5
        }, {
            key: '65',
            value: 31.9
        }];
        $scope.tracemetals = [{
            name: 'Iron',
            value: 8
        }, {
            name: 'Nickel',
            value:20.1
        }, {
            name: 'Vanadium',
            text: 27.5
        }, {
            name: 'Copper',
            value: 31.9
        },
        {
            name: 'Zinc',
            value: 31.9
        }];
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
        $scope.gotoCalculation = function(data) {
            $location.path('/oilcalculation1');
            // singlePipeData.set(data);
            $localStorage.message = data;
        }
        $scope.pipe = $localStorage.message;

        $scope.rupture = '';
        $scope.isShown = function(rupture) {
            return rupture === $scope.rupture;
        };

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
            $scope.showmap = false;
        }

        $scope.clearforminclination = function() {
            $scope.area = {};
            $scope.location = {};
            $scope.options = undefined;
            $scope.data = [];
            $scope.result = false;
            $scope.showmap = false;
        }

        //Rupture shape and area

        $scope.shapes = ['Rectangular', 'Triangular', 'Square', 'Circular'];
        $scope.diameter = [10, 24];
        $scope.result = false;
        $scope.area = {};
        $scope.location = {};
        var getAGIdata = function() {
            $http.get('/getAGIData')
                .success(function(data, status) {
                    $scope.getagidata = data;
                });
        }

        getAGIdata();

        $scope.calcVolume = function(area, shape) {
            $scope.loading = true;
            var areaprops = {
                density: $scope.pipe.density,
                pressure: $scope.pipe.pressure,
                viscosity: $scope.pipe.viscosity,
                diameter: $scope.pipe.diameter,
                length: $scope.pipe.length,
                area: area,
                shape: shape
            };
            $scope.result = true;
            $http.post('/calculatePipelinedata', areaprops)
                .success(function(data, status) {
                    $scope.barrels = data;
                    if (shape === "Rectangular" || shape === "Triangular" || shape === "Square" || shape === "Circular") {
                        $scope.options = $scope.pressureoptions;
                        $scope.data = $scope.getData;
                    } else if (shape === "water" || shape === "ground") {
                        $scope.options = $scope.timeoptions;
                        $scope.data = $scope.getSpillData;
                    } else if (shape === "inclination") {
                        $scope.options = $scope.agioptions;
                        $scope.data = $scope.agidata;
                    }


                    // $scope.options = $scope.pressureoptions;
                    // $scope.data = $scope.getData;
                    // $scope.options1 = $scope.timeoptions;
                    // $scope.data1 = $scope.getSpillData;
                    // $scope.options2 = $scope.agioptions;
                    // $scope.data2 = $scope.agidata;
                    $scope.loading = false;
                    // $scope.area ={};

                    //show map
                    var validLocation = $scope.location.lat >= -90 && $scope.location.lat <= 90 && $scope.location.lng >= -180 && $scope.location.lng <= 180;
                    if (validLocation) {
                      $scope.showmap = true;
                      $scope.getMap($scope.maphourslider.value, $scope.barrels);
                    } else {
                      $scope.showmap = false;
                    }
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                });
        }

        $scope.pressureoptions = {
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
            },
            subtitle: {
                enable: true,
                text: '',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: 'Pressure Flow Rate',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px',
                    'font-weight': 'bold'
                }
            }
        };
        $scope.agioptions = {
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
                    return d['agipoint'];
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
                    axisLabel: 'AGI',
                    tickFormat: function(d) {
                        return d3.format(',.2f')(d);
                    }
                }
            },
            subtitle: {
                enable: true,
                text: '',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> AGI Flow Rate',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px',
                    'font-weight': 'bold'
                }
            }
        };
        $scope.timeoptions = {
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
                    return d['maxspill flow rate'];
                },
                y: function(d) {
                    return d['minute'];
                },
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    axisLabel: 'Maximum Spill(In litre/sec)',
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Time (In Minutes)',
                    tickFormat: function(d) {
                        return d3.format(',.2f')(d);
                    }
                },
                callback: function(chart) {
                    // line chart callback
                }
            },
            subtitle: {
                enable: true,
                text: '',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 2.</b> Time Flow Rate',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px',
                    'font-weight': 'bold'
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

        $scope.agidata = [{
            values: [{
                "flowrate": 166.24,
                "agipoint": 0
            }, {
                "flowrate": 125.67,
                "agipoint": 3
            }, {
                "flowrate": 57.51,
                "agipoint": 6
            }, {
                "flowrate": 34.40,
                "agipoint": 9
            }, {
                "flowrate": 49.49,
                "agipoint": 12
            }, {
                "flowrate": 14.66,
                "agipoint": 15
            }, {
                "flowrate": 34.74,
                "agipoint": 17
            }, {
                "flowrate": 99.29,
                "agipoint": 21
            }, {
                "flowrate": 26.50,
                "agipoint": 24
            }, {
                "flowrate": 75.48,
                "agipoint": 26
            }, {
                "flowrate": 147.88,
                "agipoint": 27
            }, {
                "flowrate": 38.89,
                "agipoint": 30
            }],

            key: 'AGI', //key  - the name of the series.
            color: 'red'
        }]

        $scope.getSpillData = [{
            values: [{
                "maxspill flow rate": 7.25,
                "minute": 1
            }, {

                "maxspill flow rate": 23.60,
                "minute": 10
            }, {

                "maxspill flow rate": 97.00,
                "minute": 50
            }, {

                "maxspill flow rate": 188.70,
                "minute": 100
            }, {

                "maxspill flow rate": 372.08,
                "minute": 200
            }, {

                "maxspill flow rate": 463.77,
                "minute": 250
            }, {

                "maxspill flow rate": 555.46,
                "minute": 300
            }, {

                "maxspill flow rate": 738.84,
                "minute": 400
            }, {

                "maxspill flow rate": 921.39,
                "minute": 500
            }, {

                "maxspill flow rate": 1379.84,
                "minute": 750
            }, {

                "maxspill flow rate": 1838.30,
                "minute": 1000
            }, {

                "maxspill flow rate": 2296.76,
                "minute": 1250
            }, {

                "maxspill flow rate": 2755.21,
                "minute": 1500
            }, {

                "maxspill flow rate": 3213.67,
                "minute": 1750
            }, {

                "maxspill flow rate": 3672.13,
                "minute": 2000
            }, {

                "maxspill flow rate": 4038.89,
                "minute": 2200
            }, {

                "maxspill flow rate": 4405.66,
                "minute": 2400
            }, {

                "maxspill flow rate": 4589.04,
                "minute": 2500
            }, {

                "maxspill flow rate": 4772.42,
                "minute": 2600
            }, {

                "maxspill flow rate": 4955.81,
                "minute": 2700
            }, {
                "maxspill flow rate": 5139.19,
                "minute": 2800
            }, {

                "maxspill flow rate": 5286.73,
                "minute": 2880
            }],

            key: 'time', //key  - the name of the series.
            color: 'green'
        }]
        var adjustslider = function () {
          $scope.getMap($scope.maphourslider.value, $scope.barrels);
        }
        $scope.getMap = function(totalhours, barrelsize) {
          var maplatlong = $scope.location;
          var mapOptions = {
            zoom: 20,
            center: maplatlong,
            mapTypeId: google.maps.MapTypeId.SATELLITE
          }
          var map = new google.maps.Map(document.getElementById('map'), mapOptions);
          map.setTilt(45);

          var marker = new google.maps.Marker({
            position: maplatlong,
            map: map
          });

          // barrel to meter
          var meter = Math.cbrt(((barrelsize * totalhours)/8.3864));
          var circle = new google.maps.Circle({
             map: map,
             radius: meter,    // change as per the calculation it will cover in meters
             fillColor: '#FF0000',
             strokeOpacity: 0.8,
             strokeWeight: 0.5
           });
           circle.bindTo('center', marker, 'position');
        }
    }
]);
