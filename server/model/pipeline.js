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
    density: {
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

    specificgravity: {
        type: Number,
        required: true
    },
    gravity: {
        type: Number,
        required: true
    },
    viscosity: {
        type: Number,
        required: true
    },
    viscosityat100: {
        type: Number,
        required: true
    },
    rvp: {
        type: Number,
        required: true
    },
    pourpoint: {
        type: Number,
        required: true
    },
    sulfurweightage: {
        type: Number,
        required: true
    },
    saltcontent: {
        type: Number,
        required: true
    },
    microcarbonresidue: {
        type: Number,
        required: true
    },
    watercontent: {
        type: Number,
        required: true
    },
    bsw: {
        type: Number,
        required: true
    },
    totalacidvalue: {
        type: Number,
        required: true
    },
    flashpoint: {
        type: Number,
        required: true
    },
    tracemetals: {
        type: Number,
        required: true
    },
    lpgpotentials: {
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

Pipeline.statics.insertPipeline = function(requestDataArray, callback) {
    this.collection.insert(requestDataArray, callback);
};

var pipeline = mongoose.model('Pipeline', Pipeline);

/** export schema */
module.exports = {
    Pipeline: pipeline
};
