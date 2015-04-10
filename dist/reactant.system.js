System.register([], function (_export) {
	var _get, _inherits, _classCallCheck, _createClass, keys, def, slice, isArray, UNDEFINED, NULL, Signal, Vertex, Value, Input, Clone, State, Nexus, Model;

	//
	//
	//

	function reactant(value) {
		return isSignal(value) ? value : isFunction(value) ? lift(value) : new Value(value);
	}

	function bind(input, fn) {
		return isArray(input) ? lift(fn).apply(null, input) : lift(fn)(input);
	}

	function copy(value) {
		if (!isSignal(value)) {
			throw new Error('reactant.copy "value" argument must be an instance of reactant.Signal');
		}
		return new Clone(value);
	}

	function lift(fn) {
		if (!isFunction(fn)) {
			throw new Error('reactant.lift "fn" argument must be of type: "function"');
		}
		if (fn.isLifted) {
			return fn;
		}
		switch (fn.length) {
			case 0:
				return lift0(fn);
			case 1:
				return lift1(fn);
			case 2:
				return lift2(fn);
			case 3:
				return lift3(fn);
			case 4:
				return lift4(fn);
			case 5:
				return lift5(fn);
			case 6:
				return lift6(fn);
			case 7:
				return lift7(fn);
			case 8:
				return lift8(fn);
			case 9:
				return lift9(fn);
			case 10:
				return lift10(fn);
			case 11:
				return lift11(fn);
			case 12:
				return lift12(fn);
			default:
				return liftN(fn);
		}
	}

	function isCallable(x) {
		return x !== undefined && x !== null && typeof x.call === 'function';
	}

	function isFunction(x) {
		return typeof x === 'function';
	}

	function isObject(x) {
		return typeof x === 'object' && x !== null;
	}

	function isSignal(x) {
		return x instanceof Signal;
	}

	function isVertex(x) {
		return x instanceof Vertex;
	}

	function toValueObject(v) {
		return v === undefined ? UNDEFINED : v === null ? NULL : v;
	}

	// TODO Class & Graph

	//
	//
	//

	function apply2(fn, a) {
		return fn(a[0], a[1]);
	}

	function apply3(fn, a) {
		return fn(a[0], a[1], a[2]);
	}

	function apply4(fn, a) {
		return fn(a[0], a[1], a[2], a[3]);
	}

	function apply5(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4]);
	}

	function apply6(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5]);
	}

	function apply7(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
	}

	function apply8(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
	}

	function apply9(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
	}

	function apply10(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
	}

	function apply11(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);
	}

	function apply12(fn, a) {
		return fn(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11]);
	}

	function applyN(fn, a) {
		return fn.apply(null, a);
	}

	//
	//
	//

	function lifted(fn) {
		def(fn, 'isLifted', { value: true });
	}

	function lift0(fn) {
		return lifted(function () {
			return new Input(fn);
		});
	}

	function lift1(fn) {
		return lifted(function (a) {
			return new State(a, fn);
		});
	}

	function lift2(fn) {
		return lifted(function (a, b) {
			return new Nexus([a, b], apply2, fn);
		});
	}

	function lift3(fn) {
		return lifted(function (a, b, c) {
			return new Nexus([a, b, c], apply3, fn);
		});
	}

	function lift4(fn) {
		return lifted(function (a, b, c, d) {
			return new Nexus([a, b, c, d], apply4, fn);
		});
	}

	function lift5(fn) {
		return lifted(function (a, b, c, d, e) {
			return new Nexus([a, b, c, d, e], apply5, fn);
		});
	}

	function lift6(fn) {
		return lifted(function (a, b, c, d, e, f) {
			return new Nexus([a, b, c, d, e, f], apply6, fn);
		});
	}

	function lift7(fn) {
		return lifted(function (a, b, c, d, e, f, g) {
			return new Nexus([a, b, c, d, e, f, g], apply7, fn);
		});
	}

	function lift8(fn) {
		return lifted(function (a, b, c, d, e, f, g, h) {
			return new Nexus([a, b, c, d, e, f, g, h], apply8, fn);
		});
	}

	function lift9(fn) {
		return lifted(function (a, b, c, d, e, f, g, h, i) {
			return new Nexus([a, b, c, d, e, f, g, h, i], apply9, fn);
		});
	}

	function lift10(fn) {
		return lifted(function (a, b, c, d, e, f, g, h, i, j) {
			return new Nexus([a, b, c, d, e, f, g, h, i, j], apply10, fn);
		});
	}

	function lift11(fn) {
		return lifted(function (a, b, c, d, e, f, g, h, i, j, k) {
			return new Nexus([a, b, c, d, e, f, g, h, i, j, k], apply11, fn);
		});
	}

	function lift12(fn) {
		return lifted(function (a, b, c, d, e, f, g, h, i, j, k, l) {
			return new Nexus([a, b, c, d, e, f, g, h, i, j, k, l], apply12, fn);
		});
	}

	function liftN(fn) {
		return lifted(function () {
			return new Nexus(slice.call(arguments, 0, fn.length), applyN, fn);
		});
	}

	return {
		setters: [],
		execute: function () {
			'use strict';

			_get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

			_inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

			_classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

			_createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

			//
			//
			//

			keys = Object.keys;
			def = Object.defineProperty;
			slice = Array.prototype.slice;

			//
			//
			//

			isArray = Array.isArray;
			//
			//
			//

			UNDEFINED = Object.seal({
				valueOf: function valueOf() {
					return undefined;
				}
			});
			NULL = Object.seal({
				valueOf: function valueOf() {
					return null;
				}
			});
			//
			//
			//

			Signal = (function () {
				function Signal() {
					_classCallCheck(this, Signal);

					this._chain = null;
					this._multi = false;
				}

				_createClass(Signal, [{
					key: 'subscribe',
					value: function subscribe(subscriber) {
						if (!isCallable(subscriber)) {
							throw new Error('reactant.Signal "subscriber" must be callable');
						}
						if (this._multi) {
							if (this._chain.indexOf(subscriber) === -1) {
								this._chain.push(subscriber);
							}
						} else if (this._chain !== subscriber) {
							if (this._chain === null) {
								this._chain = subscriber;
							} else {
								this._chain = [this._chain, subscriber];
								this._multi = true;
							}
						}
						return this;
					}
				}, {
					key: 'unsubscribe',
					value: function unsubscribe(subscriber) {
						if (this._multi) {
							var i = this._chain.indexOf(subscriber);
							if (i !== -1) {
								if (this._chain.length === 2) {
									this._chain = this._chain[i === 0 ? 1 : 0];
									this._multi = false;
								} else {
									this._chain.splice(i, 1);
								}
							}
						} else if (this._chain === subscriber) {
							this._chain = null;
						}
						return this;
					}
				}, {
					key: 'propagate',
					value: function propagate() {
						if (this._multi) {
							for (var i = 0; i < this._chain.length; i++) {
								this._chain[i].call(this);
							}
						} else if (this._chain !== null) {
							this._chain.call(this);
						}
						return this;
					}
				}]);

				return Signal;
			})();

			Vertex = (function (_Signal) {
				function Vertex() {
					_classCallCheck(this, Vertex);

					_get(Object.getPrototypeOf(Vertex.prototype), 'constructor', this).call(this);
					this._valid = true;
				}

				_inherits(Vertex, _Signal);

				_createClass(Vertex, [{
					key: 'invalidate',
					value: function invalidate() {
						this.call();
						return this;
					}
				}, {
					key: 'call',
					value: function call() {
						if (this._valid) {
							this._valid = false;
							this.propagate();
						}
					}
				}, {
					key: 'revalidate',
					value: function revalidate() {
						this._valid = true;
					}
				}, {
					key: 'isValid',
					get: function () {
						return this._valid;
					}
				}]);

				return Vertex;
			})(Signal);

			//
			//
			//

			Value = (function (_Signal2) {
				function Value(value) {
					_classCallCheck(this, Value);

					_get(Object.getPrototypeOf(Value.prototype), 'constructor', this).call(this);
					this._value = value;
				}

				_inherits(Value, _Signal2);

				_createClass(Value, [{
					key: 'valueOf',
					value: function valueOf() {
						return this._value;
					}
				}, {
					key: 'set',
					value: function set(value) {
						if (this._value !== value) {
							this._value = value;
							this.propagate();
						}
						return this;
					}
				}]);

				return Value;
			})(Signal);

			Input = (function (_Signal3) {
				function Input(input) {
					_classCallCheck(this, Input);

					_get(Object.getPrototypeOf(Input.prototype), 'constructor', this).call(this);
					this.valueOf = isFunction(input) ? input : function () {
						return input;
					};
				}

				_inherits(Input, _Signal3);

				return Input;
			})(Signal);

			Clone = (function (_Vertex) {
				function Clone(input) {
					_classCallCheck(this, Clone);

					_get(Object.getPrototypeOf(Clone.prototype), 'constructor', this).call(this);
					this._input = toValueObject(input);
					this._value = this._input.valueOf();
					if (isSignal(input)) {
						input.subscribe(this);
					}
				}

				_inherits(Clone, _Vertex);

				_createClass(Clone, [{
					key: 'valueOf',
					value: function valueOf() {
						if (!this.isValid) {
							this._value = this._input.valueOf();
							this.revalidate();
						}
						return this._value;
					}
				}]);

				return Clone;
			})(Vertex);

			State = (function (_Vertex2) {
				function State(input, xform) {
					_classCallCheck(this, State);

					_get(Object.getPrototypeOf(State.prototype), 'constructor', this).call(this);
					this._input = toValueObject(input);
					this._xform = xform;
					this._value = xform(this._input.valueOf());
					if (isSignal(input)) {
						input.subscribe(this);
					}
				}

				_inherits(State, _Vertex2);

				_createClass(State, [{
					key: 'valueOf',
					value: function valueOf() {
						if (!this.isValid) {
							this._value = this._xform(this._input.valueOf());
							this.revalidate();
						}
						return this._value;
					}
				}]);

				return State;
			})(Vertex);

			Nexus = (function (_Vertex3) {
				function Nexus(input, apply, xform) {
					_classCallCheck(this, Nexus);

					_get(Object.getPrototypeOf(Nexus.prototype), 'constructor', this).call(this);
					this._input = input;
					this._apply = apply;
					this._xform = xform;
					this._value = apply(xform, input);
					for (var i = 0; i < input.length; i++) {
						if (isSignal(input[i])) {
							input[i].subscribe(this);
						}
					}
				}

				_inherits(Nexus, _Vertex3);

				_createClass(Nexus, [{
					key: 'valueOf',
					value: function valueOf() {
						if (!this.isValid) {
							this._value = this._apply(this._xform, this._input);
							this.revalidate();
						}
						return this._value;
					}
				}]);

				return Nexus;
			})(Vertex);

			Model = (function (_Vertex4) {
				function Model(input, names) {
					_classCallCheck(this, Model);

					if (!isObject(input)) {
						throw new Error('reactant.Model "input" must be an object');
					}
					if (!isArray(names)) {
						names = keys(input);
					}
					_get(Object.getPrototypeOf(Model.prototype), 'constructor', this).call(this);
					this._names = names;
					for (var i = 0; i < names.length; i++) {
						var k = names[i],
						    v = input[k];
						this[name] = isFunction(v) ? v : (isSignal(v) ? v : isObject(v) ? new Model(v) : new Value(v)).subscribe(this);
					}
				}

				_inherits(Model, _Vertex4);

				_createClass(Model, [{
					key: 'set',
					value: function set(key, value) {
						if (isObject(key)) {
							for (var i in key) {
								this.set(i, key[i]);
							}
						} else if (isSignal(this[key]) && this[key].set) {
							this[key].set(value);
						}
						return this;
					}
				}, {
					key: 'valueOf',
					value: function valueOf() {
						var value = {},
						    names = this._names,
						    i = 0,
						    k;
						for (; i < names.length; i++) {
							k = names[i];
							value[k] = this[k].valueOf();
						}
						return value;
					}
				}]);

				return Model;
			})(Vertex);

			reactant.bind = bind;
			reactant.copy = copy;
			reactant.lift = lift;

			reactant.Signal = Signal;
			reactant.Vertex = Vertex;

			reactant.Value = Value;
			reactant.Input = Input;
			reactant.Clone = Clone;
			reactant.State = State;
			reactant.Nexus = Nexus;
			reactant.Model = Model;

			reactant.UNDEFINED = UNDEFINED;
			reactant.NULL = NULL;

			_export('default', reactant);
		}
	};
});