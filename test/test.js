/*global describe, it */
'use strict';
var assert = require('assert');
var dazzlingChance = require('../');

describe('dazzling-chance node module', function () {
  it('must have at least one test', function () {
    dazzlingChance();
    assert(true, 'I was too lazy to write any tests. Shame on me.');
  });
});
