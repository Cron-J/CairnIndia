'use strict';

var Boom = require('boom'),
    Config = require('../config/config'),
    constants = require('../Utility/constants').constants,
    Jwt = require('jsonwebtoken'),
    Pipeline = require('../model/pipeline').Pipeline;

var privateKey = Config.key.privateKey;

exports.createPipeLine = {
    handler: function(request, reply) {
                Pipeline.savePipeline( request.payload, function(err, user) {
                    if (!err) {
                        reply( "Pipeline created successfully" );
                    } else {
                        if ( constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code ) {
                            reply(Boom.forbidden("user name already registered"));
                        } else reply( Boom.forbidden(err) ); // HTTP 403
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
                        if ( constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code ) {
                            reply(Boom.forbidden("error"));
                        } else reply( Boom.forbidden(err) ); // HTTP 403
                    }
        });
    }
};


exports.getPipeLinebyId = {
    handler: function(request, reply) {
                Pipeline.findPipeLineById(request.params.id ,function(err, result) {
                    if (!err) {
                        reply(result);
                    } else {
                        if ( constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code ) {
                            reply(Boom.forbidden("error"));
                        } else reply( Boom.forbidden(err) ); // HTTP 403
                    }
        });
    }
};


exports.updatePipeline = {
    handler: function(request, reply) {
        Pipeline.findPipeLineById(request.params.id, function(err, result) {
            if (!err) {
                updateHelper(request.payload, result);
                 Pipeline.updatePipeline(result,function(err, result) {
                      if (!err) {
                          reply(result);
                      } else {
                           if (11000 === err.code || 11001 === err.code) {
                                  reply(Boom.forbidden("please provide another user id, it already exist"));
                          }
                          else reply(Boom.forbidden(err)); // HTTP 403
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
            
            Pipeline.removePipeline(request.params.id,function(err, result) {
                if(err){
                    if ( constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code ) {
                        reply(Boom.forbidden("Update Failed"));
                    } else return reply( Boom.badImplementation(err) ); // HTTP 403
                }
                else{
                    return reply("Pipeline Deleted");
                }
            });

    }
};

var updateHelper = function(requestData, originalData) {
    for (var req in requestData) {
        if (requestData[req] === ' ') {
            originalData[req] = ' ';
        } else {
            originalData[req] = requestData[req];
        }
    }
};