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

exports.getAGIData = {
    handler: function(request, reply) {
        reply(staticData.agivalue);
    }
};

var calcVolume = function(areaprops) {
    console.log('areaprops', areaprops);
    var inchtometer = 0.0254;
    var res,
        eqvDim,
        output;
    if (areaprops.shape == "Rectangular") {
        res = parseFloat(areaprops.area.length) * parseFloat(areaprops.area.breadth);
        output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.rectheight);
    } else
    if (areaprops.shape == "Triangular") {
        var s = (parseFloat(areaprops.area.sidea) + parseFloat(areaprops.area.sideb) + parseFloat(areaprops.area.sidec)) / 2;
        res = Math.sqrt(s * (s - parseFloat(areaprops.area.sidea)) * (s - parseFloat(areaprops.area.sideb)) * (s - parseFloat(areaprops.area.sidec)));
        output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.triheight);
    } else
    if (areaprops.shape == "Square") {
        res = parseFloat(areaprops.area.sidelength) * inchtometer * inchtometer * parseFloat(areaprops.area.sidelength);
        output = oldspillVolume(res, areaprops.area.squareheight);

    } else
    if (areaprops.shape == "Circular") {
        res = Math.PI * parseFloat(areaprops.area.radius) * parseFloat(areaprops.area.radius);
        output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.circleheight);


    } else
    if (areaprops.shape == "ground") {
        var flowrate = flowRate(areaprops.area.velocity);
        var pipevelocity = velocityOfPipe(areaprops.length)
        var preshutvolume = getPreshutVolume(flowrate, areaprops.area.time);
        output = groundlFlowRate(pipevelocity, preshutvolume, areaprops.area.gasoilratio, areaprops.shape);
    } else
    if (areaprops.shape == "water") {
        var flowrate = flowRate(areaprops.area.velocity);
        var pipevelocity = velocityOfPipe(areaprops.length);
        var preshutvolume = getPreshutVolume(flowrate, areaprops.area.time);
        var releasevolumefraction = getReleaseVolumeFraction(areaprops.pressure, areaprops.area.depth)
        output = totalWaterFlowRate(pipevelocity, preshutvolume, areaprops.area.gasoilratio, releasevolumefraction);
    } else
    if (areaprops.shape == "inclination") {
        var pressuredrop = getPressureOfSecondPoint(areaprops.pressure, areaprops.area.agidata.refpointelevation, areaprops.area.agidata.secondpointelevation, areaprops.density);
        output = inclinationFlowRate(areaprops.pressure,pressuredrop, areaprops.viscosity, areaprops.area.agidata.length, areaprops.diameter,areaprops.density);
    }
    return output;

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
    return flowrate;
}

function getPreshutVolume(flowrate, time) {
    var preshutvolume = (flowrate * 543.44 * time) / (1440 * 60); //multiplied flow rate with 543.44 to convert it into bbl/day
    return preshutvolume;
    // var bbllitrevalue = preshutvolume * 159; //Convert bbl into litre
    // return bbllitrevalue;
}

function velocityOfPipe(pipelength) {
    var diameter = 24 * 0.0833;
    var pi = Math.PI;
    var pipevelocity = (diameter / 24) * (diameter / 24) * pipelength * pi * 3280.84 * 0.028; //multiplied 3280.84 for covert km into feet cube and multiplied with 0.028 to convert cubic feet into cubic meter
    return pipevelocity;
}



function groundlFlowRate(pipevelocity, preshutvolume, gasoilratio) {
    var totalflowrate = (0.1781 * pipevelocity * gasoilratio) + preshutvolume;
    return totalflowrate;

}

function totalWaterFlowRate(pipevelocity, preshutvolume, gasoilratio, releasevolumefraction) {
    var belowwaterflowrate = ((0.1781 * pipevelocity * gasoilratio * releasevolumefraction) + preshutvolume);
    return belowwaterflowrate;
}

function getPressureOfSecondPoint(refpressure, refelevation, secondelevation, density) {
    var GRAVITY = 9.8;
    var secondPressurevalue = (refpressure) - ((GRAVITY * (secondelevation - refelevation) * density) / 100000);
    console.log('secondPressurevalue', secondPressurevalue);
    return secondPressurevalue;
}

function inclinationFlowRate(initialpressure,pressuresecond, viscosity, length, diameter,density) {
    var pressuredrop = initialpressure - pressuresecond;
    var diameterinmeter = diameter * 0.0254;
    var PI = Math.PI;
    var powdiameter = Math.pow(diameterinmeter, 4);
    var dynamicviscosity = viscosity * 0.00001 * density;
    var inclinationflowrate = (pressuredrop *100000 * PI * powdiameter) / (128 * 0.248 * length*1000);
    var finalinclination  = inclinationflowrate *1000;
    return finalinclination;
}

function getReleaseVolumeFraction(pressure, waterdepth) {
    var pamb = 0.44 * waterdepth * 0.0689476;
    var releasevolumefraction = pressure / pamb;
    var relativedata = mapStaticData(staticData, releasevolumefraction);
    return relativedata;
}

function mapStaticData(staticdata, volumefraction) {
    var frelative;
    for (var i = 0; i < staticdata.frelative.length; i++) {
        if (staticdata.frelative[i].range.from <= volumefraction && staticdata.frelative[i].range.to > volumefraction) {
            frelative = staticdata.frelative[i].value;
            console.log("frelative", frelative);
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
