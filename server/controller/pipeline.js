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
            
            Pipeline.updatePipeline(request.params.id, request.payload, function(err, result) {
                if(err){
                    if ( constants.kDuplicateKeyError === err.code || constants.kDuplicateKeyErrorForMongoDBv2_1_1 === err.code ) {
                        reply(Boom.forbidden("Update Failed"));
                    } else return reply( Boom.badImplementation(err) ); // HTTP 403
                }
                else{
                    return reply(result);
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
