
define(function(require) {

	var Vertex = require('dist/reactant.amd.js').Vertex,
		bdd = require('intern!bdd'),
		expect = require('intern/chai!expect'),
		describe = bdd.describe,
		it = bdd.it;

	describe('Vertex', function() {

		it('should be a function', function() {
			expect(Vertex).to.be.a('function');
		});

		it('should be a constructor', function() {
			expect(new Vertex()).to.be.an.instanceof(Vertex);
		});

		describe('#invalidate', function() {

			it('should be a function', function() {
				expect(new Vertex().invalidate).to.be.a('function');
			});

			it('should delegate to #call', function() {
				var r = false,
					f = function() { r = true; },
					o = new Vertex();
				o.call = f;
				o.invalidate();
				expect(r).to.equal(true);
			});

		});

		describe('#call', function() {

			it('should be a function', function() {
				expect(new Vertex().call).to.be.a('function');
			});

			it('should propagate the signal if valid', function() {
				var o = new Vertex(),
					r = false,
					f = function() { r = true; };
				o.subscribe(f);
				o.call();
				expect(r).to.equal(true);
			});

			it('should not propagate the signal if invalid', function() {
				var o = new Vertex(),
					r = false,
					f = function() { r = !r; };
				o.subscribe(f);
				o.call();
				expect(r).to.equal(true);
				o.call();
				expect(r).to.equal(true);
			});

		});

		describe('#revalidate', function() {

			it('should be a function', function() {
				expect(new Vertex().revalidate).to.be.a('function');
			});

			it('should set the instance as valid', function() {
				var o = new Vertex();
				o.invalidate();
				expect(o.isValid).to.equal(false);
				o.revalidate();
				expect(o.isValid).to.equal(true);
			});

		});

		describe('.isValid', function() {

			it('should return a boolean value', function() {
				expect(new Vertex().isValid).to.be.a('boolean');
				expect(new Vertex().invalidate().isValid).to.be.a('boolean');
			});

			it('should be true by default', function() {
				expect(new Vertex().isValid).to.equal(true);
			});

			it('should be false if the instance is invalidated', function() {
				var o = new Vertex();
				o.invalidate();
				expect(o.isValid).to.equal(false);
			});

			it('should be true once the instance is revalidated', function() {
				var o = new Vertex();
				o.invalidate();
				expect(o.isValid).to.equal(false);
				o.revalidate();
				expect(o.isValid).to.equal(true);
			});

		});

	});

});