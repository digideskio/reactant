define(["exports"], function (exports) {
	"use strict";

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	//
	//
	//

	exports["default"] = reactant;
	exports.copy = copy;
	exports.lift = lift;
	exports.bind = bind;
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	"use strict";
	function reactant(value) {
		return isSignal(value) ? value : isFunction(value) ? lift(value) : new Value(value);
	}

	function copy(value) {
		if (!isSignal(value)) {
			throw new Error("reactant.copy \"value\" argument must be an instance of reactant.Signal");
		}
		return new Clone(value);
	}

	function lift(fn) {
		if (!isFunction(fn)) {
			throw new Error("reactant.lift \"fn\" argument must be of type: \"function\"");
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

	function bind(input, fn) {
		return isArray(input) ? lift(fn).apply(null, input) : lift(fn)(input);
	}

	//
	//
	//

	var isArray = Array.isArray;

	function isFunction(x) {
		return typeof x === "function";
	}

	function isSignal(x) {
		return x instanceof Signal;
	}

	function isVertex(x) {
		return x instanceof Vertex;
	}

	//
	//
	//

	var UNDEFINED = Object.seal({
		valueOf: function valueOf() {
			return undefined;
		}
	});

	var NULL = Object.seal({
		valueOf: function valueOf() {
			return null;
		}
	});

	function toValueObject(v) {
		return v === undefined ? UNDEFINED : v === null ? NULL : v;
	}

	//
	//
	//

	var Signal = (function () {
		function Signal() {
			_classCallCheck(this, Signal);

			this._chain = null;
			this._multi = false;
		}

		_createClass(Signal, {
			subscribe: {
				value: function subscribe(target) {
					if (!isVertex(target)) {
						throw new Error("reactant.Signal \"target\" argument must be an instance of reactant.Vertex");
					}
					if (this._multi) {
						if (this._chain.indexOf(target) === -1) {
							this._chain.push(target);
						}
					} else if (this._chain !== target) {
						if (this._chain === null) {
							this._chain = target;
						} else {
							this._chain = [this._chain, target];
							this._multi = true;
						}
					}
				}
			},
			unsubscribe: {
				value: function unsubscribe(target) {
					if (this._multi) {
						var index = this._chain.indexOf(target);
						if (index !== -1) {
							if (this._chain.length === 2) {
								this._chain = this._chain[index === 0 ? 1 : 0];
								this._multi = false;
							} else {
								this._chain.splice(index, 1);
							}
						}
					} else if (this._chain === target) {
						this._chain = null;
					}
				}
			},
			propagate: {
				value: function propagate() {
					if (this._multi) {
						for (var i = 0; i < this._chain.length; i++) {
							this._chain[i].invalidate();
						}
					} else if (this._chain !== null) {
						this._chain.invalidate();
					}
				}
			}
		});

		return Signal;
	})();

	var Vertex = (function (_Signal) {
		function Vertex() {
			_classCallCheck(this, Vertex);

			_get(Object.getPrototypeOf(Vertex.prototype), "constructor", this).call(this);
			this._valid = true;
		}

		_inherits(Vertex, _Signal);

		_createClass(Vertex, {
			invalidate: {
				value: function invalidate() {
					if (this._valid === false) {
						this._valid = true;
						this.propagate();
					}
				}
			},
			revalidate: {
				value: function revalidate() {
					this._valid = true;
				}
			},
			isValid: {
				value: function isValid() {
					return this._valid;
				}
			}
		});

		return Vertex;
	})(Signal);

	//
	//
	//

	var Value = (function (_Signal2) {
		function Value(value) {
			_classCallCheck(this, Value);

			_get(Object.getPrototypeOf(Value.prototype), "constructor", this).call(this);
			this._value = value;
		}

		_inherits(Value, _Signal2);

		_createClass(Value, {
			valueOf: {
				value: function valueOf() {
					return this._value;
				}
			},
			set: {
				value: function set(value) {
					if (this._value !== value) {
						this._value = value;
						this.propagate();
					}
				}
			}
		});

		return Value;
	})(Signal);

	var Input = (function (_Vertex) {
		function Input(input) {
			_classCallCheck(this, Input);

			_get(Object.getPrototypeOf(Input.prototype), "constructor", this).call(this);
			this.valueOf = input;
		}

		_inherits(Input, _Vertex);

		return Input;
	})(Vertex);

	var Clone = (function (_Vertex2) {
		function Clone(input) {
			_classCallCheck(this, Clone);

			_get(Object.getPrototypeOf(Clone.prototype), "constructor", this).call(this);
			this._input = toValueObject(input);
			this._value = this._input.valueOf();
			if (isSignal(input)) {
				input.subscribe(this);
			}
		}

		_inherits(Clone, _Vertex2);

		_createClass(Clone, {
			valueOf: {
				value: function valueOf() {
					if (!this.isValid) {
						this._value = this._input.valueOf();
						this.revalidate();
					}
					return this._value;
				}
			}
		});

		return Clone;
	})(Vertex);

	var State = (function (_Vertex3) {
		function State(input, xform) {
			_classCallCheck(this, State);

			_get(Object.getPrototypeOf(State.prototype), "constructor", this).call(this);
			this._input = toValueObject(input);
			this._xform = xform;
			this._value = xform(this._input.valueOf());
			if (isSignal(input)) {
				input.subscribe(this);
			}
		}

		_inherits(State, _Vertex3);

		_createClass(State, {
			valueOf: {
				value: function valueOf() {
					if (!this.isValid) {
						this._value = this._xform(this._input.valueOf());
						this.revalidate();
					}
					return this._value;
				}
			}
		});

		return State;
	})(Vertex);

	var Nexus = exports.Nexus = (function (_Vertex4) {
		function Nexus(input, apply, xform) {
			_classCallCheck(this, Nexus);

			_get(Object.getPrototypeOf(Nexus.prototype), "constructor", this).call(this);
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

		_inherits(Nexus, _Vertex4);

		_createClass(Nexus, {
			valueOf: {
				value: function valueOf() {
					if (!this.isValid) {
						this._value = this._apply(this._xform, this._input);
						this.revalidate();
					}
					return this._value;
				}
			}
		});

		return Nexus;
	})(Vertex);

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
		Object.defineProperty(fn, "isLifted", { value: true });
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
			return new Nexus(Array.prototype.slice.call(arguments, 0, fn.length), applyN, fn);
		});
	}
});