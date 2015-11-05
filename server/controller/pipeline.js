'use strict';

var Boom = require('boom'),
    Config = require('../config/config'),
    constants = require('../Utility/constants').constants,
    Jwt = require('jsonwebtoken'),
    Pipeline = require('../model/pipeline').Pipeline;

var privateKey = Config.key.privateKey;

exports.createPipeLine = {
    handler: function(request, reply) {
        Pipeline.savePipeline(request.payload, function(err, user) {
            if (!err) {
                reply("Pipeline created successfully");
            } else {
                if (constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code) {
                    reply(Boom.forbidden("user name already registered"));
                } else reply(Boom.forbidden(err)); // HTTP 403
            }
        });
    }
};


exports.defaultPipelines = {
    handler: function(request, reply) {
        Pipeline.findPipeLine(function(err, result){
            if( result.length != 0 ){
                reply("Pipeline already exists");
            }
            else{
                var data1 = {};
                data1.fromCity = "gujrat",
                data1.toCity = "barmer",
                data1.pipeName = "gujrat to barmer",
                data1.length = 34,
                data1.diameter= 10,
                data1.density = 870,
                data1.pressure= 45,
                data1.viscosity = 28.28;

                var data2 = {};
                data2.fromCity = "gujrat",
                data2.toCity = "barmer",
                data2.pipeName = "gujrat to barmer",
                data2.length = 34,
                data2.diameter= 10,
                data2.density = 870,
                data2.pressure= 45,
                data2.viscosity = 28.28;

                Pipeline.insertPipeline([data1,data2], function(err, user) {
                    if (!err) {
                        reply( "Pipe created successfully" );
                    } else {
                        
                            console.log(err, err);
                        
                    }
                });
            }
         });
    }
};


exports.getPipeLine = {
    handler: function(request, reply) {
        Pipeline.findPipeLine(function(err, result) {
            if (!err) {
                reply(result);
            } else {
                if (constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code) {
                    reply(Boom.forbidden("error"));
                } else reply(Boom.forbidden(err)); // HTTP 403
            }
        });
    }
};


exports.getPipeLinebyId = {
    handler: function(request, reply) {
        Pipeline.findPipeLineById(request.params.id, function(err, result) {
            if (!err) {
                reply(result);
            } else {
                if (constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code) {
                    reply(Boom.forbidden("error"));
                } else reply(Boom.forbidden(err)); // HTTP 403
            }
        });
    }
};


exports.updatePipeline = {
    handler: function(request, reply) {
        Pipeline.findPipeLineById(request.params.id, function(err, result) {
            if (!err) {
                updateHelper(request.payload, result);
                Pipeline.updatePipeline(result, function(err, result) {
                    if (!err) {
                        reply(result);
                    } else {
                        if (11000 === err.code || 11001 === err.code) {
                            reply(Boom.forbidden("please provide another user id, it already exist"));
                        } else reply(Boom.forbidden(err)); // HTTP 403
                    }
                });

            } else {
                reply(Boom.badImplementation(err)); // 500 error
            }
        });
    }
};


exports.removePipeline = {
    handler: function(request, reply) {

        Pipeline.removePipeline(request.params.id, function(err, result) {
            if (err) {
                if (constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code) {
                    reply(Boom.forbidden("Update Failed"));
                } else return reply(Boom.badImplementation(err)); // HTTP 403
            } else {
                return reply("Pipeline Deleted");
            }
        });

    }
};

exports.calculateBarrel = {
    handler: function(request, reply) {
        var getresult = calcVolume(request.payload);
        reply(getresult);

    }
};

var calcVolume = function(areaprops) {
    var inchtometer = 0.0254;
    var res,
        eqvDim, output;
    if (areaprops.shape == "Rectangular") {
        res = parseFloat(areaprops.area.length) * parseFloat(areaprops.area.breadth);
        if (areaprops.olddata === 'true') {
            eqvDim = (2 * areaprops.area.length * areaprops.area.breadth) / (areaprops.area.length + areaprops.area.breadth);
            output = spillVolume(res * inchtometer * inchtometer, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res * inchtometer * inchtometer,areaprops.area.rectheight);
        }




    } else
    if (areaprops.shape == "Triangular") {
        var s = (parseFloat(areaprops.area.sidea) + parseFloat(areaprops.area.sideb) + parseFloat(areaprops.area.sidec)) / 2;
        res = Math.sqrt(s * (s - parseFloat(areaprops.area.sidea)) * (s - parseFloat(areaprops.area.sideb)) * (s - parseFloat(areaprops.area.sidec)));
        if (areaprops.olddata === 'true') {
            eqvDim = (4 * res) / (areaprops.area.sidea + areaprops.area.sideb + areaprops.area.sidec);
            output = spillVolume(res * inchtometer * inchtometer, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res * inchtometer * inchtometer,areaprops.area.triheight);
        }


    } else
    if (areaprops.shape == "Square") {
        res = parseFloat(areaprops.area.sidelength) * inchtometer * inchtometer * parseFloat(areaprops.area.sidelength);
        if (areaprops.olddata === 'true') {
            eqvDim = areaprops.area.sidelength;
            output = spillVolume(res, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res,areaprops.area.squareheight);
        }

    } else
    if (areaprops.shape == "Circular") {
        res = Math.PI * parseFloat(areaprops.area.radius) * parseFloat(areaprops.area.radius);
        if (areaprops.olddata === 'true') {
            eqvDim = 2 * areaprops.area.radius;
            output = spillVolume(res * inchtometer * inchtometer, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res * inchtometer * inchtometer,areaprops.area.circleheight );
        }


    }
    return output;

}

var spillVolume = function(area, eqvDim, degree, density, pressure, viscosity) {
    var velocity, rho = density,
        pressure = pressure * 100000,
        length = 50,
        difference;
    var mu = viscosity * 0.000001 * density;
    var GRAVITY = 9.8;
    var theta = (Math.sin(degree * Math.PI / 180.0));
    difference = pressure - (rho * GRAVITY * length * theta);


    var diameterarea = eqvDim * eqvDim * area;
    var dividedifference = difference * diameterarea;
    var finallength = 32 * mu * length;
    var finalvelocity = (dividedifference / finallength);
    var barrels = (finalvelocity * 3600 * 6.2898).toFixed(3);
    console.log('barrels', barrels);
    return barrels;
    // velocity = (((pressure-rho*GRAVITY*length*theta*1000;)*eqvDim*eqvDim*area)/(32*mu*length*1000));


}

var oldspillVolume = function(area,height) {
    var GRAVITY =9.8,velocity;
    var coefficientOfDishcharge = 0.62;
    velocity = Math.sqrt(2 * GRAVITY*height*0.0254);
     var barrels = parseFloat(Math.round(0.62*area*velocity *6.28981* 3600 * 100) / 100).toFixed(2);
    return barrels;
    // }           
}

var updateHelper = function(requestData, originalData) {
    for (var req in requestData) {
        if (requestData[req] === ' ') {
            originalData[req] = ' ';
        } else {
            originalData[req] = requestData[req];
        }
    }
};