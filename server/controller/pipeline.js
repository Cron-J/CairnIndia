'use strict';

var Boom = require('boom'),
    Config = require('../config/config'),
    constants = require('../Utility/constants').constants,
    Jwt = require('jsonwebtoken'),
    Pipeline = require('../model/pipeline').Pipeline,
    staticData = require('../staticjson.json');

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
        Pipeline.findPipeLine(function(err, result) {
            if (result.length != 0) {
                reply("Pipeline already exists");
            } else {
                var data1 = {};
                data1.fromCity = "Gujrat",
                    data1.toCity = "Barmer",
                    data1.pipeName = "Gujrat to Barmer",
                    data1.length = 700,
                    data1.diameter = 24,
                    data1.density = 877.4,
                    data1.pressure = 31,
                    data1.viscosity = 28.28;

                var data2 = {};
                data2.fromCity = "Barmer",
                    data2.toCity = "Salaya",
                    data2.pipeName = "Barmer to Salaya",
                    data2.length = 400,
                    data2.diameter = 10,
                    data2.density = 870,
                    data2.pressure = 21,
                    data2.viscosity = 28.28;

                Pipeline.insertPipeline([data1, data2], function(err, user) {
                    if (!err) {
                        reply("Pipe created successfully");
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
        if (getresult === NaN || getresult === undefined || getresult === null) {
            reply('There is something wrong')
        } else {
            reply(getresult);
        }


    }
};

var calcVolume = function(areaprops) {
    console.log(areaprops);
    var inchtometer = 0.0254;
    var res,
        eqvDim, output;
    if (areaprops.shape == "Rectangular") {
        res = parseFloat(areaprops.area.length) * parseFloat(areaprops.area.breadth);
        if (areaprops.olddata === 'true') {
            eqvDim = (2 * areaprops.area.length * areaprops.area.breadth) / (areaprops.area.length + areaprops.area.breadth);
            output = spillVolume(res * inchtometer * inchtometer, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.rectheight);
        }




    } else
    if (areaprops.shape == "Triangular") {
        var s = (parseFloat(areaprops.area.sidea) + parseFloat(areaprops.area.sideb) + parseFloat(areaprops.area.sidec)) / 2;
        res = Math.sqrt(s * (s - parseFloat(areaprops.area.sidea)) * (s - parseFloat(areaprops.area.sideb)) * (s - parseFloat(areaprops.area.sidec)));
        if (areaprops.olddata === 'true') {
            eqvDim = (4 * res) / (areaprops.area.sidea + areaprops.area.sideb + areaprops.area.sidec);
            output = spillVolume(res * inchtometer * inchtometer, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.triheight);
        }


    } else
    if (areaprops.shape == "Square") {
        res = parseFloat(areaprops.area.sidelength) * inchtometer * inchtometer * parseFloat(areaprops.area.sidelength);
        if (areaprops.olddata === 'true') {
            eqvDim = areaprops.area.sidelength;
            output = spillVolume(res, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res, areaprops.area.squareheight);
        }

    } else
    if (areaprops.shape == "Circular") {
        res = Math.PI * parseFloat(areaprops.area.radius) * parseFloat(areaprops.area.radius);
        if (areaprops.olddata === 'true') {
            eqvDim = 2 * areaprops.area.radius;
            output = spillVolume(res * inchtometer * inchtometer, eqvDim * inchtometer, areaprops.area.inclination, areaprops.density, areaprops.pressure, areaprops.viscosity);
        } else {
            output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.circleheight);
        }


    } else
    if (areaprops.shape == "ground") {
        var flowrate = flowRate(areaprops.area.velocity);
        var pipevelocity = velocityOfPipe(areaprops.length)
        var preshutvolume = getPreshutVolume(flowrate, areaprops.area.time);
        output = totalFlowRate(pipevelocity, preshutvolume, areaprops.area.gasoilratio);
        console.log('output', output);
    }
    if (areaprops.shape == "water") {
        var flowrate = flowRate(areaprops.area.velocity);
        var pipevelocity = velocityOfPipe(areaprops.length)
        var preshutvolume = getPreshutVolume(flowrate, areaprops.area.time);
        var releasevolumefraction = getReleaseVolumeFraction(areaprops.pressure, areaprops.area.depth)
        output = totalFlowRate(pipevelocity, preshutvolume, areaprops.area.gasoilratio, releasevolumefraction);
        console.log('output', output);
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

var oldspillVolume = function(area, height) {
    var GRAVITY = 9.8,
        velocity;
    var coefficientOfDishcharge = 0.62;
    velocity = Math.sqrt(2 * GRAVITY * height * 0.0254);
    var barrels = parseFloat(Math.round(0.62 * area * velocity * 6.28981 * 3600 * 100) / 100).toFixed(2);
    return barrels;
    // }           
}

function flowRate(velocity) {
    var diameter = 24 * 0.0833;
    var pi = Math.PI;
    var flowrate = (pi / 4) * diameter * diameter * velocity * 3.28 * 28.3168; //multiplied 3.28 to convert into m/s to foot/sec and multiplied with 28.3168 to convert litres/sec
    console.log('flowrate', flowrate);
    return flowrate;
}

function getPreshutVolume(flowrate, time) {
    var preshutvolume = (flowrate * 543.44 *time) / (1440*60); //multiplied flow rate with 543.44 to convert it into bbl/day
    console.log('preshutvolume', preshutvolume);
    return preshutvolume;
    // var bbllitrevalue = preshutvolume * 159; //Convert bbl into litre
    // return bbllitrevalue;
}

function velocityOfPipe(pipelength) {
    var diameter = 24 * 0.0833;
    var pi = Math.PI;
    var pipevelocity = (diameter / 24) * (diameter / 24) * pipelength * pi * 3280.84 * 0.028; //multiplied 3280.84 for covert km into feet cube and multiplied with 0.028 to convert cubic feet into cubic meter
    console.log('pipevelocity', pipevelocity);
    return pipevelocity;
}

function totalFlowRate(pipevelocity, preshutvolume, gasoilratio, releasevolumefraction) {
    console.log(pipevelocity);
    console.log(preshutvolume);
    console.log(gasoilratio);
    console.log(releasevolumefraction);
    var totalflowrate;
    if (releasevolumefraction !== undefined) {
        totalflowrate = (0.1781 * pipevelocity * gasoilratio * releasevolumefraction) + preshutvolume;
        console.log('totalflowrate1', totalflowrate);
    } else {
        totalflowrate = (0.1781 * pipevelocity * gasoilratio) + preshutvolume;
        console.log('totalflowrate2', totalflowrate);
    }
    return totalflowrate;

}

function getReleaseVolumeFraction(pressure, waterdepth) {
    var pamb = 0.44 * waterdepth * 0.0689476;
    var releasevolumefraction = pressure / pamb;
    var relativedata = mapStaticData(staticData, releasevolumefraction);
    console.log('relativedata', relativedata);
    return relativedata;
}

function mapStaticData(staticdata, volumefraction) {
    console.log('volumefraction', volumefraction);
    var frelative;
    for (var i = 0; i < staticdata.frelative.length; i++) {
        if (staticdata.frelative[i].range.from <= volumefraction && staticdata.frelative[i].range.to > volumefraction) {
            frelative = staticdata.frelative[i].value;
            console.log("frelative");
        }
    }
    return frelative;
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
