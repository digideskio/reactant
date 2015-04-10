
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
		case 0  : return lift0(fn);
		case 1  : return lift1(fn);
		case 2  : return lift2(fn);
		case 3  : return lift3(fn);
		case 4  : return lift4(fn);
		case 5  : return lift5(fn);
		case 6  : return lift6(fn);
		case 7  : return lift7(fn);
		case 8  : return lift8(fn);
		case 9  : return lift9(fn);
		case 10 : return lift10(fn);
		case 11 : return lift11(fn);
		case 12 : return lift12(fn);
		default : return liftN(fn);
	}
}

//
//
//

var keys = Object.keys;

var def = Object.defineProperty;

var slice = Array.prototype.slice;

//
//
//

var isArray = Array.isArray;

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

//
//
//

var UNDEFINED = Object.seal({
	valueOf: function() {
		return undefined;
	}
});

var NULL = Object.seal({
	valueOf: function() {
		return null;
	}
});

function toValueObject(v) {
	return v === undefined ? UNDEFINED : v === null ? NULL : v;
}

//
//
//

class Signal {

	constructor() {
		this._chain = null;
		this._multi = false;
	}

	subscribe(subscriber) {
		if (!isCallable(subscriber)) {
			throw new Error('reactant.Signal "subscriber" must be callable');
		}
		var chain = this._chain;
		if (this._multi) {
			if (chain.indexOf(subscriber) === -1) {
				chain.push(subscriber);
			}
		} else if (chain !== subscriber) {
			if (chain === null) {
				this._chain = subscriber;
			} else {
				this._chain = [chain, subscriber];
				this._multi = true;
			}
		}
		return this;
	}

	unsubscribe(subscriber) {
		var chain = this._chain;
		if (this._multi) {
			var index = chain.indexOf(subscriber);
			if (index !== -1) {
				if (chain.length === 2) {
					this._chain = chain[index === 0 ? 1 : 0];
					this._multi = false;
				} else {
					chain.splice(index, 1);
				}
			}
		} else if (chain === subscriber) {
			this._chain = null;
		}
		return this;
	}

	propagate() {
		var chain = this._chain;
		if (this._multi) {
			for (var i = 0; i < chain.length; i++) {
				chain[i].call(this);
			}
		} else if (chain !== null) {
			chain.call(this);
		}
		return this;
	}

}

class Vertex extends Signal {

	constructor() {
		super();
		this._valid = true;
	}

	invalidate() {
		this.call();
		return this;
	}

	call() {
		if (this._valid) {
			this._valid = false;
			this.propagate();
		}
	}

	revalidate() {
		this._valid = true;
	}

	get isValid() {
		return this._valid;
	}

}

//
//
//

class Value extends Signal {

	constructor(value) {
		super();
		this._value = value;
	}

	valueOf() {
		return this._value;
	}

	set(value) {
		if (this._value !== value) {
			this._value = value;
			this.propagate();
		}
		return this;
	}

}

class Input extends Signal {

	constructor(input) {
		super();
		this.valueOf = isFunction(input) ? input : function() { return input; };
	}

}

class Clone extends Vertex {

	constructor(input) {
		super();
		this._input = toValueObject(input);
		this._value = this._input.valueOf();
		if (isSignal(input)) {
			input.subscribe(this);
		}
	}

	valueOf() {
		if (!this.isValid) {
			this._value = this._input.valueOf();
			this.revalidate();
		}
		return this._value;
	}

}

class State extends Vertex {

	constructor(input, xform) {
		super();
		this._input = toValueObject(input);
		this._xform = xform;
		this._value = xform(this._input.valueOf());
		if (isSignal(input)) {
			input.subscribe(this);
		}
	}

	valueOf() {
		if (!this.isValid) {
			this._value = this._xform(this._input.valueOf());
			this.revalidate();
		}
		return this._value;
	}

}

class Nexus extends Vertex {

	constructor(input, apply, xform) {
		super();
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

	valueOf() {
		if (!this.isValid) {
			this._value = this._apply(this._xform, this._input);
			this.revalidate();
		}
		return this._value;
	}

}

class Model extends Vertex {

	constructor(input, names) {
		if (!isObject(input)) {
			throw new Error('reactant.Model "input" must be an object');
		}
		if (!isArray(names)) {
			names = keys(input);
		}
		super();
		this._names = names;
		for (var i = 0; i < names.length; i++) {
			var k = names[i],
				v = input[k];
			this[name] = isFunction(v) ? v : (
				isSignal(v) ? v : isObject(v) ? new Model(v) : new Value(v)
			).subscribe(this);
		}
	}

	set(key, value) {
		if (isObject(key)) {
			for (var i in key) {
				this.set(i, key[i]);
			}
		} else if (isSignal(this[key]) && this[key].set) {
			this[key].set(value);
		}
		return this;
	}

	valueOf() {
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
	return lifted(function() {
		return new Input(fn);
	});
}
	
function lift1(fn) {
	return lifted(function(a) {
		return new State(a, fn);
	});
}
	
function lift2(fn) {
	return lifted(function(a, b) {
		return new Nexus([a, b], apply2, fn);
	});
}
	
function lift3(fn) {
	return lifted(function(a, b, c) {
		return new Nexus([a, b, c], apply3, fn);
	});
}
	
function lift4(fn) {
	return lifted(function(a, b, c, d) {
		return new Nexus([a, b, c, d], apply4, fn);
	});
}
	
function lift5(fn) {
	return lifted(function(a, b, c, d, e) {
		return new Nexus([a, b, c, d, e], apply5, fn);
	});
}
	
function lift6(fn) {
	return lifted(function(a, b, c, d, e, f) {
		return new Nexus([a, b, c, d, e, f], apply6, fn);
	});
}
	
function lift7(fn) {
	return lifted(function(a, b, c, d, e, f, g) {
		return new Nexus([a, b, c, d, e, f, g], apply7, fn);
	});
}

function lift8(fn) {
	return lifted(function(a, b, c, d, e, f, g, h) {
		return new Nexus([a, b, c, d, e, f, g, h], apply8, fn);
	});
}

function lift9(fn) {
	return lifted(function(a, b, c, d, e, f, g, h, i) {
		return new Nexus([a, b, c, d, e, f, g, h, i], apply9, fn);
	});
}

function lift10(fn) {
	return lifted(function(a, b, c, d, e, f, g, h, i, j) {
		return new Nexus([a, b, c, d, e, f, g, h, i, j], apply10, fn);
	});
}

function lift11(fn) {
	return lifted(function(a, b, c, d, e, f, g, h, i, j, k) {
		return new Nexus([a, b, c, d, e, f, g, h, i, j, k], apply11, fn);
	});
}

function lift12(fn) {
	return lifted(function(a, b, c, d, e, f, g, h, i, j, k, l) {
		return new Nexus([a, b, c, d, e, f, g, h, i, j, k, l], apply12, fn);
	});
}

function liftN(fn) {
	return lifted(function() {
		return new Nexus(slice.call(arguments, 0, fn.length), applyN, fn);
	});
}

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

export default reactant;
