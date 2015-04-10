
define(function(require) {

	var Input = require('dist/reactant.amd.js').Input,
		bdd = require('intern!bdd'),
		expect = require('intern/chai!expect'),
		describe = bdd.describe,
		it = bdd.it;

	describe('Input', function() {

		it('should be a function', function() {
			expect(Input).to.be.a('function');
		});

		it('should be a constructor', function() {
			expect(new Input(function(){})).to.be.an.instanceof(Input);
		});

		describe('#valueOf', function() {

			it('should be a function', function() {
				expect(new Input().valueOf).to.be.a('function');
			});

			it('should return a non-function value passed to the constructor', function() {
				expect(new Input(1).valueOf()).to.equal(1);
			});

			it('should delegate to a function passed to the constructor', function() {
				expect(new Input(function() { return 2 }).valueOf()).to.equal(2);
			});

		});

	});

});