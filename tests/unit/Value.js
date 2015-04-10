
define(function(require) {

	var Value = require('dist/reactant.amd.js').Value,
		bdd = require('intern!bdd'),
		expect = require('intern/chai!expect'),
		describe = bdd.describe,
		it = bdd.it;

	describe('Value', function() {

		it('should be a function', function() {
			expect(Value).to.be.a('function');
		});

		it('should be a constructor', function() {
			expect(new Value(0)).to.be.an.instanceof(Value);
		});

		describe('#valueOf', function() {

			it('should be a function', function() {
				expect(new Value().valueOf).to.be.a('function');
			});

			it('should return the underlying value', function() {
				[
					1,
					'1',
					{},
					[],
					new Date(),
					true,
					false,
					undefined,
					null
				].forEach(function(v) {
					expect(new Value(v).valueOf()).to.equal(v);
				});
			});

		});

		describe('#set', function() {

			it('should be a function', function() {
				expect(new Value().set).to.be.a('function');
			});

			it('should set the underlying value', function() {
				var a = 1,
					b = {},
					v = new Value(a);
				expect(v.valueOf()).to.equal(a);
				v.set(b);
				expect(v.valueOf()).to.equal(b);
			});

			it('should propagate the value when changed', function() {
				var a = 1,
					b = '1',
					r = a,
					f = function() { r = this.valueOf(); },
					v = new Value(a);
				v.subscribe(f);
				v.set(b);
				expect(r).to.equal(b);
			});

			it('should not propagate the value when not changed', function() {
				var a = 1,
					b = a,
					r = 2,
					f = function() { r = this.valueOf(); },
					v = new Value(a);
				v.subscribe(f);
				v.set(b);
				expect(r).to.equal(2);
			});

			it('should return the caller', function() {
				var v = new Value(0);
				expect(v.set(0)).to.equal(v);
				expect(v.set(1)).to.equal(v);
			});

		});

	});

});