'use strict';
var Joi = require('joi');
var _ = require('lodash');
var S = require('string');
var math = require('mathjs');

var charSetSchema = Joi.object().keys({
    chars: Joi.string().min(1).required(),
    integer: Joi.number().integer().min(0).max(127),
});

var weightsSchema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    weights: Joi.array().items(Joi.number()).min(2)
});

var cfgSchema = Joi.object().keys({
    text: Joi.string().min(20).required(),
    resolution: Joi.number().integer().min(2).max(127),
    characters: Joi.array().items(charSetSchema).min(1),
    weighting: Joi.array().items(weightsSchema)
});

var nextParamsSchema = Joi.object().keys({
    weight: Joi.string(),
    min: Joi.number(),
    max: Joi.number(),
    list: Joi.array(),
    type: Joi.string().valid(['int', 'float', 'number', 'bool', 'string']).required()
});

var nextHighResParamsSchema = Joi.object().keys({
    min: Joi.number(),
    max: Joi.number(),
    minResolution: Joi.number().integer(),
    list: Joi.array(),
    type: Joi.string().valid(['int', 'float', 'number', 'string']).required()
});

var isPresent = function(value) {
    return !(_.isUndefined(value) || _.isNull(value));
};

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

    var normalizeWeights = function(value) {
        var weightsSum = _.sum(value);
        var lengthOfActual = value.length;
        var actualStepRes = 1.0 / lengthOfActual;
        var futureStepRes = 1.0 / resolution;

        var weight4Idx = function(n) {
            var total = 0;
            for (var i = n - 1; i >= 0; i--) {
                total += 1.0 * value[i] / weightsSum;
            }
            return total;
        };

        var rewriteSmoothLinear = function(list, idxFrom, idxTo, valueFrom, valueTo) {
            var coeff = 1.0 * (valueTo - valueFrom) / (idxFrom - idxTo);
            for (var i = idxFrom - 1; i > idxTo; i--) {
                var k = idxFrom - i;
                list[i] = rnd(valueFrom + (k * coeff));
            }
        };

        var r = [];
        var j = 0;
        var y = 0.0;
        var xWeight = 0;
        var yPrevious = 0;
        var iPrevious = 0;
        for (var i = 0; i < resolution; i++) {

            var x = 1.0 * i * futureStepRes;
            while (x > xWeight) {
                j++;
                y = rnd(1.0 * j * actualStepRes);
                rewriteSmoothLinear(r, i, iPrevious, y, yPrevious);
                iPrevious = i;
                yPrevious = y;
                xWeight = weight4Idx(j);

            }
            r.push(y);
        } //end for

        return r;
    };

    var createWeighting = function() {
        var mapp = {};
        _.forEach(cfg.weighting, function(weighting) {
            mapp[weighting.name] = normalizeWeights(weighting.weights);
        });
        return mapp;
    };

    var weighting = createWeighting();
    var weightingNames = _.keys(weighting);

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
        Joi.assert(numberList, Joi.array().items(Joi.number()).min(2));
        var ii = nextInt(0, numberList.length - 1);
        return numberList[ii];
    };

    var nextWeightUnitRatio = function(weight) {
        return nextNumber(weighting[weight]);
    };

    var nextWeightedFloat = function(weight, min, max) {
        Joi.assert(min, Joi.number().max(max));
        Joi.assert(max, Joi.number().min(min));
        Joi.assert(weight, Joi.string().valid(weightingNames));
        var diff = max - min;
        return rnd((nextWeightUnitRatio(weight) * diff) + min);
    };

    var nextWeightedInt = function(weight, min, max) {
        Joi.assert(min, Joi.number().integer().max(max));
        Joi.assert(max, Joi.number().integer().min(min));
        Joi.assert(weight, Joi.string().valid(weightingNames));
        var diff = max - min;
        return Math.round((nextWeightUnitRatio(weight) * diff) + min);
    };

    var nextWeightedBool = function(weight) {
        Joi.assert(weight, Joi.string().valid(weightingNames));
        return nextWeightUnitRatio(weight) > 0.5;
    };

    var nextWeightedNumber = function(weight, numberList) {
        Joi.assert(numberList, Joi.array().items(Joi.number()).min(2));
        Joi.assert(weight, Joi.string().valid(weightingNames));
        var ii = nextWeightedInt(weight, 0, numberList.length - 1);
        return numberList[ii];
    };

    var nextWeightedString = function(weight, stringList) {
        Joi.assert(stringList, Joi.array().items(Joi.string().min(1)).min(2));
        Joi.assert(weight, Joi.string().valid(weightingNames));
        var ii = nextWeightedInt(weight, 0, stringList.length - 1);
        return stringList[ii];
    };

    var next = function(params) {
        Joi.assert(params, nextParamsSchema);
        var hasWeight = isPresent(params.weight);

        if (hasWeight) {
            switch (params.type) {
                case 'int':
                    return nextWeightedInt(params.weight, params.min, params.max);
                case 'float':
                    return nextWeightedFloat(params.weight, params.min, params.max);
                case 'bool':
                    return nextWeightedBool(params.weight);
                case 'number':
                    return nextWeightedNumber(params.weight, params.list);
                case 'string':
                    return nextWeightedString(params.weight, params.list);

            }
        } else {
            switch (params.type) {
                case 'int':
                    return nextInt(params.min, params.max);
                case 'float':
                    return nextFloat(params.min, params.max);
                case 'bool':
                    return nextBool();
                case 'number':
                    return nextNumber(params.list);
                case 'string':
                    return nextString(params.list);

            }

        }
    };

    var nextX = function(n, params) {
        Joi.assert(n, Joi.number().integer().min(1));
        var r = [];
        for (var i = 0; i < n; i++) {
            r.push(next(params));
        }
        return r;
    };

    var nextHighRes = function(params) {
        Joi.assert(params, nextHighResParamsSchema);
        var hasList = params.type === 'number' || params.type === 'string';
        var extCode = 0;
        var extResolution = 1;
        var minResolution = hasList ? params.list.length : params.minResolution;

        while (extResolution < minResolution) {
            extCode = extCode + nextCharCode() * extResolution;
            extResolution = extResolution * resolution;
        }


        var hrUnitRatio = (extCode % extResolution) / extResolution;
        var min = hasList ? 0 : params.min;
        var max = hasList ? params.list.length - 1 : params.max;
        var diff = max - min;
        var floatingValue = math.round((hrUnitRatio * diff) + min, 9);
        var intValue = Math.round(floatingValue);

        switch (params.type) {
            case 'int':
                return intValue;
            case 'float':
                return floatingValue;
            case 'number':
                return params.list[intValue];
            case 'string':
                return params.list[intValue];

        }
    };

    var nextHighResX = function(n, params) {
        Joi.assert(n, Joi.number().integer().min(1));
        var r = [];
        for (var i = 0; i < n; i++) {
            r.push(nextHighRes(params));
        }
        return r;

    };

    var chance = {
        nextChar: nextChar,
        nextCharCode: nextCharCode,
        expandRange: expandRange,
        mapping: _.clone(mapping),
        weighting: weighting,
        resolution: _.clone(resolution),
        nextFloat: nextFloat,
        nextInt: nextInt,
        nextBool: nextBool,
        nextString: nextString,
        nextNumber: nextNumber,
        nextWeightedFloat: nextWeightedFloat,
        nextWeightedInt: nextWeightedInt,
        nextWeightedBool: nextWeightedBool,
        nextWeightedNumber: nextWeightedNumber,
        nextWeightedString: nextWeightedString,
        next: next,
        nextX: nextX,
        nextHighRes: nextHighRes,
        nextHighResX: nextHighResX
    };

    return chance;
};