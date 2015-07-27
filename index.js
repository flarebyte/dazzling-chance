'use strict';
var Joi = require('joi');
var _ = require('lodash');
var S = require('string');

var DEFAULT_RESOLUTION = 100;

var charSetSchema = Joi.object().keys({
    chars: Joi.string().min(1).required(),
    integer: Joi.number().integer().min(0).max(127),
});

var cfgSchema = Joi.object().keys({
    text: Joi.string().min(20).required(),
    resolution: Joi.number().integer().min(2).max(127),
    characters: Joi.array().min(1).items(charSetSchema)
});


var expandRange = function(str) {
    var hasRange = S(str).contains('-') && str.length >= 3;
    if (!hasRange) {
        return str;
    }
    var i = str.indexOf('-');
    var start = str.charCodeAt(i - 1);
    var finish = str.charCodeAt(i + 1);
    Joi.assert(finish, Joi.number().min(start));
    var repl = '';
    for (var j = start; j <= finish; j++) {
        repl += String.fromCharCode(j);
    }

    str = str.replace(str[i - 1] + "-" + str[i + 1], repl);

    return expandRange(str);
};


module.exports = function(cfg) {
    Joi.assert(cfg, cfgSchema);
    var text = cfg.text;
    var resolution = _.isUndefined(cfg.resolution) ? DEFAULT_RESOLUTION : cfg.resolution;
    var maxIdx = Joi.number().max(cfg.text.length - 1);
    var idx = -1;

    var createMapping = function() {
        var mapp = {};

        _.forEach(cfg.characters, function(charSet) {
            var expChars = expandRange(charSet.chars);
            for (var i = expChars.length - 1; i >= 0; i--) {
                mapp[expChars[i]] = charSet.integer + i;
            }

        });

        return mapp;
    };

    var mapping = createMapping();

    var nextChar = function() {
        idx++;
        Joi.assert(idx, maxIdx);
        return text[idx];

    };

    var nextCharCode = function() {
        return _.get(mapping, nextChar(), 100);
    };

    var nextMaxCode = function(max) {
        var i = nextCharCode();
        return i % max;
    };

    var nextUnitRatio = function() {
        return nextMaxCode(resolution) / resolution;
    };

    var nextFloat = function(min, max) {
        Joi.assert(min, Joi.number().max(max));
        Joi.assert(max, Joi.number().min(min));
        var diff = max - min;
        return (nextUnitRatio() * diff) + min;


    };

    var chance = {
        nextChar: nextChar,
        nextCharCode: nextCharCode,
        nextMaxCode: nextMaxCode,
        expandRange: expandRange,
        mapping: _.clone(mapping),
        nextUnitRatio: nextUnitRatio,
        nextFloat: nextFloat
    };

    return chance;
};