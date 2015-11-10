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

});
