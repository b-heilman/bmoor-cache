var bmoorCache =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = bmoor;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Feed: __webpack_require__(5),
	Pool: __webpack_require__(14),
	Collection: __webpack_require__(20),
	stream: {
		Converter: __webpack_require__(21)
	},
	object: {
		Proxy: __webpack_require__(22),
		Test: __webpack_require__(8),
		Hash: __webpack_require__(7)
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    makeGetter = bmoor.makeGetter,
    makeSetter = bmoor.makeSetter;

var Path = function () {
	// normal path: foo.bar
	// array path : foo[]bar
	function Path(path) {
		_classCallCheck(this, Path);

		var end,
		    dex = path.indexOf('['),
		    args;

		this.raw = path;

		if (dex === -1) {
			this.type = 'linear';
		} else {
			this.type = 'array';

			end = path.indexOf(']', dex);

			this.op = path.substring(dex + 1, end);
			args = this.op.indexOf(':');

			if (path.charAt(end + 1) === '.') {
				end++;
			}

			this.remainder = path.substr(end + 1);

			if (args === -1) {
				this.args = '';
			} else {
				this.args = this.op.substr(args + 1);
				this.op = this.op.substring(0, args);
			}

			path = path.substr(0, dex);
		}

		this.leading = path;

		if (path === '') {
			this.path = [];
		} else {
			this.path = path.split('.');
			this.set = makeSetter(this.path);
		}

		// if we want to, we can optimize path performance
		this.get = makeGetter(this.path);
	}

	_createClass(Path, [{
		key: 'flatten',
		value: function flatten(obj) {
			var t, rtn, next;

			if (this.remainder === undefined) {
				return [this.get(obj)];
			} else {
				t = this.get(obj);
				rtn = [];
				next = new Path(this.remainder);
				t.forEach(function (o) {
					rtn = rtn.concat(next.flatten(o));
				});

				return rtn;
			}
		}
	}, {
		key: 'exec',
		value: function exec(obj, fn) {
			this.flatten(obj).forEach(function (o) {
				fn(o);
			});
		}
	}]);

	return Path;
}();

module.exports = Path;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).Memory.use('cache-table-schema');

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).Memory.use('cache-mockery-schema');

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing,
    setUid = bmoor.data.setUid,
    oldPush = Array.prototype.push;

// designed for one way data flows.
// src -> feed -> target

var Feed = function (_Eventing) {
	_inherits(Feed, _Eventing);

	function Feed(src) {
		_classCallCheck(this, Feed);

		var _this = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this));

		if (!src) {
			src = [];
		} else {
			src.push = src.unshift = _this.add.bind(_this);
		}

		setUid(_this);

		_this.data = src;
		return _this;
	}

	_createClass(Feed, [{
		key: 'add',
		value: function add(datum) {
			oldPush.call(this.data, datum);

			this.trigger('insert', datum);

			this.trigger('update');
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var i, c;

			oldPush.apply(this.data, arr);

			if (this.hasWaiting('insert')) {
				for (i = 0, c = arr.length; i < c; i++) {
					this.trigger('insert', arr[i]);
				}
			}

			this.trigger('update');
		}
	}, {
		key: 'sort',
		value: function sort(fn) {
			this.data.sort(fn);
		}
	}]);

	return Feed;
}(Eventing);

module.exports = Feed;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = __webpack_require__(2);

function all(next) {
	return function (toObj, fromObj) {
		var i, c, dex, t;

		for (i = 0, c = fromObj.length; i < c; i++) {
			t = {};
			dex = toObj.length;

			toObj.push(t);

			next(t, fromObj[i], toObj, dex);
		}
	};
}

var arrayMethods = {
	'': all,
	'*': all,
	'merge': function merge(next) {
		return function (toObj, fromObj, toRoot, toVar) {
			var i, c, dex, t;

			if (fromObj.length) {
				next(toObj, fromObj[0], toRoot, toVar);

				for (i = 1, c = fromObj.length; i < c; i++) {
					t = {};
					dex = toRoot.length;

					toRoot.push(t);

					next(t, fromObj[i], toRoot, dex);
				}
			}
		};
	},
	'first': function first(next) {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = {};

			toRoot[toVar] = t;

			next(t, fromObj[0], toRoot, toVar);
		};
	},
	'last': function last(next) {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = {};

			toRoot[toVar] = t;

			next(t, fromObj[fromObj.length - 1], toRoot, toVar);
		};
	},
	'pick': function pick(next, args) {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = {},
			    dex = parseInt(args, 10);

			toRoot[toVar] = t;

			next(t, fromObj[dex], toRoot, toVar);
		};
	}
};

function buildArrayMap(to, from, next) {
	var fn = arrayMethods[to.op](next, to.args);

	if (to.path.length) {
		return function (toObj, fromObj) {
			var t = [],
			    parent = to.set(toObj, t);

			fn(t, from.get(fromObj), parent, to.path[to.path.length - 1]);
		};
	} else {
		return function (toObj, fromObj, toRoot, toVar) {
			var t = [],
			    myRoot;

			if (toRoot) {
				t = [];
				toRoot[toVar] = t;
				myRoot = toRoot;
			} else {
				// this must be when an array leads
				myRoot = t = toObj;
			}

			fn(t, from.get(fromObj), myRoot, toVar);
		};
	}
}

function stackChildren(old, fn) {
	if (old) {
		return function (toObj, fromObj, toRoot, toVar) {
			fn(toObj, fromObj, toRoot, toVar);
			old(toObj, fromObj, toRoot, toVar);
		};
	} else {
		return fn;
	}
}

var Mapping = function () {
	function Mapping(toPath, fromPath) {
		var _this = this;

		_classCallCheck(this, Mapping);

		var to = toPath instanceof Path ? toPath : new Path(toPath),
		    from = fromPath instanceof Path ? fromPath : new Path(fromPath);

		this.chidren = {};

		if (to.type === 'linear' && from.type === to.type) {
			if (to.path.length) {
				this.go = function (toObj, fromObj) {
					to.set(toObj, from.get(fromObj));
				};
			} else if (from.path.length) {
				this.go = function (ignore, fromObj, toRoot, i) {
					toRoot[i] = from.get(fromObj);
				};
			} else {
				this.go = function (ignore, value, toRoot, i) {
					toRoot[i] = value;
				};
			}
		} else if (to.type === 'array' && from.type === to.type) {
			this.addChild(to.remainder, from.remainder);
			this.go = buildArrayMap(to, from, function (toObj, fromObj, toRoot, toVar) {
				_this.callChildren(toObj, fromObj, toRoot, toVar);
			});
		} else {
			throw new Error('both paths needs same amount of array hooks');
		}
	}

	_createClass(Mapping, [{
		key: 'addChild',
		value: function addChild(toPath, fromPath) {
			var child,
			    to = new Path(toPath),
			    from = new Path(fromPath),
			    dex = to.leading + '-' + from.leading;

			child = this.chidren[dex];

			if (child) {
				child.addChild(to.remainder, from.remainder);
			} else {
				child = new Mapping(to, from);
				this.callChildren = stackChildren(this.callChildren, child.go);
			}
		}
	}]);

	return Mapping;
}();

module.exports = Mapping;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);

function stack(old, getter) {
	if (old) {
		return function (obj) {
			return old(obj) + ':' + getter(obj);
		};
	} else {
		return function (obj) {
			return getter(obj);
		};
	}
}

function build(obj) {
	var fn,
	    keys,
	    values = [];

	if (bmoor.isArray(obj)) {
		keys = obj;
	} else {
		var flat = bmoor.object.implode(obj);

		keys = Object.keys(flat);
	}

	keys.sort().forEach(function (path) {
		fn = stack(fn, bmoor.makeGetter(path));

		values.push(path);
	});

	return {
		fn: fn,
		index: values.join(':')
	};
}

var Hash = function Hash(ops, settings) {
	_classCallCheck(this, Hash);

	var fn, hash;

	if (!settings) {
		settings = {};
	}

	if (bmoor.isFunction(ops)) {
		fn = ops;
		hash = ops.toString().replace(/[\s]+/g, '');
	} else if (bmoor.isObject(ops)) {
		var t = build(ops);

		fn = t.fn;
		hash = t.index;
	} else {
		throw new Error('I can not build a Hash out of ' + (typeof ops === 'undefined' ? 'undefined' : _typeof(ops)));
	}

	this.hash = settings.hash || hash;
	this.go = function (search) {
		if (!bmoor.isObject(search)) {
			return search;
		} else {
			if (settings.massage) {
				search = settings.massage(search);
			}

			return fn(search);
		}
	};
};

module.exports = Hash;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);

function stack(old, getter, value) {
	if (old) {
		return function (obj) {
			if (getter(obj) === value) {
				return old(obj);
			} else {
				return false;
			}
		};
	} else {
		return function (obj) {
			return getter(obj) === value;
		};
	}
}

function build(obj) {
	var fn,
	    flat = bmoor.object.implode(obj),
	    values = [];

	Object.keys(flat).sort().forEach(function (path) {
		var v = flat[path];

		fn = stack(fn, bmoor.makeGetter(path), v);

		values.push(path + '=' + v);
	});

	return {
		fn: fn,
		index: values.join(':')
	};
}

var Test = function Test(ops, settings) {
	_classCallCheck(this, Test);

	var fn, hash;

	if (!settings) {
		settings = {};
	}

	if (bmoor.isFunction(ops)) {
		fn = ops;
		hash = ops.toString().replace(/[\s]+/g, '');
	} else if (bmoor.isObject(ops)) {
		var t = build(ops);

		fn = t.fn;
		hash = t.index;
	} else {
		throw new Error('I can not build a Test out of ' + (typeof ops === 'undefined' ? 'undefined' : _typeof(ops)));
	}

	this.hash = settings.hash || hash;
	this.go = function (search) {
		if (settings.massage) {
			search = settings.massage(search);
		}

		return fn(search);
	};
};

module.exports = Test;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	mockery: {
		Wrapper: __webpack_require__(11),
		Schema: __webpack_require__(4)
	},
	Schema: __webpack_require__(3),
	Table: __webpack_require__(12)
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var schema = __webpack_require__(4);

function makeStub(table, old) {
	// the idea is to route all requests through all, since all 
	// should be the simplest thing to stub.  Simplifies queries.
	return function (method) {
		if (method === 'all') {
			return old.call(table, method);
		} else {
			return table.all().then(function () {
				return old.call(table, method);
			});
		}
	};
}

function makeMock(mock, method) {
	return function (datum, ctx) {
		return mock[method](datum, ctx.$args);
	};
}

var Wrapper = function () {
	function Wrapper(table, mock) {
		_classCallCheck(this, Wrapper);

		this.mock = mock;
		this.table = table;

		schema.register(table.name, this);
	}

	_createClass(Wrapper, [{
		key: 'enable',
		value: function enable() {
			if (!this.previous) {
				var mock = this.mock,
				    table = this.table,
				    prev = {
					preload: table.preload,
					search: table.connector.search,
					intercept: table.connector.all.$settings.intercept
				};

				table.preload = makeStub(table, prev.preload);

				table.connector.search = null; // force search through all
				table.connector.all.$settings.intercept = mock.all;

				if (table.connector.create && mock.create) {
					prev.create = table.connector.create.$settings.intercept;
					table.connector.create.$settings.intercept = makeMock(mock, 'create');
				}

				if (table.connector.update) {
					prev.update = table.connector.update.$settings.intercept;
					table.connector.update.$settings.intercept = makeMock(mock, 'update');
				}

				if (table.connector.delete) {
					prev.delete = table.connector.delete.$settings.intercept;
					table.connector.delete.$settings.intercept = makeMock(mock, 'delete');
				}

				this.previous = prev;
			}
		}
	}, {
		key: 'disable',
		value: function disable() {
			var prev = this.previous,
			    table = this.table;

			if (prev) {
				table.preload = prev.preload;
				table.connector.search = prev.search;
				table.connector.all.$settings.intercept = prev.intercept;

				this.previous = null;
			}
		}
	}]);

	return Wrapper;
}();

module.exports = Wrapper;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    Proxy = __webpack_require__(13),
    schema = __webpack_require__(3),
    Test = __webpack_require__(1).object.Test,
    Promise = __webpack_require__(23).Promise,
    DataProxy = __webpack_require__(1).object.Proxy,
    Collection = __webpack_require__(1).Collection;

var Table = function () {
	/* 
 * name : the name of your table
 * ops
 * <required>
 * - connector : bmoor-comm.connector object
 * - id
 * - proxy : proxy to apply to all elements
 */
	function Table(name, ops) {
		var _this = this;

		_classCallCheck(this, Table);

		var parser,
		    id = ops.id;

		schema.register(name, this);

		this.name = name;
		this.connector = ops.connector;

		this.joins = ops.joins || {};
		this.proxy = ops.proxy || Proxy;
		this.proxySettings = ops.proxySettings || {};

		if (!ops.id) {
			throw new Error('bmoor-comm::Table requires a id field of function');
		}

		// If performance matters, use bmoor-data's Proxy
		this.preload = ops.preload || function () {
			return Promise.resolve(true);
		};

		this.normalize = ops.normalize || function () {};

		if (bmoor.isFunction(id)) {
			this.$encode = function (qry) {
				return qry;
			};
			parser = id;
		} else if (bmoor.isString(id)) {
			this.$encode = function (qry) {
				var t;

				if (bmoor.isObject(qry)) {
					return qry;
				} else {
					t = {};
					bmoor.set(t, id, qry);
					return t;
				}
			};
			parser = function parser(qry) {
				if (bmoor.isObject(qry)) {
					return bmoor.get(qry, id);
				} else {
					return qry;
				}
			};
		} else {
			throw new Error('I do not know how to parse with' + JSON.stringify(id));
		}

		this.$datum = function (obj) {
			if (obj instanceof DataProxy) {
				obj = obj.getDatum();
			}

			return obj;
		};

		this.$id = function (obj) {
			return parser(_this.$datum(obj));
		};

		if (ops.partialList) {
			this.gotten = true;
		}

		this.reset();
	}

	_createClass(Table, [{
		key: 'reset',
		value: function reset() {
			this.collection = new Collection();
			this.index = this.collection.index(this.$id);
			this._selections = {};

			if (this.gotten) {
				this.gotten = {};
			}
		}

		// no promise routes

	}, {
		key: 'find',
		value: function find(obj) {
			return this.index.get(this.$id(obj));
		}
	}, {
		key: 'set',
		value: function set(obj, delta) {
			var id = this.$id(obj),
			    t = this.index.get(id);

			if (id) {
				if (t) {
					obj = delta || obj;
					this.normalize(obj);

					t.merge(delta || obj);
				} else {
					this.normalize(obj);
					t = new this.proxy(obj, this, this.proxySettings);

					this.collection.add(t);
				}

				return {
					id: id,
					ref: t
				};
			} else {
				throw new Error('missing id for object: ' + JSON.stringify(obj));
			}
		}

		// Used to check if that datum has been specifically fetched

	}, {
		key: '_set',
		value: function _set(obj) {
			var t = this.set(obj);

			// TODO : I might want to time out the gotten cache
			if (this.gotten) {
				this.gotten[t.id] = true;
			}

			return t.ref;
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var i, c;

			for (i = 0, c = arr.length; i < c; i++) {
				this.set(arr[i]);
			}
		}
	}, {
		key: 'del',
		value: function del(obj) {
			var t = this.index.get(this.$id(obj));

			this.collection.remove(t);

			return t;
		}

		// -- get

	}, {
		key: 'get',
		value: function get(obj, options) {
			var _this2 = this;

			var fetch;

			if (options && 'batch' in options) {
				if (this.batched) {
					this.batched.list.push(obj);
				} else {
					this.batched = {
						list: [obj],
						promise: new Promise(function (resolve, reject) {
							setTimeout(function () {
								var batched = _this2.batched;

								_this2.batched = null;

								return _this2.getMany(batched.list).then(resolve, reject);
							}, options.batch);
						})
					};
				}

				var res = this.batched.promise.then(function () {
					return _this2.find(obj);
				});
				fetch = function fetch() {
					return res;
				};
			} else {
				fetch = function fetch() {
					return _this2.connector.read(_this2.$encode(obj), null, options).then(function (res) {
						return _this2._set(res);
					});
				};
			}

			return this.preload('get').then(function () {
				var t = _this2.find(obj);

				if (!t || options && options.cached === false) {
					return fetch(obj);
				} else {
					if (_this2.gotten && !_this2.gotten[_this2.$id(obj)]) {
						return fetch(obj);
					} else {
						return t;
					}
				}
			});
		}

		// --- get : cache busting

	}, {
		key: 'refresh',
		value: function refresh(obj, options) {
			if (!options) {
				options = {};
			}

			options.cached = false;

			return this.get(obj, options);
		}

		// -- getMany

	}, {
		key: 'getMany',
		value: function getMany(arr, options) {
			var _this3 = this;

			return this.preload('get-many').then(function () {
				var rtn,
				    all = [],
				    req = [];

				// reduce the list using gotten
				if (_this3.gotten) {
					arr.forEach(function (r) {
						var t = _this3.$id(r);

						all.push(t);

						if (!_this3.gotten[t]) {
							req.push(_this3.$encode(r));
						}
					});
				} else {
					arr.forEach(function (r) {
						var t = _this3.$id(r);

						all.push(t);

						if (!_this3.index.get(t)) {
							req.push(_this3.$encode(r));
						}
					});
				}

				if (req.length) {
					// this works because I can assume id was defined for 
					// the feed
					if (_this3.connector.readMany) {
						rtn = _this3.connector.readMany(req, null, options);
					} else {
						// The feed doesn't have readMany, so many reads will work
						req.forEach(function (id, i) {
							req[i] = _this3.connector.read(id, null, options);
						});
						rtn = Promise.all(req);
					}

					rtn.then(function (res) {
						res.forEach(function (r) {
							_this3._set(r);
						});
					});
				} else {
					rtn = Promise.resolve(true); // nothing to do
				}

				return rtn.then(function () {
					var collection = new Collection();

					all.forEach(function (id, i) {
						collection.data[i] = _this3.index.get(id);
					});

					return collection;
				});
			});
		}

		// -- all
		// all returns back the whole collection.  Allowing obj for dynamic
		// urls

	}, {
		key: 'all',
		value: function all(obj, options) {
			var _this4 = this;

			return this.preload('all').then(function () {
				if (!_this4.$all || options && options.cached === false) {
					_this4.$all = _this4.connector.all(obj, null, options).then(function (res) {
						_this4.consume(res);

						return _this4.collection;
					});
				}

				return _this4.$all;
			});
		}

		// -- insert

	}, {
		key: 'insert',
		value: function insert(obj, options) {
			var _this5 = this;

			return this.preload('insert').then(function () {
				var t = _this5.find(obj);

				if (t) {
					throw new Error('This already exists ' + JSON.stringify(obj));
				} else {
					return _this5.connector.create(obj, obj, options).then(function (res) {
						var proxy = _this5.set(res).ref;

						proxy.merge(obj);

						return proxy;
					});
				}
			});
		}

		// -- update
		// delta is optional

	}, {
		key: 'update',
		value: function update(from, delta, options) {
			var _this6 = this;

			return this.preload('update').then(function () {
				var t,
				    wasProxy = false;

				if (from instanceof DataProxy) {
					wasProxy = true;

					t = from;
					from = t.getDatum();
				} else {
					from = _this6.$encode(from);
					t = _this6.find(from);
				}

				if (!delta) {
					delta = t.getChanges();
				}

				if (t) {
					return _this6.connector.update(from, delta, options).then(function (res) {
						t.merge(delta);

						if (bmoor.isObject(res)) {
							t.merge(res);
						}

						return res;
					});
				} else {
					throw new Error('Can not update that which does not exist' + JSON.stringify(from));
				}
			});
		}

		// -- delete

	}, {
		key: 'delete',
		value: function _delete(obj, options) {
			var _this7 = this;

			return this.preload('delete').then(function () {
				var t = _this7.find(obj);

				if (t) {
					return _this7.connector.delete(_this7.$encode(obj), null, options).then(function (res) {
						_this7.del(obj);

						return res;
					});
				} else {
					throw new Error('Can not delete that which does not exist' + JSON.stringify(obj));
				}
			});
		}

		// -- select

	}, {
		key: 'select',
		value: function select(qry, options) {
			var _this8 = this;

			return this.preload('select').then(function () {
				var op,
				    rtn,
				    test,
				    selection,
				    selections = _this8._selections;

				if (!options) {
					options = {};
				}

				_this8.normalize(qry);

				test = options instanceof Test ? options : new Test(options.fn || qry, {
					hash: options.hash,
					massage: _this8.$datum
				});
				selection = selections[test.hash];

				if (selection && options.cached !== false) {
					selection.count++;

					return selection.filter;
				}

				if (_this8.connector.search) {
					rtn = _this8.connector.search(qry, // variables
					null, // no datum to send
					options // allow more fine tuned management
					).then(function (res) {
						_this8.consume(res);
					});
				} else {
					rtn = _this8.all(qry, options);
				}

				if (selection) {
					selection.count++;

					return rtn.then(function () {
						return selection.filter;
					});
				} else {
					selections[test.hash] = op = {
						filter: rtn.then(function () {
							var res = _this8.collection.filter(test),
							    disconnect = res.disconnect;

							res.disconnect = function () {
								op.count--;

								if (!op.count) {
									selections[test.hash] = null;
									disconnect();
								}
							};

							return res;
						}),
						count: 1
					};

					return op.filter;
				}
			});
		}
	}]);

	return Table;
}();

Table.schema = schema;
module.exports = Table;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    schema = __webpack_require__(3),
    DataProxy = __webpack_require__(1).object.Proxy;

// { join: {table:'', field} }

var JoinableProxy = function (_DataProxy) {
	_inherits(JoinableProxy, _DataProxy);

	function JoinableProxy(datum, table) {
		_classCallCheck(this, JoinableProxy);

		var _this = _possibleConstructorReturn(this, (JoinableProxy.__proto__ || Object.getPrototypeOf(JoinableProxy)).call(this, datum));

		_this.getTable = function () {
			// prevent circular 
			return table;
		};

		_this.joins = {};
		return _this;
	}

	_createClass(JoinableProxy, [{
		key: 'inflate',
		value: function inflate() {
			var _this2 = this;

			var joins = this.getTable().joins,
			    keys = Object.keys(joins),
			    req = [];

			Object.keys(joins).forEach(function (join) {
				req.push(_this2.join(join));
			});

			return Promise.all(req).then(function (res) {
				var rtn = {};

				keys.forEach(function (key, i) {
					rtn[key] = res[i];
				});

				return rtn;
			});
		}
	}, {
		key: 'join',
		value: function join(tableName) {
			var type,
			    field,
			    rtn = this.joins[tableName],
			    myTable = this.getTable(),
			    joins = myTable.joins,
			    join = joins[tableName];

			if (!rtn) {
				if (bmoor.isObject(join)) {
					type = join.type;
					field = join.field;
				} else {
					type = 'oneway';
					field = join;
				}

				rtn = this[type + 'Join'](tableName, this.$(field));

				this.joins[tableName] = rtn;
			} else if (!join) {
				throw new Error('Missing join to table: ' + tableName);
			}

			return rtn;
		}
	}, {
		key: 'onewayJoin',
		value: function onewayJoin(tableName, searchValue) {
			var foreignTable = schema.get(tableName);

			if (foreignTable) {
				return bmoor.isArray(searchValue) ? foreignTable.getMany(searchValue) : foreignTable.get(searchValue);
			} else {
				throw new Error(tableName + ' is not a known table');
			}
		}
	}, {
		key: 'twowayJoin',
		value: function twowayJoin(tableName, searchValue) {
			var foreignTable = schema.get(tableName);

			if (foreignTable) {
				var myTable = this.getTable().name,
				    foreignJoin = foreignTable.joins[myTable];

				if (foreignJoin) {
					var foreignKey = bmoor.isString(foreignJoin) ? foreignJoin : foreignJoin.field;

					return foreignTable.select(_defineProperty({}, foreignKey, searchValue));
				} else {
					throw new Error('Can not twoway join to ' + tableName + ', no back join found');
				}
			} else {
				throw new Error(tableName + ' is not a known table');
			}
		}
	}]);

	return JoinableProxy;
}(DataProxy);

module.exports = JoinableProxy;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing,
    getUid = bmoor.data.getUid,
    makeGetter = bmoor.makeGetter,
    Mapper = __webpack_require__(15).Mapper;

var Pool = function (_Eventing) {
	_inherits(Pool, _Eventing);

	function Pool() {
		_classCallCheck(this, Pool);

		var _this = _possibleConstructorReturn(this, (Pool.__proto__ || Object.getPrototypeOf(Pool)).call(this));

		bmoor.data.setUid(_this);

		_this.data = [];
		_this.feeds = {};
		_this.index = {};
		return _this;
	}

	_createClass(Pool, [{
		key: 'addFeed',
		value: function addFeed(feed, index, readings) {
			var dex = makeGetter(index),
			    uid = getUid(feed),
			    data = this.data,
			    dexs = this.index,
			    mapper = new Mapper(readings).go,
			    trigger = this.trigger.bind(this);

			function read(datum) {
				var i = dex(datum),
				    // identity
				d = dexs[i];

				if (!d) {
					d = dexs[i] = {
						_: i
					};
					data.push(d);
				}

				mapper(d, datum);

				trigger('update');
			}

			if (!this.feeds[uid]) {
				this.feeds[uid] = feed.on('insert', read);
			}
		}
	}]);

	return Pool;
}(Eventing);

module.exports = Pool;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(16),
	Mapper: __webpack_require__(17),
	Mapping: __webpack_require__(6),
	Path: __webpack_require__(2),
	translate: __webpack_require__(18),
	validate: __webpack_require__(19)
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bmoor = __webpack_require__(0),
    ops;

function parse(def, path, val) {
	var method;

	if (val === null || val === undefined) {
		return;
	}

	if (bmoor.isArray(val)) {
		method = 'array';
	} else {
		method = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	}

	ops[method](def, path, val);
}

ops = {
	array: function array(def, path, val) {
		var next = val[0];

		parse(def, path + '[]', next);
	},
	object: function object(def, path, val) {
		if (path.length) {
			path += '.';
		}

		Object.keys(val).forEach(function (key) {
			parse(def, path + key, val[key]);
		});
	},
	number: function number(def, path, val) {
		def.push({
			path: path,
			type: 'number',
			sample: val
		});
	},
	boolean: function boolean(def, path, val) {
		def.push({
			path: path,
			type: 'boolean',
			sample: val
		});
	},
	string: function string(def, path, val) {
		def.push({
			path: path,
			type: 'string',
			sample: val
		});
	}
};

function encode(json) {
	var t = [];

	if (json) {
		parse(t, '', json);

		return t;
	} else {
		return json;
	}
}

encode.$ops = ops;

module.exports = encode;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = __webpack_require__(2),
    bmoor = __webpack_require__(0),
    Mapping = __webpack_require__(6);

function stack(fn, old) {
	if (old) {
		return function (to, from) {
			old(to, from);
			fn(to, from);
		};
	} else {
		return fn;
	}
}

// TODO : merging arrays

// converts one object structure to another

var Mapper = function () {
	function Mapper(settings) {
		var _this = this;

		_classCallCheck(this, Mapper);

		this.mappings = {};

		// this.run is defined via recursive stacks
		if (settings) {
			Object.keys(settings).forEach(function (to) {
				var from = settings[to];

				if (bmoor.isObject(from)) {
					// so it's an object, parent is an array
					if (from.to) {
						to = from.to;
					}

					if (from.from) {
						from = from.from;
					} else {
						throw new Error('I can not find a from clause');
					}
				}

				_this.addMapping(to, from);
			});
		}
	}

	_createClass(Mapper, [{
		key: 'addMapping',
		value: function addMapping(toPath, fromPath) {
			var to = new Path(toPath),
			    from = new Path(fromPath),
			    dex = to.leading + '-' + from.leading,
			    mapping = this.mappings[dex];

			if (mapping) {
				mapping.addChild(to.remainder, from.remainder);
			} else {
				mapping = new Mapping(to, from);
				this.mappings[dex] = mapping;

				this.go = stack(mapping.go, this.go);
			}
		}
	}]);

	return Mapper;
}();

module.exports = Mapper;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function go(from, root, info) {
	var cur = from.shift();

	if (cur[cur.length - 1] === ']') {
		cur = cur.substr(0, cur.length - 2);

		if (cur === '') {
			// don't think anything...
		} else {
			if (!root[cur]) {
				root[cur] = {
					type: 'array'
				};
			}
			root = root[cur];
		}
		cur = 'items';
	}

	if (from.length) {
		if (!root[cur]) {
			root[cur] = {
				type: 'object',
				properties: {}
			};
		}
		go(from, root[cur].properties, info);
	} else {
		root[cur] = info;
	}
}

function split(str) {
	return str.replace(/]([^\.$])/g, '].$1').split('.');
}

function encode(schema) {
	var i,
	    c,
	    d,
	    t,
	    rtn,
	    root,
	    path = schema[0].to || schema[0].path;

	if (split(path)[0] === '[]') {
		rtn = { type: 'array' };
		root = rtn;
	} else {
		rtn = { type: 'object', properties: {} };
		root = rtn.properties;
	}

	for (i = 0, c = schema.length; i < c; i++) {
		d = schema[i];

		path = d.to || d.path;

		t = { type: d.type };

		if (d.from) {
			t.alias = d.from;
		}

		go(split(path), root, t);
	}

	return rtn;
}

module.exports = encode;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(2);

var tests = [function (def, v, errors) {
	if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type) {
		errors.push({
			path: def.path,
			type: 'type',
			value: v,
			expect: def.type
		});
	}
}];

function validate(schema, obj) {
	var errors = [];

	schema.forEach(function (def) {
		new Path(def.path).exec(obj, function (v) {
			tests.forEach(function (fn) {
				fn(def, v, errors);
			});
		});
	});

	if (errors.length) {
		return errors;
	} else {
		return null;
	}
}

validate.$ops = tests;

module.exports = validate;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Feed = __webpack_require__(5),
    Hash = __webpack_require__(7),
    Test = __webpack_require__(8),
    setUid = bmoor.data.setUid;

function testStack(old, fn) {
	if (old) {
		return function (massaged, ctx) {
			if (fn(massaged, ctx)) {
				return true;
			} else {
				return old(massaged, ctx);
			}
		};
	} else {
		return fn;
	}
}

function memorized(parent, cache, expressor, generator, settings) {
	var rtn, index, oldDisconnect;

	if (!parent[cache]) {
		parent[cache] = {};
	}

	index = parent[cache];

	// console.log( '->', expressor.hash );
	rtn = index[expressor.hash];

	if (!rtn) {
		if (!settings) {
			settings = {};
		}

		if (settings.disconnect) {
			oldDisconnect = settings.disconnect;
		}

		settings.disconnect = function () {
			if (oldDisconnect) {
				oldDisconnect();
			}

			index[expressor.hash] = null;
		};

		rtn = generator(expressor, parent, settings);

		index[expressor.hash] = rtn;
	}

	return rtn;
}

function _route(dex, parent) {
	var old = {},
	    index = {},
	    _get = function _get(key) {
		var collection = index[key];

		if (!collection) {
			collection = parent.getChild(false);
			index[key] = collection;
		}

		return collection;
	};

	function add(datum) {
		var d = dex.go(datum);

		old[setUid(datum)] = d;

		_get(d).add(datum);
	}

	function _remove(datum) {
		var dex = setUid(datum);

		if (dex in old) {
			_get(old[dex]).remove(datum);
		}
	}

	for (var i = 0, c = parent.data.length; i < c; i++) {
		add(parent.data[i]);
	}

	var _disconnect = parent.subscribe({
		insert: function insert(datum) {
			add(datum);
		},
		remove: function remove(datum) {
			_remove(datum);
		}
	});

	return {
		get: function get(search) {
			return _get(dex.go(search));
		},
		reroute: function reroute(datum) {
			_remove(datum);
			add(datum);
		},
		keys: function keys() {
			return Object.keys(index);
		},
		disconnect: function disconnect() {
			_disconnect();
		}
	};
}

function _index(dex, parent) {
	var index = {};

	for (var i = 0, c = parent.data.length; i < c; i++) {
		var datum = parent.data[i],
		    key = dex.go(datum);

		index[key] = datum;
	}

	var _disconnect2 = parent.subscribe({
		insert: function insert(datum) {
			var key = dex.go(datum);
			index[key] = datum;
		},
		remove: function remove(datum) {
			var key = dex.go(datum);
			delete index[key];
		}
	});

	return {
		get: function get(search) {
			var key = dex.go(search);
			return index[key];
		},
		keys: function keys() {
			return Object.keys(index);
		},
		disconnect: function disconnect() {
			_disconnect2();
		}
	};
}

function _filter(dex, parent, settings) {
	var child;

	settings = Object.assign({}, {
		insert: function insert(datum) {
			if (dex.go(datum)) {
				child.add(datum);
			}
		}
	}, settings);

	child = parent.getChild(settings);

	child.go = bmoor.flow.window(function () {
		var datum,
		    insert,
		    arr = parent.data;

		child.empty();

		if (settings.before) {
			settings.before();
		}

		if (child.hasWaiting('insert')) {
			// performance optimization
			insert = function insert(datum) {
				Array.prototype.push.call(child.data, datum);
				child.trigger('insert', datum);
			};
		} else {
			insert = function insert(datum) {
				Array.prototype.push.call(child.data, datum);
			};
		}

		for (var i = 0, c = arr.length; i < c; i++) {
			datum = arr[i];
			if (dex.go(datum)) {
				insert(datum);
			}
		}

		if (settings.after) {
			settings.after();
		}

		child.trigger('process');
	}, settings.min || 5, settings.max || 30);

	child.go.flush();

	return child;
}

var Collection = function (_Feed) {
	_inherits(Collection, _Feed);

	function Collection() {
		_classCallCheck(this, Collection);

		return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
	}

	_createClass(Collection, [{
		key: 'remove',
		value: function remove(datum) {
			var dex = this.data.indexOf(datum);

			if (dex !== -1) {
				this.data.splice(dex, 1);

				this.trigger('remove', datum);

				this.trigger('update');
			}
		}
	}, {
		key: 'empty',
		value: function empty() {
			var arr = this.data;

			if (this.hasWaiting('remove')) {
				for (var i = 0, c = arr.length; i < c; i++) {
					this.trigger('remove', arr[i]);
				}
			}

			this.trigger('update');

			arr.length = 0;
		}
	}, {
		key: 'getChild',
		value: function getChild(settings) {
			var child = new this.constructor(null, settings);

			child.parent = this;

			if (settings !== false) {
				var done = this.subscribe(Object.assign({
					insert: function insert(datum) {
						child.add(datum);
					},
					remove: function remove(datum) {
						child.remove(datum);
					},
					process: function process() {
						child.go();
					},
					destroy: function destroy() {
						child.destroy();
					}
				}, settings));

				child.disconnect = function () {
					if (settings.disconnect) {
						settings.disconnect();
					}

					done();
				};

				child.destroy = function () {
					child.disconnect();

					child.trigger('destroy');
				};
			}

			return child;
		}
	}, {
		key: 'index',
		value: function index(search, settings) {
			return memorized(this, 'indexes', search instanceof Hash ? search : new Hash(search, settings), _index);
		}
	}, {
		key: 'get',
		value: function get(search, settings) {
			this.index(search, settings).get(search);
		}
	}, {
		key: 'route',
		value: function route(search, settings) {
			return memorized(this, 'routes', search instanceof Hash ? search : new Hash(search, settings), _route);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			return memorized(this, 'filters', search instanceof Test ? search : new Test(search, settings), _filter, settings);
		}
	}, {
		key: 'search',
		value: function search(settings) {
			var ctx, test;

			for (var i = settings.tests.length - 1; i !== -1; i--) {
				test = testStack(test, settings.tests[i]);
			}

			return this.filter(function (datum) {
				if (!datum.$massaged) {
					datum.$massaged = settings.massage(datum);
				}

				return test(datum.$massaged, ctx);
			}, {
				before: function before() {
					ctx = settings.normalize();
				},
				hash: 'search:' + Date.now()
			});
		}

		// settings { size }

	}, {
		key: 'paginate',
		value: function paginate(settings) {
			var child;

			settings = Object.assign({}, {
				insert: function insert(datum) {
					child.add(datum);

					child.go();
				},
				remove: function remove(datum) {
					child.remove(datum);

					child.go();
				},
				process: function process() {
					child.go();
				}
			}, settings);

			child = this.getChild(settings);

			var origSize = settings.size;

			child.go = bmoor.flow.window(function () {
				var span = settings.size,
				    length = this.parent.data.length,
				    steps = Math.ceil(length / span);

				this.nav.span = span;
				this.nav.steps = steps;
				this.nav.count = length;

				var start = this.nav.pos * span,
				    stop = start + span;

				this.nav.start = start;
				this.nav.stop = stop;

				this.empty();

				for (var i = start; i < stop && i < length; i++) {
					this.add(this.parent.data[i]);
				}

				child.trigger('process');
			}, settings.min || 5, settings.max || 30, { context: child });

			child.nav = {
				pos: settings.start || 0,
				goto: function goto(pos) {
					this.pos = pos;
					child.go();
				},
				hasNext: function hasNext() {
					return this.stop < this.count;
				},
				next: function next() {
					this.pos++;
					child.go();
				},
				hasPrev: function hasPrev() {
					return !!this.start;
				},
				prev: function prev() {
					this.pos--;
					child.go();
				},
				setSize: function setSize(size) {
					settings.size = size;
				},
				maxSize: function maxSize() {
					settings.size = child.parent.data.length;
				},
				resetSize: function resetSize() {
					settings.size = origSize;
				}
			};

			child.go.flush();

			return child;
		}
	}]);

	return Collection;
}(Feed);

module.exports = Collection;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing;

function _datumStack(fn, old) {
	if (old) {
		return function (datum, orig) {
			return fn(old(datum, orig), orig);
		};
	} else {
		return function (orig) {
			return fn(orig, orig);
		};
	}
}

function datumStack(fns) {
	var i, c, fn;

	for (i = 0, c = fns.length; i < c; i++) {
		fn = _datumStack(fns[i], fn);
	}

	return fn;
}

function _arrStack(fn, old) {
	if (old) {
		return function (src) {
			return fn(old(src));
		};
	} else {
		return fn;
	}
}

function arrStack(fns) {
	var i, c, fn;

	for (i = 0, c = fns.length; i < c; i++) {
		fn = _arrStack(fns[i], fn);
	}

	return fn;
}

// array wrapper that allows for watching a feed 

var Converter = function (_Eventing) {
	_inherits(Converter, _Eventing);

	function Converter(arrFn, datumFn) {
		_classCallCheck(this, Converter);

		var _this = _possibleConstructorReturn(this, (Converter.__proto__ || Object.getPrototypeOf(Converter)).call(this));

		bmoor.data.setUid(_this);

		_this.data = [];

		_this.setArrayCriteria(arrFn);
		_this.setDatumCriteria(datumFn);
		return _this;
	}

	_createClass(Converter, [{
		key: 'setArrayCriteria',
		value: function setArrayCriteria(fns) {
			if (fns) {
				this.arrParse = arrStack(fns);
			} else {
				this.arrParse = null;
			}
		}
	}, {
		key: 'setDatumCriteria',
		value: function setDatumCriteria(fns) {
			if (fns) {
				this.datumParse = datumStack(fns);
			} else {
				this.datumParse = null;
			}
		}

		// I don't want to force it to be Feed, just needs .on and .data
		// technically converters can stack

	}, {
		key: 'setFeed',
		value: function setFeed(feed) {
			var dis = this;

			if (this.disconnect) {
				this.disconnect();
			}

			function readAll(changes) {
				var i, c, arr;

				if (changes && changes.length) {
					if (dis.arrParse) {
						arr = dis.arrParse(changes);
					} else {
						arr = changes.slice(0);
					}

					if (dis.datumParse) {
						for (i = 0, c = arr.length; i < c; i++) {
							arr[i] = dis.datumParse(arr[i]);
						}
					}

					dis.data = dis.data.concat(arr);
					dis.trigger('insert', arr);
				}
			}

			readAll(feed.data);
			this.disconnect = feed.on('insert', readAll);
		}
	}]);

	return Converter;
}(Eventing);

module.exports = Converter;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Eventing = bmoor.Eventing;

function makeMask(target, override) {
	var mask = bmoor.isArray(target) ? target.slice(0) : Object.create(target);

	// I'm being lazy
	Object.keys(target).forEach(function (k) {
		if (bmoor.isObject(target[k])) {
			mask[k] = makeMask(target[k], bmoor.isObject(override) ? override[k] : null);
		}
	});

	if (override) {
		Object.keys(override).forEach(function (k) {
			var m = mask[k],
			    o = override[k],
			    bothObj = bmoor.isObject(m) && bmoor.isObject(o);

			if ((!(k in mask) || !bothObj) && o !== m) {
				mask[k] = o;
			}
		});
	}

	return mask;
}

function _isDirty(obj) {
	var i,
	    c,
	    t,
	    keys = Object.keys(obj);

	for (i = 0, c = keys.length; i < c; i++) {
		t = obj[keys[i]];

		if (!bmoor.isObject(t) || _isDirty(t)) {
			return true;
		}
	}

	return false;
}

function _getChanges(obj) {
	var rtn = {},
	    valid = false;

	Object.keys(obj).forEach(function (k) {
		var d = obj[k];

		if (bmoor.isObject(d)) {
			d = _getChanges(d);
			if (d) {
				valid = true;
				rtn[k] = d;
			}
		} else {
			valid = true;
			rtn[k] = d;
		}
	});

	if (valid) {
		return rtn;
	}
}

function _map(delta, obj) {
	Object.keys(delta).forEach(function (k) {
		var d = delta[k],
		    o = obj[k];

		if (d !== o) {
			if (bmoor.isObject(d) && bmoor.isObject(o)) {
				_map(d, o);
			} else {
				obj[k] = d;
			}
		}
	});
}

var Proxy = function (_Eventing) {
	_inherits(Proxy, _Eventing);

	function Proxy(obj) {
		_classCallCheck(this, Proxy);

		var _this = _possibleConstructorReturn(this, (Proxy.__proto__ || Object.getPrototypeOf(Proxy)).call(this));

		_this.getDatum = function () {
			return obj;
		};
		return _this;
	}

	_createClass(Proxy, [{
		key: 'getMask',
		value: function getMask(override) {
			if (!this.mask || override) {
				this.mask = makeMask(this.getDatum(), override);
			}

			return this.mask;
		}
	}, {
		key: '$',
		value: function $(path) {
			return bmoor.get(this.getDatum(), path);
		}
	}, {
		key: 'getChanges',
		value: function getChanges() {
			return _getChanges(this.mask);
		}
	}, {
		key: 'isDirty',
		value: function isDirty() {
			return _isDirty(this.mask);
		}
	}, {
		key: 'map',
		value: function map(delta) {
			var mask = this.getMask();

			_map(delta, mask);

			return mask;
		}
	}, {
		key: 'merge',
		value: function merge(delta) {
			if (!delta) {
				delta = this.mask;
			}

			bmoor.object.merge(this.getDatum(), delta);

			this.mask = null;
			this.trigger('update', delta);
		}
	}, {
		key: 'trigger',
		value: function trigger() {
			// always make the datum be the last argument passed
			arguments[arguments.length] = this.getDatum();
			arguments.length++;

			_get(Proxy.prototype.__proto__ || Object.getPrototypeOf(Proxy.prototype), 'trigger', this).apply(this, arguments);
		}
	}]);

	return Proxy;
}(Eventing);

Proxy.isDirty = _isDirty;
Proxy.getChanges = _getChanges;

module.exports = Proxy;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.ES6Promise = factory();
})(undefined, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;
  if (!Array.isArray) {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = __webpack_require__(26);
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;

    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    _resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
        GET_THEN_ERROR.error = null;
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value.error = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  };

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    _reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;

  Promise.prototype = {
    constructor: Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
    
      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
    
      Chaining
      --------
    
      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
    
      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
    
      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
    
      Assimilation
      ------------
    
      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
    
      If the assimliated promise rejects, then the downstream promise will also reject.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
    
      Simple Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let result;
    
      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
    
      Advanced Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let author, books;
    
      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
    
      function foundBooks(books) {
    
      }
    
      function failure(reason) {
    
      }
    
      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
    
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
    
      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
    
      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
    
      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
    
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  }

  // Strange compat..
  Promise.polyfill = polyfill;
  Promise.Promise = Promise;

  return Promise;
});
//# sourceMappingURL=es6-promise.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24), __webpack_require__(25)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);