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
	Pool: __webpack_require__(13),
	Collection: __webpack_require__(19),
	stream: {
		Converter: __webpack_require__(20)
	},
	object: {
		Proxy: __webpack_require__(21),
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

	function Feed(src, settings) {
		_classCallCheck(this, Feed);

		var _this = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this));

		if (!src) {
			src = [];
			_this.settings = {};
		} else if (Array.isArray(src)) {
			_this.settings = settings || {};
			src.push = src.unshift = _this.add.bind(_this);
		} else {
			_this.settings = src;
			src = [];
		}

		setUid(_this);

		_this.data = src;
		return _this;
	}

	_createClass(Feed, [{
		key: '_add',
		value: function _add(datum) {
			oldPush.call(this.data, datum);
		}
	}, {
		key: 'add',
		value: function add(datum) {
			this._add(datum);

			this.trigger('insert', datum);

			this.trigger('update');
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var i, c;

			for (i = 0, c = arr.length; i < c; i++) {
				var d = arr[i];
				this._add(d);
				this.trigger('insert', d);
			}

			this.trigger('update');
		}
	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this2 = this;

			parent.subscribe(Object.assign({
				insert: function insert(datum) {
					_this2.add(datum);
				},
				remove: function remove(datum) {
					_this2.remove(datum);
				},
				process: function process() {
					if (_this2.go) {
						_this2.go();
					}
				},
				destroy: function destroy() {
					_this2.destroy();
				}
			}, settings));
		}

		// I want to remove this

	}, {
		key: 'sort',
		value: function sort(fn) {
			console.warn('this will be removed soon');
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
	Table: __webpack_require__(12),
	Proxy: __webpack_require__(22),
	Collection: __webpack_require__(23)
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var schema = __webpack_require__(4);

// TODO : I don't think this should always call all?
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
					before: table.before,
					search: table.connector.search,
					intercept: table.connector.all.$settings.intercept
				};

				table.before = makeStub(table, prev.before);

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
    schema = __webpack_require__(3),
    Test = __webpack_require__(1).object.Test,
    DataProxy = __webpack_require__(1).object.Proxy,
    DataCollection = __webpack_require__(1).Collection;

var defaultSettings = {
	proxyFactory: function proxyFactory(datum) {
		return new DataProxy(datum);
	},
	collectionFactory: function collectionFactory() {
		return new DataCollection();
	}
};

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

		if (ops.proxy && !ops.proxyFactory) {
			console.warn('ops.proxy will be deprecated in next major version');
			ops.proxyFactory = function (datum) {
				return new ops.proxy(datum);
			};
		}

		this.proxyFactory = ops.proxyFactory || defaultSettings.proxyFactory;
		this.collectionFactory = ops.collectionFactory || defaultSettings.collectionFactory;

		if (!ops.id) {
			throw new Error('bmoor-comm::Table requires a id field of function');
		}

		// If performance matters, use bmoor-data's Proxy
		this.before = ops.before || function () {
			return Promise.resolve(true);
		};

		this.normalize = ops.normalize || function () {};

		if (bmoor.isFunction(id)) {
			this.$encode = function (qry) {
				if (qry instanceof DataProxy) {
					return qry.getDatum();
				} else {
					return qry;
				}
			};
			parser = id;
		} else if (bmoor.isString(id)) {
			this.$encode = function (qry) {
				var t;

				if (qry instanceof DataProxy) {
					return qry.getDatum();
				} else if (bmoor.isObject(qry)) {
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
			this.collection = this.collectionFactory(this);
			this.index = this.collection.index(this.$id);
			this._selections = {};

			if (this.gotten) {
				this.gotten = {};
			}
		}

		// no promise routes

	}, {
		key: 'find',
		value: function find(dex) {
			if (bmoor.isObject(dex)) {
				dex = this.$id(dex);
			}

			return this.index.get(dex);
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
					t = this.proxyFactory(obj, this);

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

			if (!options) {
				options = {};
			}

			// batch in the number of seconds you wait for another call
			// allow for the default to be batching
			if ('batch' in options || 'batch' in defaultSettings) {
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
							}, 'batch' in options ? options.batch : defaultSettings.batch);
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
						if (options.hook) {
							options.hook(res);
						}

						return _this2._set(res);
					});
				};
			}

			return this.before('get').then(function () {
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

			if (!options) {
				options = {};
			}

			return this.before('get-many', arr).then(function () {
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
						if (options.hook) {
							options.hook(res);
						}

						res.forEach(function (r) {
							_this3._set(r);
						});
					});
				} else {
					rtn = Promise.resolve(true); // nothing to do
				}

				return rtn.then(function () {
					var collection = _this3.collectionFactory(_this3);

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

			if (!options) {
				options = {};
			}

			return this.before('all').then(function () {
				if (!_this4.$all || options.cached === false) {
					_this4.$all = _this4.connector.all(obj, null, options).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

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

			if (!options) {
				options = {};
			}

			return this.before('insert', obj).then(function () {
				var t = _this5.find(obj);

				if (t) {
					throw new Error('This already exists ' + JSON.stringify(obj));
				} else {
					return _this5.connector.create(obj, obj, options).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

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

			if (!options) {
				options = {};
			}

			return this.before('update', from, delta).then(function () {
				var proxy;

				if (from instanceof Proxy) {
					proxy = from;
					from = from.getDatum();
				} else {
					from = _this6.$encode(from);
					proxy = _this6.find(from);
				}

				if (!delta) {
					delta = proxy.getChanges();
				}

				if (proxy) {
					return _this6.connector.update(from, delta, options).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						if (!options.ignoreDelta) {
							proxy.merge(delta);
						}

						if (!options.ignoreResponse && bmoor.isObject(res)) {
							proxy.merge(res);
						}

						return proxy;
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

			if (!options) {
				options = {};
			}

			return this.before('delete', obj).then(function () {
				var proxy = _this7.find(obj);

				if (proxy) {
					var datum = proxy.getDatum();

					return _this7.connector.delete(datum, datum, options).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						_this7.del(obj);

						return proxy;
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

			return this.before('select', qry).then(function () {
				var op,
				    rtn,
				    test,
				    selection,
				    selections = _this8._selections;

				if (!options) {
					options = {};
				}

				_this8.normalize(qry);

				test = options instanceof Test ? options : options.test || new Test(options.fn || qry, {
					hash: options.hash,
					massage: options.massage || _this8.$datum
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
						if (options.hook) {
							options.hook(res);
						}

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
Table.settings = defaultSettings;

module.exports = Table;

/***/ }),
/* 13 */
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
    Mapper = __webpack_require__(14).Mapper;

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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(15),
	Mapper: __webpack_require__(16),
	Mapping: __webpack_require__(6),
	Path: __webpack_require__(2),
	translate: __webpack_require__(17),
	validate: __webpack_require__(18)
};

/***/ }),
/* 15 */
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
/* 16 */
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
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

function _sorted(dex, parent, settings) {
	var child;

	settings = Object.assign({
		follow: true,
		insert: function insert(datum) {
			child.add(datum);
			child.go();
		},
		update: function update() {
			child.go();
		}
	}, settings);

	child = parent.getChild(settings);

	for (var i = 0, c = parent.data.length; i < c; i++) {
		child.add(parent.data[i]);
	}

	child.go = bmoor.flow.window(function () {
		if (settings.before) {
			settings.before();
		}

		child.data.sort(dex.go);

		if (settings.after) {
			settings.after();
		}

		child.trigger('process');
	}, settings.min || 5, settings.max || 30);

	child.go.flush();

	return child;
}

function mapped(dex, parent, settings) {
	var child;

	settings = Object.assign({}, {
		insert: function insert(datum) {
			// I only need to 
			child.add(dex.go(datum));
		}
		// remove should use a look-aside
	}, settings);

	child = parent.getChild(settings);

	child.go = bmoor.flow.window(function () {
		var datum,
		    arr = parent.data;

		child.empty();

		if (settings.before) {
			settings.before();
		}

		for (var i = 0, c = arr.length; i < c; i++) {
			datum = arr[i];

			child.add(dex.go(datum));
		}

		if (settings.after) {
			settings.after();
		}

		child.trigger('process');
	}, settings.min || 5, settings.max || 30);

	child.go.flush();

	return child;
}

function _filter(dex, parent, settings) {
	var child;

	settings = Object.assign({
		follow: true,
		insert: function insert(datum) {
			if (dex.go(datum)) {
				child.add(datum);
			}
		}
	}, settings);

	child = parent.getChild(settings);

	child.go = bmoor.flow.window(function () {
		var datum,
		    arr = parent.data;

		child.empty();

		if (settings.before) {
			settings.before();
		}

		for (var i = 0, c = arr.length; i < c; i++) {
			datum = arr[i];
			if (dex.go(datum)) {
				child.add(datum);
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
		key: '_add',
		value: function _add(datum) {
			var _this2 = this;

			if (this.settings.follow && datum.on) {
				datum.on[this.$$bmoorUid] = datum.on('update', function () {
					_this2.go();
				});
			}

			_get2(Collection.prototype.__proto__ || Object.getPrototypeOf(Collection.prototype), '_add', this).call(this, datum);
		}

		// remove a datum from the collection

	}, {
		key: '_remove',
		value: function _remove(datum) {
			var dex = this.data.indexOf(datum);

			if (dex !== -1) {
				if (dex === 0) {
					this.data.shift();
				} else {
					this.data.splice(dex, 1);
				}

				if (this.settings.follow && datum.on) {
					datum.on[this.$$bmoorUid]();
				}

				return datum;
			}
		}
	}, {
		key: 'remove',
		value: function remove(datum) {
			var rtn = this._remove(datum);

			if (rtn) {
				this.trigger('remove', rtn);

				this.trigger('update');

				return rtn;
			}
		}

		// remove all datums from the collection

	}, {
		key: 'empty',
		value: function empty() {
			var arr = this.data;

			while (arr.length) {
				var d = arr[0];

				this._remove(d);
				this.trigger('remove', d);
			}

			this.trigger('update');
		}

		// follow a parent collection

	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this3 = this;

			var disconnect = parent.subscribe(Object.assign({
				insert: function insert(datum) {
					_this3.add(datum);
				},
				remove: function remove(datum) {
					_this3.remove(datum);
				},
				process: function process() {
					_this3.go();
				},
				destroy: function destroy() {
					_this3.destroy();
				}
			}, settings));

			if (this.disconnect) {
				var old = this.disconnect;
				this.disconnect = function () {
					old();
					disconnect();
				};
			} else {
				this.disconnect = disconnect;
			}

			// if you just want to disconnect form this one
			// you can later be specific
			return disconnect;
		}
	}, {
		key: 'getChild',
		value: function getChild(settings) {
			var ChildClass = (settings ? settings.childClass : null) || this.constructor,
			    child = new ChildClass(settings);

			child.parent = this;

			if (settings !== false) {
				child.follow(this, settings);
				var done = child.disconnect;

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
			return memorized(this, 'indexes', search instanceof Hash ? search : new Hash(search, settings), _index, settings);
		}
	}, {
		key: 'get',
		value: function get(search, settings) {
			this.index(search, settings).get(search);
		}
	}, {
		key: 'route',
		value: function route(search, settings) {
			return memorized(this, 'routes', search instanceof Hash ? search : new Hash(search, settings), _route, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			return memorized(this, 'filters', search instanceof Test ? search : new Test(search, settings), _filter, settings);
		}

		// TODO : create the Compare class, then memorize this

	}, {
		key: 'sorted',
		value: function sorted(sortFn, settings) {
			return memorized(this, 'sorts', {
				hash: sortFn.toString(),
				go: sortFn
			}, _sorted, settings);
		}
	}, {
		key: 'map',
		value: function map(mapFn, settings) {
			return memorized(this, 'maps', {
				hash: mapFn.toString(),
				go: mapFn
			}, mapped, settings);
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
			var child,
			    parent = this;

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
				    length = parent.data.length,
				    steps = Math.ceil(length / span);

				this.nav.span = span;
				this.nav.steps = steps;
				this.nav.count = length;

				var start = this.nav.pos * span,
				    stop = start + span;

				this.nav.start = start;
				if (stop > length) {
					stop = length;
				}
				this.nav.stop = stop;

				this.empty();

				for (var i = start; i < stop; i++) {
					this.add(this.parent.data[i]);
				}

				child.trigger('process');
			}, settings.min || 5, settings.max || 30, { context: child });

			var nav = {
				pos: settings.start || 0,
				goto: function goto(pos) {
					if (bmoor.isObject(pos)) {
						var tPos = parent.data.indexOf(pos);

						if (tPos === -1) {
							pos = 0;
						} else {
							pos = Math.floor(tPos / settings.size);
						}
					}

					if (pos < 0) {
						pos = 0;
					}

					if (pos !== this.pos) {
						this.pos = pos;
						child.go();
					}
				},
				hasNext: function hasNext() {
					return this.stop < this.count;
				},
				next: function next() {
					this.goto(this.pos + 1);
				},
				hasPrev: function hasPrev() {
					return !!this.start;
				},
				prev: function prev() {
					this.goto(this.pos - 1);
				},
				setSize: function setSize(size) {
					this.pos = -1;
					settings.size = size;
					this.goto(0);
				},
				maxSize: function maxSize() {
					this.setSize(child.parent.data.length);
				},
				resetSize: function resetSize() {
					this.setSize(origSize);
				}
			};

			child.nav = nav;
			child.go.flush();

			return child;
		}
	}]);

	return Collection;
}(Feed);

module.exports = Collection;

/***/ }),
/* 20 */
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
/* 21 */
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
	var keys = Object.keys(obj);

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i];

		if (k.charAt(0) !== '$') {
			var t = obj[k];

			if (!bmoor.isObject(t) || _isDirty(t)) {
				return true;
			}
		}
	}

	return false;
}

function _getChanges(obj) {
	var rtn = {},
	    valid = false,
	    keys = Object.keys(obj);

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i];

		if (k.charAt(0) !== '$') {
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
		}
	}

	if (valid) {
		return rtn;
	}
}

function _map(delta, obj) {
	var keys = Object.keys(delta);

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i],
		    d = delta[k],
		    o = obj[k];

		if (k.charAt(0) !== '$') {
			if (d !== o) {
				if (bmoor.isObject(d) && bmoor.isObject(o)) {
					_map(d, o);
				} else {
					obj[k] = d;
				}
			}
		}
	}
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

		// create a deep copy of the datum.  if applyMask == true, 
		// we copy the mask on top as well.  Can be used for stringify then

	}, {
		key: 'copy',
		value: function copy(applyMask) {
			var rtn = {};

			bmoor.object.merge(rtn, this.getDatum());
			if (applyMask) {
				bmoor.object.merge(rtn, this.getMask());
			}

			return rtn;
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
	}, {
		key: 'toJson',
		value: function toJson() {
			return JSON.stringify(this.getDatum());
		}
	}]);

	return Proxy;
}(Eventing);

Proxy.isDirty = _isDirty;
Proxy.getChanges = _getChanges;

module.exports = Proxy;

/***/ }),
/* 22 */
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
	}]);

	return JoinableProxy;
}(DataProxy);

module.exports = JoinableProxy;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    DataCollection = __webpack_require__(1).Collection;

var defaultSettings = {};

function configSettings(settings) {
	if (!settings) {
		settings = {};
	}

	if (!('massage' in settings)) {
		settings.massage = function (proxy) {
			return proxy.getDatum();
		};
	}

	return settings;
}

console.log('data-collection', DataCollection);

var Collection = function (_DataCollection) {
	_inherits(Collection, _DataCollection);

	function Collection() {
		_classCallCheck(this, Collection);

		return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
	}

	_createClass(Collection, [{
		key: 'index',
		value: function index(search, settings) {
			if (!bmoor.isFunction(search)) {
				settings = configSettings(settings);
			}

			return _get(Collection.prototype.__proto__ || Object.getPrototypeOf(Collection.prototype), 'index', this).call(this, search, settings);
		}
	}, {
		key: 'route',
		value: function route(search, settings) {
			if (!bmoor.isFunction(search)) {
				settings = configSettings(settings);
			}

			return _get(Collection.prototype.__proto__ || Object.getPrototypeOf(Collection.prototype), 'route', this).call(this, search, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			if (!bmoor.isFunction(search)) {
				settings = configSettings(settings);
			}

			return _get(Collection.prototype.__proto__ || Object.getPrototypeOf(Collection.prototype), 'filter', this).call(this, search, settings);
		}
	}, {
		key: 'search',
		value: function search(settings) {
			settings = configSettings(settings);

			return _get(Collection.prototype.__proto__ || Object.getPrototypeOf(Collection.prototype), 'search', this).call(this, settings);
		}
	}]);

	return Collection;
}(DataCollection);

Collection.settings = defaultSettings;

module.exports = Collection;

/***/ })
/******/ ]);