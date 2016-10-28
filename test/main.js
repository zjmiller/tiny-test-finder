"use strict";

var expect = require('chai').expect;
var findTests = require('../dist/findTests');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

describe('Test finder', function() {
  let tmpPath1;
  let tmpPath2;
  let tmpPath3;

  before(function() {
    tmpPath1 = fs.mkdtempSync('test-');
    fs.mkdirSync(path.resolve(tmpPath1, 'test'));
    fs.writeFileSync(path.resolve(tmpPath1, 'test', 'asdf'));

    tmpPath2 = fs.mkdtempSync('test-');
    fs.mkdirSync(path.resolve(tmpPath2, '__test__'));
    fs.writeFileSync(path.resolve(tmpPath2, '__test__', 'qwer'));

    tmpPath3 = fs.mkdtempSync('test-');
    fs.mkdirSync(path.resolve(tmpPath3, 'not-test'));
    fs.writeFileSync(path.resolve(tmpPath3, 'not-test', 'uiop'));
  });

  it('should find tests', function() {
    const result = findTests();
    expect(result).to.have.members(
      [
        path.resolve(__dirname, __filename),
        path.resolve(tmpPath1, 'test', 'asdf'),
        path.resolve(tmpPath2, '__test__', 'qwer'),
      ]
    );
  });

  it('should allow more test dir names', function() {
    const result = findTests({ posTestDirNames: ['test'] });
    expect(result).to.have.members(
      [
        path.resolve(__dirname, __filename),
        path.resolve(tmpPath1, 'test', 'asdf'),
      ]
    );
  });

  it('should allow less test dir names', function() {
    const result = findTests({ posTestDirNames: ['test', '__test__', 'not-test'] });
    expect(result).to.have.members(
      [
        path.resolve(__dirname, __filename),
        path.resolve(tmpPath1, 'test', 'asdf'),
        path.resolve(tmpPath2, '__test__', 'qwer'),
        path.resolve(tmpPath3, 'not-test', 'uiop'),
      ]
    );
  });

  it('should allow us to specify dirs to not recursively search', function() {
    const result = findTests({ dontSearch: ['node_modules', tmpPath1] });
    expect(result).to.have.members(
      [
        path.resolve(__dirname, __filename),
        path.resolve(tmpPath2, '__test__', 'qwer'),
      ]
    );
  });

  after(function(done){
    rimraf(tmpPath1, () =>
      rimraf(tmpPath2, () =>
        rimraf(tmpPath3, () => done())
      )
    );
  });
});
