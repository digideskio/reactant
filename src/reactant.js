
'use strict';

//
//
//

export default function reactant(value) {
	return isSignal(value) ? value : isFunction(value) ? lift(value) : new Value(value);
}

export function copy(value) {
	if (!isSignal(value)) {
		throw new Error('reactant.copy "value" argument must be an instance of reactant.Signal');
	}
	return new Clone(value);
}

export function lift(fn) {
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

export function bind(input, fn) {
	return isArray(input) ? lift(fn).apply(null, input) : lift(fn)(input);
}

//
//
//

var isArray = Array.isArray;

function isFunction(x) {
	return typeof x === 'function';
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

	subscribe(target) {
		if (!isVertex(target)) {
			throw new Error('reactant.Signal "target" argument must be an instance of reactant.Vertex');
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

	unsubscribe(target) {
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

	propagate() {
		if (this._multi) {
			for (var i = 0; i < this._chain.length; i++) {
				this._chain[i].invalidate();
			}
		} else if (this._chain !== null) {
			this._chain.invalidate();
		}
	}

}

class Vertex extends Signal {

	constructor() {
		super();
		this._valid = true;
	}

	invalidate() {
		if (this._valid === false) {
			this._valid = true;
			this.propagate();
		}
	}

	revalidate() {
		this._valid = true;
	}

	isValid() {
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
	}

}

class Input extends Vertex {

	constructor(input) {
		super();
		this.valueOf = input;
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

export class Nexus extends Vertex {

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
	Object.defineProperty(fn, 'isLifted', { value: true });
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
		return new Nexus(Array.prototype.slice.call(arguments, 0, fn.length), applyN, fn);
	});
}
