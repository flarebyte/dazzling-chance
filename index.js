'use strict';
var Joi = require('joi');
var _ = require('lodash');

var schema = Joi.object().keys({
    text: Joi.string().min(20).required(),
    modulus: Joi.number().integer().min(2).max(127)
});

module.exports = function(cfg) {
    Joi.assert(cfg, schema);
    var text = cfg.text;
    var modulus = _.isUndefined(cfg.modulus)? 100: cfg.modulus;
    var maxIdx = Joi.number().max(cfg.text.length-1);
    var idx = -1;

    var nextCharCode = function() {
    	idx++;
    	Joi.assert(idx,maxIdx);
    	return text.charCodeAt(idx);

    };

    var nextMaxCode = function(max) {
    	var i = nextCharCode();
    	return i % max;
    };

    var nextUnitRatio= function() {
    	console.log(modulus);
    	return nextMaxCode(modulus) / modulus;
    };

    var nextFloat = function(min, max) {
    	Joi.assert(min, Joi.number().max(max));
    	Joi.assert(max, Joi.number().min(min));
    	var diff = max -  min;
    	return (nextUnitRatio() * diff) + min;
    	

    };	

    var chance = {
        nextCharCode: nextCharCode,
        nextMaxCode: nextMaxCode,
        nextUnitRatio: nextUnitRatio,
        nextFloat: nextFloat
    };

    return chance;
};