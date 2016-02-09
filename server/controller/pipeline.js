'use strict';

var Boom = require('boom'),
    Config = require('../config/config'),
    constants = require('../Utility/constants').constants,
    Jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    Pipeline = require('../model/pipeline').Pipeline,
    kpData = require('../kp.json'),
    agiData = require('../agi.json'),
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
                data1.fromCity = "Gujarat",
                    data1.toCity = "Barmer",
                    data1.pipeName = "Gujrat to Barmer",
                    data1.length = 700,
                    data1.diameter = 24,
                    data1.density = 877.4,
                    data1.pressure = 31,
                    data1.viscosity = 28.28,
                    data1.viscosityat100 =10.86,
                    data1.rvp = 8.0,
                    data1.pourpoint=42,
                    data1.specificgravity=0.8779,
                    data1.gravity=29.68,
                    data1.sulfurweightage=0.09,
                    data1.lpgpotentials=0.2,
                    data1.saltcontent=1.3,
                    data1.microcarbonresidue=4.47,
                    data1.watercontent=0.02,
                    data1.bsw=0,
                    data1.totalacidvalue=0.28,
                    data1.flashpoint=30.5,
                    data1.tracemetals=4.1

                var data2 = {};
                data2.fromCity = "Barmer",
                    data2.toCity = "Salaya",
                    data2.pipeName = "Barmer to Salaya",
                    data2.length = 400,
                    data2.diameter = 10,
                    data2.density = 870,
                    data2.pressure = 21,
                    data2.viscosity = 28.28,
                    data2.viscosityat100 =10.86,
                    data2.rvp = 8.0,
                    data2.pourpoint=42,
                    data2.specificgravity=0.8779,
                    data2.gravity=29.68,
                    data2.sulfurweightage=0.09,
                    data2.lpgpotentials=0.2,
                    data2.saltcontent=1.3,
                    data2.microcarbonresidue=4.47,
                    data2.watercontent=0.02,
                    data2.bsw=0,
                    data2.totalacidvalue=0.28,
                    data2.flashpoint=30.5,
                    data2.tracemetals=4.1

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

/** 
    function that return json  data for AGI graph   
**/

exports.getAGIData = {
    handler: function(request, reply) {
        reply(staticData.agivalue);
    }
};

exports.getKpPoint = {
    handler: function(request, reply) {
        reply(kpData.kpvalue);
    }
};


/** 
    function that return final volume and rupture volume and flow rate of incilation 
**/

var calcVolume = function(areaprops) {
    console.log('areaprops', areaprops);
    var inchtometer = 0.0254;
    var res,
        eqvDim,
        output,
        velocity = 1.1,
        gasoilratio = 1;
    if (areaprops.shape == "Rectangular") {
        res = parseFloat(areaprops.area.length) * parseFloat(areaprops.area.breadth);
        areaprops.appearance ===undefined ? output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.rectheight, velocity,areaprops.area.diameter):output = spmVolume(res ,areaprops.appearance)
    } else
    if (areaprops.shape == "Triangular") {
        var s = (parseFloat(areaprops.area.sidea) + parseFloat(areaprops.area.sideb) + parseFloat(areaprops.area.sidec)) / 2;
        res = Math.sqrt(s * (s - parseFloat(areaprops.area.sidea)) * (s - parseFloat(areaprops.area.sideb)) * (s - parseFloat(areaprops.area.sidec)));
        output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.triheight, velocity,areaprops.area.diameter);
    } else
    if (areaprops.shape == "Square") {
        res = parseFloat(areaprops.area.sidelength) * inchtometer * inchtometer * parseFloat(areaprops.area.sidelength);
        output = oldspillVolume(res, areaprops.area.squareheight, velocity,areaprops.area.diameter);

    } else
    if (areaprops.shape == "Circular") {
        res = Math.PI * parseFloat(areaprops.area.radius) * parseFloat(areaprops.area.radius);
        areaprops.appearance ===undefined? output = oldspillVolume(res * inchtometer * inchtometer, areaprops.area.circleheight, velocity,areaprops.area.diameter):output = spmVolume(res , areaprops.appearance)
    } else
    if (areaprops.shape == "ground") {
        var flowrate = flowRate(velocity,areaprops.diameter);
        var pipevelocity = velocityOfPipe(areaprops.length,areaprops.diameter)
        var preshutvolume = getPreshutVolume(flowrate, areaprops.area.time);
        output = groundlFlowRate(pipevelocity, preshutvolume, gasoilratio, areaprops.shape);
    } else
    if (areaprops.shape == "water") {
        var flowrate = flowRate(velocity,areaprops.diameter);
        var pipevelocity = velocityOfPipe(areaprops.length,areaprops.diameter);
        var preshutvolume = getPreshutVolume(flowrate, areaprops.area.time);
        var releasevolumefraction = getReleaseVolumeFraction(areaprops.pressure, areaprops.area.depth)
        output = totalWaterFlowRate(pipevelocity, preshutvolume, gasoilratio, releasevolumefraction);
    } else
    if (areaprops.shape == "inclination") {
        var kpLength = getKpLength(areaprops.kp);
        output = getFlowRateOnIncilaation(areaprops.density,areaprops.heightdiffrence, areaprops.viscosity,areaprops.area.diameter,kpLength);
    }
    return output;

}

/**
 * function that return Oil Spill per hour for Rupture shape
 * Formula used : (area * root square of 2gh)
 * @return litres - number
 */

var oldspillVolume = function(area, height, velocity) {
    var coefficientOfDishcharge = 0.62;
    var barrels = parseFloat(Math.round(coefficientOfDishcharge * area * velocity * 6.28981 * 3600 * 100) / 100);
    return (barrels / 0.0086485).toFixed(2);        
}


/** 
    function that return Flow Rate of pipeline

    Formula used : (pi/4*square of diameter * velocity)

**/
function flowRate(velocity,diametervalue) {
    var diameter = diametervalue * 0.0833;
    var pi = Math.PI;
    var flowrate = (pi / 4) * diameter * diameter * velocity * 3.28 * 28.3168; //multiplied 3.28 to convert into m/s to foot/sec and multiplied with 28.3168 to convert litres/sec
    return flowrate;
}

/** 
    function that return Pre Shut Volume of pipeline

    Formula used : ((flow rate of pipeline * time)/1440)
**/
function getPreshutVolume(flowrate, time) {
    var preshutvolume = (flowrate * 543.44 * time) / (1440 * 60); //multiplied flow rate with 543.44 to convert it into bbl/day
    return preshutvolume;
    // var bbllitrevalue = preshutvolume * 159; //Convert bbl into litre
    // return bbllitrevalue;
}

/** 
    function that return Velocity of pipe

    Formula used : ((square of diameter/24) * pipeline length * pi)

**/

function velocityOfPipe(pipelength,diametervalue) {
    console.log('diametervalue',diametervalue);
    var diameter = diametervalue * 0.0833;
    var pi = Math.PI;
    var pipevelocity = (diameter / 24) * (diameter / 24) * pipelength * pi * 3280.84 * 0.028; //multiplied 3280.84 for covert km into feet cube and multiplied with 0.028 to convert cubic feet into cubic meter
    return pipevelocity;
}


/** 
    function that return Maximum spill volume flow rate below ground
    Formula used : ((0.1781 *pipevelocity*gasoilratio) + volume before pre shutdown)

    Note:We will not consider release volume fraction in this case
**/
function groundlFlowRate(pipevelocity, preshutvolume, gasoilratio) {
    var totalflowrate = ((0.1781 * pipevelocity * gasoilratio) + preshutvolume).toFixed(2);
    return totalflowrate;

}

/** 
    function that return Maximum spill volume flow rate below water
    Formula used : ((0.1781 *pipevelocity*gasoilratio * releasevolumefraction) + volume before pre shutdown)
**/

function totalWaterFlowRate(pipevelocity, preshutvolume, gasoilratio, releasevolumefraction) {
    var belowwaterflowrate = (((0.1781 * pipevelocity * gasoilratio * releasevolumefraction) + preshutvolume)).toFixed(2);
    return belowwaterflowrate;
}

/** 
    function that return second pressure Point:
    Formula used : (referencepressure - ((GRAVITY)*(secondelevationpoint - referenceelevation)*density)/100000 
    Divided by 100000 to convert into bar
**/

function getKpLength(kp){
    for(var i=0;i<agiData.length;i++){
        if(kp.kp <= agiData[i].distance){
            return {
                Lls: Math.min(kp.kp - agiData[i-1].distance,1),
                Rls: Math.min(agiData[i+1].distance - kp.kp,1)
            }
        }
    }
}

/** 
    function that return incilation flow rate 
    Formula used : (Density *pi*(diameter*diameter*diameter*diameter))/128*viscosity*length(in meter)
**/

function getFlowRateOnIncilaation(density,heightdifference,viscosity,diameter,distancedifference){
    var diameterinmeter = diameter * 0.0254,
    PI = Math.PI,
    powdiameter = Math.pow(diameterinmeter, 4),
    dynamicviscosity = viscosity * 0.00001 * density;
    var getDeltaValue = (heightdifference.leftHeight/distancedifference.Lls) + (heightdifference.rightHeight/distancedifference.Rls)
    var getIncilationFlowRate = ((density * 10000 * PI * powdiameter)/(128 * dynamicviscosity  * 1000));
    var outputFlowRate = (getIncilationFlowRate * getDeltaValue).toFixed(2);
    return outputFlowRate;

}

function getPressureOfSecondPoint(refpressure, refelevation, secondelevation, density) {
    var GRAVITY = 9.8;
    var secondPressurevalue = (refpressure) - ((GRAVITY * (secondelevation - refelevation) * density) / 100000);
    return secondPressurevalue;
}


/** 
    function that return incilation flow rate 
    Formula used : (Pressure Drop *pi*(diameter*diameter*diameter*diameter))/128*viscosity*length(in meter)
**/
function inclinationFlowRate(initialpressure, pressuresecond, viscosity, length, diameter, density) {
    var pressuredrop = initialpressure - pressuresecond;
    var diameterinmeter = diameter * 0.0254;
    var PI = Math.PI;
    var powdiameter = Math.pow(diameterinmeter, 4);
    var dynamicviscosity = viscosity * 0.00001 * density;
    var inclinationflowrate = (pressuredrop * 100000 * PI * powdiameter) / (128 * dynamicviscosity * length * 1000);
    var finalinclination = (inclinationflowrate * 1000).toFixed(2);
    return finalinclination;
}



/** 
    function that relative data for volume  
    Formula used : (Initial Pressure/pressure of amb)
**/

function getReleaseVolumeFraction(pressure, waterdepth) {
    var pamb = 0.44 * waterdepth * 0.0689476;
    var releasevolumefraction = pressure / pamb;
    var relativedata = mapStaticData(staticData, releasevolumefraction);
    return relativedata;
}

/** 
    function that release volume fraction data for volume  
**/
function mapStaticData(staticdata, volumefraction) {
    var frelative;
    for (var i = 0; i < staticdata.frelative.length; i++) {
        if (staticdata.frelative[i].range.from <= volumefraction && staticdata.frelative[i].range.to > volumefraction) {
            frelative = staticdata.frelative[i].value;
        }
    }
    return frelative;
}

/** 
    function that return spm volume in meter cube 
**/
function spmVolume(area, appearancevalue) {
    var parseAppearance = JSON.parse(appearancevalue);
    var volume;
    volume  = (area * parseAppearance.coveragearea * parseAppearance.thickness).toFixed(2);
    return volume;
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
