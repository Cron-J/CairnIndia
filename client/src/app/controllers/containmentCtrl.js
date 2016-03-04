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
            $scope.location = {
                latitude:21.93347,
                longitude:69.16447
            }
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
            $location.path('/oilcalculation1/'+ data._id);
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
            $scope.barrels = undefined;
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
        var getAGIdata = function() {
            $http.get('/getAGIData')
                .success(function(data, status) {
                    $scope.getagidata = data;
                });
        }

        getAGIdata();

        $scope.calcVolume = function(area, shape, kp) {
            var getKpData;
            if(shape ===true){
                getKpData =kp;
            }else{
                 kp !== undefined ? getKpData = JSON.parse(kp) : getKpData = ''
            }
            $scope.loading = true;
            console.log('$scope.selectedkpdata.appearance', $scope.selectedkpdata.appearance);
            var getheighteDifference = getDifferenceInAgiHeight(getKpData);
            var kppoint = getKpData.kp;
            var spmzoom;
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
                    $scope.loading = false;
                    $scope.maphourslider.value = mapdefaultvalue;
                    if(shape===true){
                        $scope.getArea = data;
                        $scope.showbarreldiv = true;
                        $scope.getMap($scope.maphourslider.value, $scope.barrels, $scope.location,'icon',$scope.selectedkpdata.spmdata)
                    }else{
                        $scope.barrels = data;
                        $scope.showbarreldiv = false;
                        if($scope.selectedkpdata.appearance!==undefined){
                            getKpData =$scope.location
                            spmzoom = 'spm';

                        } else{
                            getKpData = getKpData;
                        }
                        $scope.getMap($scope.maphourslider.value, $scope.barrels, getKpData,spmzoom);

                    }
                    $scope.showmap = true;
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
                $scope.displayMessage = "After <font class='highlight'>" + $scope.maphourslider.value + "</font> " + hours + " the total oil spill will be <font class='highlight'>" + ($scope.barrels * totalhours).toFixed(2) + "</font> barrels and it will spread over radius of <font class='highlight'>" + $scope.meters.toFixed(2) + "</font> metres";
            } else if ($scope.showrupture2 == true) {
                $scope.showslider = false;
                var litresperhours = barrelsize * 3600;
                var barrelsperhour = litresperhours * 0.0086485;
                var cubicmeter = Math.cbrt(((barrelsperhour * totalhours) / 8.3864));
                var radiusCover = Math.sqrt((cubicmeter * Math.pow(10, 5)) / 3.14);
                var hours = $scope.maphourslider.value > 1 ? 'hours' : 'hour';

                $scope.meters = radiusCover;
                $scope.displayMessage ="The slick will spread over a radius of  <font class='highlight'>" + $scope.meters.toFixed(2) + "</font> metres";
            }
            else if ($scope.showspm == true) {
                $scope.showslider = false;
                $scope.displayMessage = "";
                $scope.meters = 1000
            }
            if (circle) {
                circle.setMap(null);
            }
            var circlecolor;
            circlecolor = ($scope.showspm === true?'#C2DFFF' : '#FF0000');
            circle = new google.maps.Circle({
                map: map,
                radius: $scope.meters, // change as per the calculation it will cover in meters
                fillColor: circlecolor,
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
        $scope.getMap = function(totalhours, barrelsize, kp,spmzoom,pattern) {
            var mapOptions = {};
            console.log('kp',kp);
            if (kp!==undefined && kp!=='') {
                var maplatlong = {
                    lat: kp.latitude,
                    lng: kp.longitude
                }
                if(spmzoom==='spm'){
                    mapOptions.zoom = 13;
                }else if(spmzoom==='icon'){
                    mapOptions.zoom =13;
                }else{
                    mapOptions.zoom =20;
                }
                console.log(maplatlong);
                mapOptions = {
                    zoom: mapOptions.zoom,
                    center: maplatlong,
                    mapTypeId: google.maps.MapTypeId.SATELLITE
                }
                map = new google.maps.Map(document.getElementById('map'), mapOptions);
                map.setTilt(45);
                var image;
                if(spmzoom ==='icon'){
                    var maplatlng ={
                        lat:21.93347,
                        lng:69.16447
                    }
                    image = ((pattern.currentpattern==='moderate & towards  the shore') ? 'app/assets/img/arrow.gif':'app/assets/img/arrow-r.gif');
                       marker[0] = new google.maps.Marker({
                            position: maplatlng,
                            map: map
                        }); 
                       marker[1] = new google.maps.Marker({
                            position: maplatlong,
                            map: map,
                            icon: image,
                            draggable:false,
                            optimized:false // <-- required for animated gi
                        }); 

                }else{
                    marker = new google.maps.Marker({
                        position: maplatlong,
                        map: map
                    });
                }
                
                setCircle(totalhours, barrelsize);
            }

        }
        $scope.init();
    }


]);