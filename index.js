'use strict';
var Joi = require('joi');
var _ = require('lodash');
var S = require('string');
var math = require('mathjs');

var charSetSchema = Joi.object().keys({
    chars: Joi.string().min(1).required(),
    integer: Joi.number().integer().min(0).max(127),
});

var cfgSchema = Joi.object().keys({
    text: Joi.string().min(20).required(),
    resolution: Joi.number().integer().min(2).max(127),
    characters: Joi.array().items(charSetSchema).min(1)
});

var rnd = function(value) {
    return math.round(value, 3);
};


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
    var maxIdx = Joi.number().max(cfg.text.length - 1);
    var idx = -1;
    var defaultResolution = 0;
    var createMapping = function() {
        var mapp = {};

        _.forEach(cfg.characters, function(charSet) {
            var expChars = expandRange(charSet.chars);
            defaultResolution = defaultResolution + expChars.length;
            for (var i = expChars.length - 1; i >= 0; i--) {
                mapp[expChars[i]] = charSet.integer + i;
            }

        });

        return mapp;
    };

    var mapping = createMapping();
    var resolution = _.isUndefined(cfg.resolution) ? defaultResolution : cfg.resolution;

    var nextChar = function() {
        idx++;
        Joi.assert(idx, maxIdx);
        return text[idx];

    };

    var nextCharCode = function() {
        var character = nextChar();
        return _.get(mapping, character, character.charCodeAt(0));
    };

    var nextUnitRatio = function() {
        return (nextCharCode() % resolution) / resolution;
    };

    var nextFloat = function(min, max) {
        Joi.assert(min, Joi.number().max(max));
        Joi.assert(max, Joi.number().min(min));
        var diff = max - min;
        return rnd((nextUnitRatio() * diff) + min);
    };

    var nextInt = function(min, max) {
        Joi.assert(min, Joi.number().integer().max(max));
        Joi.assert(max, Joi.number().integer().min(min));
        var diff = max - min;
        return Math.round((nextUnitRatio() * diff) + min);
    };

    var nextBool = function() {
        return nextUnitRatio() > 0.5;
    };

    var nextString = function(stringList) {
        Joi.assert(stringList, Joi.array().items(Joi.string().min(1)).min(2));
        var ii = nextInt(0, stringList.length - 1);
        return stringList[ii];
    };

    var nextNumber = function(numberList) {
        Joi.assert(numberList, Joi.array().items(Joi.number().min(1)).min(2));
        var ii = nextInt(0, numberList.length - 1);
        return numberList[ii];
    };

    var chance = {
        nextChar: nextChar,
        nextCharCode: nextCharCode,
        expandRange: expandRange,
        mapping: _.clone(mapping),
        resolution: _.clone(resolution),
        nextFloat: nextFloat,
        nextInt: nextInt,
        nextBool: nextBool,
        nextString: nextString,
        nextNumber: nextNumber
    };

    return chance;
};