/*global describe, it */
'use strict';
var assert = require('chai').assert;
var dazzlingChance = require('../');

var cfgWilde = {
    text: "The only difference between the saint and the sinner is that every saint has a past, and every sinner has a future. (O.Wilde)",
    characters: [{
        chars: "0-9a-zA-Z ,().",
        integer: 0
    }],
    weighting: [{
        name: "fibonacci",
        weights: [1, 2, 3, 5, 8, 13, 21, 2]
    }]
};

describe('dazzling-chance node module', function() {
    it('must return the next char', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal('T', chance.nextChar());
        assert.equal('h', chance.nextChar());
        assert.equal('e', chance.nextChar());
    });

    it('must return the next char', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(67, chance.resolution);

    });

    it('must return the next char code', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(55, chance.nextCharCode());
        assert.equal(17, chance.nextCharCode());
        assert.equal(14, chance.nextCharCode());
        assert.equal(62, chance.nextCharCode());
        assert.equal(24, chance.nextCharCode());
        assert.equal(23, chance.nextCharCode());
    });


    it('must expand the range', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal('abc', chance.expandRange('abc'));
        assert.equal('a-', chance.expandRange('a-'));
        assert.equal('bcdef', chance.expandRange('b-f'));
        assert.equal('abcdef1234', chance.expandRange('ab-f1-4'));
    });

    it('must return mapping', function() {
        var chance = dazzlingChance({
            text: "qwertyuopasdfghjklzxcvbnm",
            characters: [{
                chars: "a-z",
                integer: 10
            }]
        });
        assert.equal(10, chance.mapping['a']);
        assert.equal(12, chance.mapping['c']);
        assert.equal(35, chance.mapping['z']);
    });

    it('must return weighting', function() {
        var chance = dazzlingChance({
            text: "qwertyuopasdfghjklzxcvbnm",
            characters: [{
                chars: "0-9a-z",
                integer: 0
            }],
            weighting: [{
                name: "fibonacci",
                weights: [1, 2, 3, 5, 8, 13, 21, 2]
            }]

        });
        var fibonacci = chance.weighting['fibonacci'];
        assert.equal(fibonacci.length, 36);
        assert.deepEqual(fibonacci, [0, 0.25, 0.375, 0.438, 0.5, 0.531, 0.563, 0.594, 0.625, 0.65, 0.675, 0.7, 0.725, 0.75, 0.766, 0.781, 0.797, 0.813, 0.828, 0.844, 0.859, 0.875, 0.884, 0.893, 0.902, 0.911, 0.92, 0.929, 0.938, 0.946, 0.955, 0.964, 0.973, 0.982, 0.991, 1]);

    });

    it('must return weighting if descending', function() {
        var chance = dazzlingChance({
            text: "qwertyuopasdfghjklzxcvbnm",
            characters: [{
                chars: "0-9a-z",
                integer: 0
            }],
            weighting: [{
                name: "fibonacci",
                weights: [21, 13, 8, 5, 3, 2, 1]
            }]

        });
        var fibonacci = chance.weighting['fibonacci'];
        assert.equal(fibonacci.length, 36);
        assert.deepEqual(fibonacci, [0, 0.143, 0.153, 0.163, 0.174, 0.184, 0.194, 0.204, 0.214, 0.225, 0.235, 0.245, 0.255, 0.266, 0.276, 0.286, 0.302, 0.318, 0.334, 0.35, 0.365, 0.381, 0.397, 0.413, 0.429, 0.457, 0.486, 0.514, 0.543, 0.571, 0.619, 0.666, 0.714, 0.786, 0.857, 0.857]);

    });



    it('must return mapping with two rules', function() {
        var chance = dazzlingChance({
            text: "qwertyuopasdfghjklzxcvbnm",
            characters: [{
                chars: "a-z",
                integer: 10
            }, {
                chars: "0-9",
                integer: 0
            }]
        });
        assert.equal(1, chance.mapping['1']);
        assert.equal(5, chance.mapping['5']);
        assert.equal(10, chance.mapping['a']);
        assert.equal(12, chance.mapping['c']);
        assert.equal(35, chance.mapping['z']);
    });


    it('must return the next float', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(2.463, chance.nextFloat(0, 3));
        assert.equal(-4.925, chance.nextFloat(-10, 10));
        assert.equal(-0.582, chance.nextFloat(-1, 1));
        assert.equal(0.851, chance.nextFloat(-1, 1));
    });

    it('must return the next int', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(2, chance.nextInt(0, 3));
        assert.equal(-5, chance.nextInt(-10, 10));
        assert.equal(-58, chance.nextInt(-100, 100));
        assert.equal(85, chance.nextInt(-100, 100));
    });

    it('must return the next bool', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.isTrue(chance.nextBool(), 'A');
        assert.isFalse(chance.nextBool(), 'B');
        assert.isFalse(chance.nextBool(), 'C');
        assert.isTrue(chance.nextBool(), 'D');
    });

    it('must return the next string', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal('d', chance.nextString(['a', 'b', 'c', 'd', 'e']), 'A');
        assert.equal('b', chance.nextString(['a', 'b', 'c', 'd', 'e']), 'B');
        assert.equal('b', chance.nextString(['a', 'b', 'c', 'd', 'e']), 'C');
        assert.equal('e', chance.nextString(['a', 'b', 'c', 'd', 'e']), 'D');
    });

    it('must return the next number', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(68, chance.nextNumber([36, 47, 3, 68, 34]), 'A');
        assert.equal(47, chance.nextNumber([36, 47, 3, 68, 34]), 'B');
        assert.equal(47, chance.nextNumber([36, 47, 3, 68, 34]), 'C');
        assert.equal(34, chance.nextNumber([36, 47, 3, 68, 34]), 'D');
    });

    it('must return the next weighted float', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(2.841, chance.nextWeightedFloat('fibonacci', 0, 3));
        assert.equal(3.26, chance.nextWeightedFloat('fibonacci', -10, 10));
        assert.equal(0.25, chance.nextWeightedFloat('fibonacci', -1, 1));
        assert.equal(0.962, chance.nextWeightedFloat('fibonacci', -1, 1));
    });

    it('must return the next weighted int', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(3, chance.nextWeightedInt('fibonacci', 0, 3));
        assert.equal(3, chance.nextWeightedInt('fibonacci', -10, 10));
        assert.equal(0, chance.nextWeightedInt('fibonacci', -1, 1));
        assert.equal(1, chance.nextWeightedInt('fibonacci', -1, 1));
    });

    it('must return the next weighted bool', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.isTrue(chance.nextWeightedBool('fibonacci'));
        assert.isTrue(chance.nextWeightedBool('fibonacci'));
        assert.isTrue(chance.nextWeightedBool('fibonacci'));
        assert.isTrue(chance.nextWeightedBool('fibonacci'));
    });

    it('must return the next weighted number', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(34, chance.nextWeightedNumber('fibonacci', [36, 47, 3, 68, 34]), 'A');
        assert.equal(68, chance.nextWeightedNumber('fibonacci', [36, 47, 3, 68, 34]), 'B');
        assert.equal(68, chance.nextWeightedNumber('fibonacci', [36, 47, 3, 68, 34]), 'C');
        assert.equal(34, chance.nextWeightedNumber('fibonacci', [36, 47, 3, 68, 34]), 'D');
    });

    it('must return the next weighted string', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal('e', chance.nextWeightedString('fibonacci', ['a', 'b', 'c', 'd', 'e']), 'A');
        assert.equal('d', chance.nextWeightedString('fibonacci', ['a', 'b', 'c', 'd', 'e']), 'B');
        assert.equal('d', chance.nextWeightedString('fibonacci', ['a', 'b', 'c', 'd', 'e']), 'C');
        assert.equal('e', chance.nextWeightedString('fibonacci', ['a', 'b', 'c', 'd', 'e']), 'D');
    });

    it('must return the next value', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.equal(2.841, chance.next({
            type: 'float',
            weight: 'fibonacci',
            min: 0,
            max: 3
        }));
        assert.equal(-5, chance.next({
            type: 'int',
            min: -10,
            max: 10
        }));

        assert.equal('d', chance.next({
            weight: 'fibonacci',
            type: 'string',
            list: ['a', 'b', 'c', 'd', 'e'],
        }));
    });

    it('must return the next value n times', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.deepEqual([8.209, 2.537, 2.09, 9.254], chance.nextX(4, {
            type: 'float',
            min: 0,
            max: 10
        }));

    });

    it('must return the next value high resolution', function() {
        var chance = dazzlingChance(cfgWilde);
        var arrInt = [];
        var arrStr = [];
        for (var i = 200 - 1; i >= 0; i--) {
            arrInt[i] = i;
            arrStr[i] = "str" + i;
        }

        assert.equal(265.98351526, chance.nextHighRes({
            type: 'float',
            minResolution: 1000,
            min: 0,
            max: 1000
        }));
        assert.equal(928, chance.nextHighRes({
            type: 'int',
            minResolution: 1000,
            min: 0,
            max: 1000
        }));

        assert.equal('str69', chance.nextHighRes({
            type: 'string',
            list: arrStr,
        }));

        assert.equal(102, chance.nextHighRes({
            type: 'string',
            list: arrInt,
        }));
    });

    it('must return the next value high resolution', function() {
        var chance = dazzlingChance(cfgWilde);
        assert.deepEqual([266, 928, 349, 512, 208, 228, 212, 215, 184, 928], chance.nextHighResX(10, {
            type: 'int',
            minResolution: 1000,
            min: 0,
            max: 1000
        }));

    });


});