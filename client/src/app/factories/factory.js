'use strict';

/* Factories */
// All the directives rely on jQuery.

angular.module('app.factory', [])

.factory('AuthServ', function($cookieStore, $rootScope) {
        var user;
        if ($cookieStore.get('user')) {
            user = $cookieStore.get('user');
            $rootScope.user = user;
        }
        return {
            getToken: function() {
                return user.token;
            },
            getUser: function() {
                return user;
            },
            getAuthHeader: function() {
                return (user && user.token) ? {
                    'Authorization': 'Bearer ' + user.token
                } : {};
            },
            setUserToken: function(newUser) {
                user = newUser;
                if (!user) {
                    return this.clearCookie();
                }
                this.saveToCookie();
            },
            saveToCookie: function() {
                $cookieStore.put('user', user);
            },
            clearCookie: function() {
                $cookieStore.remove('user');
            },
            loadFromCookie: function() {
                user = $cookieStore.get('user');
            },
            removeUser: function() {
                user = null;
                $cookieStore.put('user', user);

            },
            isAuthorized: function(authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                if (authorizedRoles[0] == '*')
                    return true;
                if ($cookieStore.get('user'))
                    return (authorizedRoles.indexOf($cookieStore.get('user').scope) !== -1);
                else
                    return false
            },

            isLoggedInAsync: function(cb) {
                if (user && user.scope) {
                    cb(true);
                } else {
                    cb(false);
                }

            }

        };
    })
    .factory('userInfo', function($http, AuthServ, growl, $rootScope) {
        var promise;
        var myService = {
            async: function() {

                // $http returns a promise, which has a then function, which also returns a promise
                promise = $http.get('/user', {
                        headers: AuthServ.getAuthHeader()
                    })
                    .success(function(data, status) {
                        return data;
                    })
                    .error(function(data, status) {
                        if (data.message == 'Invalid token') {
                            delete $rootScope.user;
                            growl.addErrorMessage('Session has expired');
                        } else
                            growl.addErrorMessage(data.message);
                    });

                // Return the promise to the controller
                return promise;
            }
        };
        return myService;
    })
    .factory('countryList', function($http, AuthServ, growl) {
        var promise;
        var list = {
            async: function() {

                // $http returns a promise, which has a then function, which also returns a promise
                promise = $http.get('/countryList')
                    .success(function(data, status) {
                        return data;
                    })
                    .error(function(data, status) {
                        growl.addErrorMessage(data.message);
                    });
                // Return the promise to the controller
                return promise;
            }
        };
        return list;

    })

.factory('singlePipeData', function() {
    var savedData = {}

    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }
    return {
        set: set,
        get: get
    }

})

.factory('getGasOilRatio', function() {
    var gasoilratio;
    gasoilratio = [{
        range: "0-225",
        value: "1"
    }, {
        range: "225-280",
        value: "0.98"
    }, {
        range: "280-340",
        value: "0.97"
    }, {
        range: "340-420",
        value: "0.95"
    }, {
        range: "420-560",
        value: "0.9"
    }, {
        range: "560-1100",
        value: "0.85"
    }, {
        range: "1110-1700",
        value: "0.82"
    }, {
        range: "1700-2800",
        value: "0.63"
    }, {
        range: "2800-5600",
        value: "0.43"
    }, {
        range: "5600-11300",
        value: "0.26"
    }]

    return gasoilratio;

})
.factory('clockAngle', function() {
    var clockAngle;
    clockAngle = [{
        key: "00:00",
        value: 0
    }, {
        key: "00:30",
        value: 15
    }, {
        key: "01:00",
        value: 30
    }, {
        key: "01:30",
        value: 45
    }, {
        key: "02:00",
        value: 60
    }, {
        key: "02:30",
        value: 75
    }, {
        key: "03:00",
        value: 90
    }, {
        key: "03:30",
        value: 105
    }, {
        key: "04:00",
        value: 120
    }, {
        key: "04:30",
        value: 135
    },{
        key: "05:00",
        value: 150
    }, {
        key: "05:30",
        value: 165
    },{
        key: "06:00",
        value: 180
    }, {
        key: "06:30",
        value: 195
    }, {
        key: "07:00",
        value: 210
    }, {
        key: "07:30",
        value: 225
    }, {
        key: "08:00",
        value: 240
    }, {
        key: "08:30",
        value: 255
    }, {
        key: "09:00",
        value: 270
    }, {
        key: "09:30",
        value: 285
    }, {
        key: "10:00",
        value: 300
    }, {
        key: "10:30",
        value: 315
    },{
        key: "11:00",
        value: 330
    }, {
        key: "11:30",
        value: 345
    }]

    return clockAngle;

})
.factory('appearanceData', function() {
    var getAppearanceData = {};
    getAppearanceData.getAppearanceData = [{
        key: "Sheen",
        coveragearea: 0.5,
        thickness:0.3
    },{
        key: "Rainbow",
        coveragearea: 0.3,
        thickness:5.0
    },{
        key: "Metallic",
        coveragearea: 0.15,
        thickness:50
    },{
        key: "True color",
        coveragearea: 0.05,
        thickness:200
    } ],
    getAppearanceData.season = [{
        key: "NorthEast Monsoon",
        windspeed: 6,
        currentpattern:"mild & away from the shore"
    },{
        key: "Pre Monsoon",
        windspeed: 4,
        currentpattern:"mild & away from the shore"
    },{
        key: "SouthWest Monsoon",
        windspeed: 1,
        currentpattern:"moderate & towards  the shore"
    },{
        key: "Post Monsoon",
        windspeed: 7,
        currentpattern:"moderate & towards  the shore"
    }]

    return getAppearanceData;

});
