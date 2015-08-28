app.controller('containmentCtrl', ['$scope', '$location', '$http', 'AuthServ', 'growl', '$rootScope', 'singlePipeData', '$timeout', '$stateParams',
    function($scope, $location, $http, AuthServ, growl, $rootScope, singlePipeData, $timeout, $stateParams) {

        $scope.createPipeline = function() {
            $location.path('/create-pipeline');
        }
        $scope.selectedItem ={};
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
            var id = pipe.pipeName ? pipe.pipeName : pipe;
            $http.get('/getPipeLinebyId/' + id)
                .success(function(data, status) {
                    $scope.pipe = data;
                    // singlePipeData.set($scope.pipe);
                })
                .error(function(data, status) {
                    $scope.pipe = {};
                });

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

        //Rupture shape and area 

        $scope.shapes = ['Rectangular', 'Triangular', 'Square', 'Circular', 'Sector'];

        $scope.result=false;
        $scope.calcVolume = function(area, shape) {
            $scope.result=true;
            if (shape == "Rectangular")
                $scope.getArea = area.length * area.breadth;
            else
            if (shape == "Triangular")
                $scope.getArea = 0.5 * area.length * area.breadth;
            else
            if (shape == "Square")
                $scope.getArea = area.length * area.length;
            else
            if (shape == "Circular")
                $scope.getArea = Math.PI * area.radius * area.radius;
            else
            if (shape == "Sector")
                $scope.getArea = (area.radius * area.angle * Math.PI) / 360;
        }



    }
]);
