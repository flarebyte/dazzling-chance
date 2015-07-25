/*global describe, it */
'use strict';
var assert = require('chai').assert;
var dazzlingChance = require('../');

var cfgWilde = {
	text: "The only difference between the saint and the sinner is that every saint has a past, and every sinner has a future. (O.Wilde)"
};

describe('dazzling-chance node module', function () {
  it('must return the next char code', function () {
    var chance = dazzlingChance(cfgWilde);
    assert.equal(84,chance.nextCharCode());
    assert.equal(104,chance.nextCharCode());
    assert.equal(101,chance.nextCharCode());
    assert.equal(32,chance.nextCharCode());
    assert.equal(111,chance.nextCharCode());
    assert.equal(110,chance.nextCharCode());
  });

  it('must return the next max code', function () {
    var chance = dazzlingChance(cfgWilde);
    assert.equal(4,chance.nextMaxCode(10));
    assert.equal(8,chance.nextMaxCode(16));
  });

  it('must return the next unit ratio', function () {
    var chance = dazzlingChance(cfgWilde);
    assert.equal(0.84,chance.nextUnitRatio());
    assert.equal(0.04,chance.nextUnitRatio());
  });

  it('must return the next float', function () {
    var chance = dazzlingChance(cfgWilde);
    assert.equal(2.52,chance.nextFloat(0,3));
    assert.equal(-9.2,chance.nextFloat(-10,10));
    assert.equal(-0.98,chance.nextFloat(-1,1));
    assert.equal(-0.36,chance.nextFloat(-1,1));
  });
});
