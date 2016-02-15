app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams', 'getGasOilRatio', '$localStorage', 'clockAngle', 'appearanceData',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams, getGasOilRatio, $localStorage, clockAngle, appearanceData) {
        var mapdefaultvalue = 1;
        var getDefaultdata = function() {
            return {
                density: 0.8774,
                specificgravity: 0.8774,
                gravity: 29.68,
                viscosityat100: 10.86,
                rvp: 27.5,
                pourpoint: 42,
                sulfurweightage: 0.09,
                saltcontent: 1.3,
                microcarbonresidue: 4.47,
                watercontent: 0.02,
                bsw: 0,
                totalacidvalue: 0.28,
                flashpoint: 30.5,
                lpgpotentials: 0.2
            };
        }
        $scope.oiledshape = ['Rectangular', 'Circular'];
        $scope.pipelinedata = {}
        $scope.selectedkpdata = {}
        $scope.init = function() {
            getKPData();
            $scope.getClockAngle = clockAngle;
            $scope.appearanceData = appearanceData;
            $scope.pipe = singlePipeData.get();
        }
        $scope.pipe = getDefaultdata();
        $scope.meters = 0;
        $scope.maphourslider = {
            value: mapdefaultvalue,
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
            $scope.pipe = getDefaultdata();
        }
        $scope.rvpavalue = [{
            key: '37.8',
            value: 8
        }, {
            key: '50',
            value: 20.1
        }, {
            key: '60',
            value: 27.5
        }, {
            key: '65',
            value: 31.9
        }];
        $scope.tracemetals = [{
            name: 'Iron',
            value: 8
        }, {
            name: 'Nickel',
            value: 20.1
        }, {
            name: 'Vanadium',
            text: 27.5
        }, {
            name: 'Copper',
            value: 31.9
        }, {
            name: 'Zinc',
            value: 31.9
        }];
        $scope.selectedItem = {};
        var getalldata = function() {
            $http.get('/getPipeline')
                .success(function(data, status) {
                    $scope.getpipedata = data;
                });
            $scope.selectedItem.pipeName = $scope.pipe._id;
            if ($location.$$path == '/create-pipeline') {
                $scope.pipe = getDefaultdata();
            }
        }

        function getKPData() {
            $http({
                method: 'GET',
                url: '/getKpData'
            }).then(function successCallback(response) {
                console.log('response', response);
                $scope.kpdata = response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
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
            singlePipeData.set(data);
        }
        $scope.showpattern = false;
        $scope.showrupture1 = false;
        $scope.showrupture2 = false;
        $scope.showwaterdiv = false;
        $scope.showgrounddiv = false;
        $scope.showgeo = false;
        $scope.changeView = function(showrupture1, showrupture2, showwaterdiv, showgrounddiv, showdiv, rupture, showgeo, showspm) {
            showrupture1 === undefined ? showrupture1 : $scope.showrupture1 = showrupture1;
            showrupture2 === undefined ? showrupture2 : $scope.showrupture2 = showrupture2;
            showwaterdiv === undefined ? showwaterdiv : $scope.showwaterdiv = showwaterdiv;
            showgrounddiv === undefined ? showgrounddiv : $scope.showgrounddiv = showgrounddiv;
            showdiv === undefined ? showdiv : $scope.showdiv = showdiv;
            rupture === undefined ? rupture : $scope.rupture = rupture;
            showgeo === undefined ? showgeo : $scope.showgeo = showgeo;
            showspm === undefined ? showspm : $scope.showspm = showspm;
        }

        $scope.changeDiv = function(rupture) {
            $scope.showrupture1 = false;
            $scope.showrupture2 = false;
            if (rupture === 'water') {
                $scope.showwaterdiv = true;
                $scope.showgeo = true;
                $scope.showgrounddiv = false;
            } else if (rupture === 'ground') {
                $scope.showgrounddiv = true;
                $scope.showgeo = true;
                $scope.showwaterdiv = false;
            }
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
                        $scope.pipe = getDefaultdata();
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
                        $scope.pipe = getDefaultdata();
                    });
            } else {
                $scope.pipe = getDefaultdata();
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
            $scope.showslider = false;
        }

        $scope.clearforminclination = function() {
            $scope.area = {};
            $scope.location = {};
            $scope.selectedkpdata = {};
            $scope.options = undefined;
            $scope.data = [];
            $scope.result = false;
            $scope.showmap = false;
            $scope.showslider = false;
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

        $scope.calcVolume = function(area, shape, kp) {
            var getKpData;
            kp !== undefined ? getKpData = JSON.parse(kp) : getKpData = ''
            $scope.loading = true;
            console.log('$scope.selectedkpdata.appearance', $scope.selectedkpdata.appearance);
            var getheighteDifference = getDifferenceInAgiHeight(getKpData);
            var kppoint = getKpData.kp;
            var areaprops = {
                density: $scope.pipe.density,
                pressure: $scope.pipe.pressure,
                viscosity: $scope.pipe.viscosity,
                diameter: $scope.pipe.diameter,
                length: $scope.pipe.length,
                area: area,
                shape: shape,
                heightdiffrence: getheighteDifference,
                kp: getKpData,
                volume:$scope.barrels,
                appearance: $scope.selectedkpdata.appearance
            };
            $scope.result = true;
            $http.post('/calculatePipelinedata', areaprops)
                .success(function(data, status) {
                    $scope.showpattern = true;
                    // if (shape === "water" || shape === "ground") {
                    //     $scope.options = $scope.timeoptions;
                    //     $scope.data = $scope.getSpillData;
                    // } 
                    $scope.loading = false;

                    //set barrels
                    $scope.barrels = data;
                    //show map
                    $scope.showmap = true;
                    $scope.maphourslider.value = mapdefaultvalue;
                    $scope.getMap($scope.maphourslider.value, $scope.barrels, getKpData);
                })
                .error(function(data, status) {
                    growl.addErrorMessage(data.message);
                });
        }




        function getDifferenceInAgiHeight(kp) {
            var getKpObj = {};
            for (var i = 0; i < $scope.kpdata.length; i++) {
                if (kp.heighting === $scope.kpdata[i].heighting) {
                    getKpObj.leftHeight = Math.abs(($scope.kpdata[i - 1].heighting - kp.heighting));
                    getKpObj.rightHeight = Math.abs(($scope.kpdata[i + 1].heighting - kp.heighting));
                    break;
                }
            }
            return getKpObj;
        }
        $scope.timeoptions = {
            chart: {
                type: 'lineChart',
                height: 450,
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
                html: 'Time Flow Rate',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px',
                    'font-weight': 'bold'
                }
            }
        };
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
        var map = null;
        var marker = null;
        var circle = null;

        var setCircle = function(totalhours, barrelsize) {
            if ($scope.showwaterdiv == true) {
                var cubicmeter = Math.cbrt((barrelsize) / 8.3864);
                var radiusCover = Math.sqrt((cubicmeter * Math.pow(10, 5)) / 3.14);
                var hours = $scope.maphourslider.value > 1 ? 'hours' : 'hour';

                $scope.meters = radiusCover;
                $scope.displayMessage = "The slick will cover a radius of <font class='highlight'>" + $scope.meters.toFixed(2) + "</font> metres";
            } else if ($scope.showrupture1 == true) {
                $scope.showslider = true;
                var cubicmeter = Math.cbrt(((converttoBarrels(barrelsize) * totalhours) / 8.3864));
                var radiusCover = Math.sqrt((cubicmeter * Math.pow(10, 5)) / 3.14);
                var hours = $scope.maphourslider.value > 1 ? 'hours' : 'hour';

                $scope.meters = radiusCover;
                $scope.displayMessage = "After <font class='highlight'>" + $scope.maphourslider.value + "</font> " + hours + " the total oil spill will be <font class='highlight'>" + ($scope.barrels * totalhours).toFixed(2) + "</font> litres and it will spread over radius of <font class='highlight'>" + $scope.meters.toFixed(2) + "</font> metres";
            } else if ($scope.showrupture2 == true) {
                $scope.showslider = true;
                var litresperhours = barrelsize * 3600;
                var barrelsperhour = litresperhours * 0.0086485;
                var cubicmeter = Math.cbrt(((barrelsperhour * totalhours) / 8.3864));
                var radiusCover = Math.sqrt((cubicmeter * Math.pow(10, 5)) / 3.14);
                var hours = $scope.maphourslider.value > 1 ? 'hours' : 'hour';

                $scope.meters = radiusCover;
                $scope.displayMessage = "After <font class='highlight'>" + $scope.maphourslider.value + "</font> " + hours + " the total oil spill will be <font class='highlight'>" + (litresperhours * totalhours).toFixed(2) + "</font> litres and it will spread over radius of <font class='highlight'>" + $scope.meters.toFixed(2) + "</font> metres";
            }
            if (circle) {
                circle.setMap(null);
            }
            circle = new google.maps.Circle({
                map: map,
                radius: $scope.meters, // change as per the calculation it will cover in meters
                fillColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 0.5
            });
            circle.bindTo('center', marker, 'position');
        }
        var converttoLlitres = function(barrels) {
            return barrels / 0.0086485;
        }
        var converttoBarrels = function(litres) {
            return litres * 0.0086485;
        }
        var adjustslider = function() {
            setCircle($scope.maphourslider.value, $scope.barrels);
        }
        $scope.getMap = function(totalhours, barrelsize, kp) {
            if (kp!==undefined && kp!=='') {
                var maplatlong = {
                    lat: kp.latitude,
                    lng: kp.longitude
                }
                console.log(maplatlong);
                var mapOptions = {
                    zoom: 20,
                    center: maplatlong,
                    mapTypeId: google.maps.MapTypeId.SATELLITE
                }
                map = new google.maps.Map(document.getElementById('map'), mapOptions);
                map.setTilt(45);

                marker = new google.maps.Marker({
                    position: maplatlong,
                    map: map
                });
                setCircle(totalhours, barrelsize);
            }

        }
        $scope.init();
    }


]);