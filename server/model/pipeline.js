'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    constants = require('../Utility/constants').constants,
    validator = require('mongoose-validators');

/**
 * @module  User
 * @description contain the details of Attribute
 */

var Pipeline = new Schema({

    /** 
      Name of Pipeline
    */
    pipeName: {
        type: String,
        required: true
    },
    /** 
      user first Name; must be a string, unique, required, should have minimum length 3 and maximum 20.
    */
    length: {
        type: Number,
        required: true
    },
    /** 
      user last Name; must be a string, unique, required, should have minimum length 3 and maximum 20.
    */
    fromCity: {
        type: String,
        required: true
    },
    /** 
      user email; must be a valid email, lowercase, required, should have minimum length 5 and maximum 50.
    */
    toCity: {
        type: String,
        required: true
    },
    /** 
       Diameter of the pipe
    */
    diameter: {
        type: Number,
        required: true,
    },


    /**
     * createdBy must be string who has created user.
     */
    temperature: {
        type: Number,
        required: true
    },
    /**
     * updatedBy must be string who has updated user recently.
     */
    pressure: {
        type: Number,
        required: true
    },

    viscosity: {
        type: Number,
        required: true
    },
    /** 
      Scope. It can only contain string, is required field, and should have value from enum array.
    */
    scope: {
        type: String,
        enum: ['Admin', 'User'],
    }

});



Pipeline.statics.savePipeline = function(requestData, callback) {
    this.create(requestData, callback);
};


Pipeline.statics.updatePipeline = function(pipelinedata, callback) {
    pipelinedata.save(callback);
};


Pipeline.statics.removePipeline = function(id, callback) {
    this.find({
        '_id': id
    }).remove(callback);
};

Pipeline.statics.findPipeLine = function(callback) {
    this.find({}, callback);
};


Pipeline.statics.findPipeLineById = function(id, callback) {
    this.findOne({
        '_id': id
    }, callback);
};


var pipeline = mongoose.model('Pipeline', Pipeline);

/** export schema */
module.exports = {
    Pipeline: pipeline
};
