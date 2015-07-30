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

});