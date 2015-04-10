
define(function(require) {

	var Signal = require('dist/reactant.amd.js').Signal,
		bdd = require('intern!bdd'),
		expect = require('intern/chai!expect'),
		describe = bdd.describe,
		it = bdd.it;

	describe('Signal', function() {

		it('should be a function', function() {
			expect(Signal).to.be.a('function');
		});

		it('should be a constructor', function() {
			expect(new Signal()).to.be.an.instanceof(Signal);
		});

		describe('#subscribe', function() {

			it('should be a function', function() {
				expect(new Signal().subscribe).to.be.a('function');
			});

			it('should throw an error if the subscriber is not callable', function() {
				[
					undefined,
					null,
					true,
					false, 
					'',
					0,
					new Date(),
					[],
					{},
					{ call: undefined },
					{ call: null },
					{ call: [] },
					{ call: true },
					{ call: false },
					{ call: '' },
					{ call: 0 },
					{ call: new Date() },
				].forEach(function(v) {
					expect(function() {
						new Signal().subscribe(v);
					}).to.throw(Error);
				});
			});

			it('should not throw an error if the subscriber is callable', function() {
				[
					{
						call: function(){}
					},
					function(){}
				].forEach(function(v) {
					expect(function() {
						new Signal().subscribe(v);
					}).to.not.throw(Error);
				});
			});

			it('should add a subscriber', function() {
				var o = new Signal(),
					r = false;
				o.subscribe(function() {
					r = true;
				});
				o.propagate();
				expect(r).to.equal(true);
			});

			it('should not add a subscriber more than once', function() {
				var o = new Signal(),
					r = false,
					f = function() {
						r = !r;
					};
				o.subscribe(f);
				o.propagate();
				expect(r).to.equal(true);
				o.propagate();
				expect(r).to.equal(false);
				o.subscribe(f);
				o.propagate();
				expect(r).to.equal(true);
			});

			it('should return the caller', function() {
				var o = new Signal();
				expect(o.subscribe(function(){})).to.equal(o);
			});

		});

		describe('#unsubscribe', function() {

			it('should be a function', function() {
				expect(new Signal().unsubscribe).to.be.a('function');
			});

			it('should remove a subscriber', function() {
				var o = new Signal(),
					r = false,
					f = function() {
						r = !r;
					};
				o.subscribe(f);
				o.propagate();
				expect(r).to.equal(true);
				o.unsubscribe(f);
				expect(r).to.equal(true);
			});

			it('should return the caller', function() {
				var o = new Signal();
				expect(o.unsubscribe(function(){})).to.equal(o);
			});

		});

		describe('#propagate', function() {

			it('should be a function', function() {
				expect(new Signal().propagate).to.be.a('function');
			});

			it('should call a single subscriber', function() {
				var o = new Signal(),
					r = 0,
					f = function() { r++; };
				o.subscribe(f);
				o.propagate();
				expect(r).to.equal(1);
			});

			it('should call multiple subscribers', function() {
				var o = new Signal(),
					r = 0;
				o.subscribe(function() { r++; });
				o.subscribe(function() { r++; });
				o.subscribe(function() { r++; });
				o.propagate();
				expect(r).to.equal(3);
			});

			it('should invoke subscriber\'s call method with the instance as the first argument', function() {
				var o = new Signal(),
					r = null,
					f = { call: function(a) { r = a; } };
				o.subscribe(f);
				o.propagate();
				expect(r).to.equal(o);
			});

			it('should return the caller', function() {
				var o = new Signal();
				expect(o.propagate()).to.equal(o);
			});

		});

	});

});