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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
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
	Pool: __webpack_require__(18),
	Collection: __webpack_require__(7),
	collection: {
		Proxied: __webpack_require__(33)
	},
	stream: {
		Converter: __webpack_require__(34)
	},
	object: {
		Proxy: __webpack_require__(10),
		Test: __webpack_require__(9),
		Hash: __webpack_require__(8)
	},
	structure: {
		Model: __webpack_require__(35).default,
		Schema: __webpack_require__(11).default
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var schema = __webpack_require__(0).Memory.use('cache-table-schema');

module.exports = {
	default: schema
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    makeGetter = bmoor.makeGetter,

// makeSetter = bmoor.makeSetter,
// Writer = require('./path/Writer.js').default,
// Reader = require('./path/Reader.js').default,
Tokenizer = __webpack_require__(6).default;

var Path = function () {
	// normal path: foo.bar
	// array path : foo[].bar
	function Path(path) {
		_classCallCheck(this, Path);

		if (path instanceof Tokenizer) {
			this.tokenizer = path;
		} else {
			this.tokenizer = new Tokenizer(path);
		}

		this.root = this.tokenizer.tokens[0];
		this.hasArray = this.root.isArray;
	}

	_createClass(Path, [{
		key: '_makeChild',
		value: function _makeChild(path) {
			return new this.constructor(path);
		}

		// converts something like [{a:1},{a:2}] to [1,2]
		// when given [].a

	}, {
		key: 'flatten',
		value: function flatten(obj) {
			var target = [obj],
			    chunks = this.tokenizer.getAccessors();

			while (chunks.length) {
				var chunk = chunks.shift(),
				    getter = makeGetter(chunk);

				target = target.map(getter).reduce(function (rtn, arr) {
					return rtn.concat(arr);
				}, []);
			}

			return target;
		}

		// call this method against 

	}, {
		key: 'exec',
		value: function exec(obj, fn) {
			this.flatten(obj).forEach(fn);
		}
	}, {
		key: 'root',
		value: function root(accessors) {
			return this.tokenizer.root(accessors);
		}
	}, {
		key: 'remainder',
		value: function remainder() {
			return this._makeChild(this.tokenizer.remainder());
		}
	}]);

	return Path;
}();

module.exports = {
	default: Path
};

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

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
		var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Feed);

		var _this = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this));

		_this.settings = settings;

		// need to define next here because _track can call it
		_this.next = bmoor.flow.window(function () {
			_this.trigger('next', _this);
		}, settings.windowMin || 0, settings.windowMax || 30);

		if (src) {
			src.push = src.unshift = _this.add.bind(_this);

			src.forEach(function (datum) {
				_this._track(datum);
			});
		} else {
			src = [];
		}

		setUid(_this);

		_this.data = src;
		_this.cold = !src.length;
		return _this;
	}

	_createClass(Feed, [{
		key: '_track',
		value: function _track() /*datum*/{
			// just a stub for now
		}
	}, {
		key: '_add',
		value: function _add(datum) {
			oldPush.call(this.data, datum);

			this._track(datum);

			return datum;
		}
	}, {
		key: 'add',
		value: function add(datum) {
			if (this.cold) {
				this.cold = false;
			}

			var added = this._add(datum);

			this.next();

			return added;
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			if (this.cold) {
				this.cold = false;
			}

			for (var i = 0, c = arr.length; i < c; i++) {
				this._add(arr[i]);
			}

			this.next();
		}
	}, {
		key: 'empty',
		value: function empty() {
			this.data.length = 0;

			this.next();
		}
	}, {
		key: 'go',
		value: function go(parent) {
			this.empty();

			this.consume(parent.data);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.cold = true;
			this.data = null;
			this.disconnect();

			this.trigger('complete');
		}
	}, {
		key: 'subscribe',
		value: function subscribe(onNext, onError, onComplete) {
			var config = null;

			if (bmoor.isFunction(onNext)) {
				config = {
					next: onNext,
					error: onError || function () {
						// anything for default?
					},
					complete: onComplete || function () {
						// anything for default?
					}
				};
			} else {
				config = onNext;
			}

			if (!this.cold && config.next) {
				// make it act like a hot observable
				config.next(this);
			}

			return _get(Feed.prototype.__proto__ || Object.getPrototypeOf(Feed.prototype), 'subscribe', this).call(this, config);
		}

		// return back a promise that is active on the 'next'

	}, {
		key: 'promise',
		value: function promise() {
			var _this2 = this;

			if (this.next.active() || this.cold) {
				if (this._promise) {
					return this._promise;
				} else {
					this._promise = new Promise(function (resolve, reject) {
						var next = null;
						var error = null;

						next = _this2.once('next', function (collection) {
							_this2._promise = null;

							error();
							resolve(collection);
						});
						error = _this2.once('error', function (ex) {
							_this2._promise = null;

							next();
							reject(ex);
						});
					});
				}

				return this._promise;
			} else {
				return Promise.resolve(this);
			}
		}
	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this3 = this;

			var disconnect = parent.subscribe(Object.assign({
				next: function next(source) {
					_this3.go(source);
				},
				complete: function complete() {
					_this3.destroy();
				},
				error: function error() {
					// TODO : what to call?
				}
			}, settings));

			if (this.disconnect) {
				var old = this.disconnect;
				this.disconnect = function () {
					old();
					disconnect();
				};
			} else {
				this.disconnect = function () {
					disconnect();

					if (settings.disconnect) {
						settings.disconnect();
					}
				};
			}
		}

		// I want to remove this

	}, {
		key: 'sort',
		value: function sort(fn) {
			console.warn('Feed::sort, will be removed soon');
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

var bmoor = __webpack_require__(0);

function nextToken(path) {
	var i = 0,
	    c = path.length,
	    char = path.charAt(0),
	    more = true;

	var access = null;

	if (path.charAt(1) === ']') {
		// don't do anything
	} else if (char === '[') {
		var count = 0;

		do {
			if (char === '[') {
				count++;
			} else if (char === ']') {
				count--;
			}

			i++;
			char = path.charAt(i);
		} while (count && i < c);

		access = path.substring(2, i - 2);
	} else {
		do {
			if (char === '.' || char === '[') {
				more = false;
			} else {
				i++;
				char = path.charAt(i);
			}
		} while (more && i < c);

		access = path.substring(0, i);
	}

	var token = path.substring(0, i),
	    isArray = false;

	if (char === '[' && path.charAt(i + 1) === ']') {
		token += '[]';
		i += 2;

		isArray = true;
	}

	if (path.charAt(i) === '.') {
		i++;
	}

	var next = path.substring(i);

	return {
		value: token,
		next: next,
		done: false,
		isArray: isArray,
		accessor: access
	};
}

var Tokenizer = function () {
	function Tokenizer(path) {
		_classCallCheck(this, Tokenizer);

		var tokens;

		this.begin();

		if (bmoor.isString(path)) {
			tokens = [];

			while (path) {
				var cur = nextToken(path);
				tokens.push(cur);
				path = cur.next;
			}
		} else {
			tokens = path;
		}

		this.tokens = tokens;
	}

	_createClass(Tokenizer, [{
		key: '_makeChild',
		value: function _makeChild(arr) {
			return new this.constructor(arr);
		}
	}, {
		key: 'begin',
		value: function begin() {
			this.pos = 0;
		}
	}, {
		key: 'hasNext',
		value: function hasNext() {
			return this.tokens.length > this.pos + 1;
		}
	}, {
		key: 'next',
		value: function next() {
			var token = this.tokens[this.pos];

			if (token) {
				this.pos++;

				return token;
			} else {
				return {
					done: true
				};
			}
		}
	}, {
		key: 'getAccessors',
		value: function getAccessors() {
			var rtn = this.accessors;

			if (rtn === undefined) {
				var cur = null;

				rtn = [];

				for (var i = 0, c = this.tokens.length; i < c; i++) {
					var token = this.tokens[i];

					if (cur) {
						cur.push(token.accessor);
					} else if (token.accessor) {
						cur = [token.accessor];
					} else {
						cur = [];
					}

					if (token.isArray) {
						rtn.push(cur);
						cur = null;
					}
				}

				if (cur) {
					rtn.push(cur);
				}

				this.accessors = rtn;
			}

			return rtn.slice(0);
		}
	}, {
		key: 'chunk',
		value: function chunk() {
			var rtn = this.chunks;

			if (rtn === undefined) {
				var cur = null;

				rtn = [];

				for (var i = 0, c = this.tokens.length; i < c; i++) {
					var token = this.tokens[i];

					if (cur) {
						if (token.value.charAt(0) === '[') {
							cur += token.value;
						} else {
							cur += '.' + token.value;
						}
					} else {
						cur = token.value;
					}

					if (token.isArray) {
						rtn.push(cur);
						cur = null;
					}
				}

				if (cur) {
					rtn.push(cur);
				}

				this.chunks = rtn;
			}

			return rtn;
		}
	}, {
		key: 'findArray',
		value: function findArray() {
			if (this.arrayPos === undefined) {
				var found = -1,
				    tokens = this.tokens;

				for (var i = 0, c = tokens.length; i < c; i++) {
					if (tokens[i].isArray) {
						found = i;
						i = c;
					}
				}

				this.arrayPos = found;
			}

			return this.arrayPos;
		}
	}, {
		key: 'root',
		value: function root(accessors) {
			return (accessors ? this.getAccessors() : this.chunk())[0];
		}
	}, {
		key: 'remainder',
		value: function remainder() {
			var found = this.findArray();

			found++; // -1 goes to 0

			if (found && found < this.tokens.length) {
				return this._makeChild(this.tokens.slice(found));
			} else {
				return null;
			}
		}
	}]);

	return Tokenizer;
}();

module.exports = {
	default: Tokenizer
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Feed = __webpack_require__(5),
    Hash = __webpack_require__(8),
    Test = __webpack_require__(9),
    _route = __webpack_require__(26).fn,
    _index = __webpack_require__(27).fn,
    filter = __webpack_require__(28).fn,
    _sorted = __webpack_require__(29).fn,
    mapped = __webpack_require__(30).fn,
    testStack = __webpack_require__(31).test,
    memorized = __webpack_require__(32).memorized;

var Collection = function (_Feed) {
	_inherits(Collection, _Feed);

	function Collection() {
		_classCallCheck(this, Collection);

		return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
	}

	_createClass(Collection, [{
		key: 'indexOf',


		//--- array methods
		value: function indexOf(obj, start) {
			return this.data.indexOf(obj, start);
		}

		//--- collection methods

	}, {
		key: '_track',
		value: function _track(datum) {
			if (datum.on) {
				datum.on[this.$$bmoorUid] = datum.on('update', this.next);
			}
		}
	}, {
		key: '_remove',
		value: function _remove(datum) {
			var dex = this.indexOf(datum);

			if (dex !== -1) {
				var rtn = this.data[dex];

				if (dex === 0) {
					this.data.shift();
				} else {
					this.data.splice(dex, 1);
				}

				if (datum.on) {
					var fn = datum.on[this.$$bmoorUid];

					if (fn) {
						fn();
						datum.on[this.$$bmoorUid] = null;
					}
				}

				return rtn;
			}
		}
	}, {
		key: 'remove',
		value: function remove(datum) {
			var rtn = this._remove(datum);

			if (rtn) {
				this.next();

				return rtn;
			}
		}
	}, {
		key: 'empty',
		value: function empty() {
			var arr = this.data;

			while (arr.length) {
				this._remove(arr[0]);
			}

			this.next();
		}
	}, {
		key: 'makeChild',
		value: function makeChild(settings, goFn) {
			var ChildClass = (settings ? settings.childClass : null) || this.constructor;
			var child = new ChildClass(null, settings);

			child.parent = this;

			if (goFn) {
				child.go = goFn;
			}

			child.follow(this, settings);

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
			return this.index(search, settings).get(search);
		}

		//--- child generators

	}, {
		key: 'route',
		value: function route(search, settings) {
			return memorized(this, 'routes', search instanceof Hash ? search : new Hash(search, settings), _route, settings);
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
		key: '_filter',
		value: function _filter(search, settings) {
			return memorized(this, 'filters', search instanceof Test ? search : new Test(search, settings), filter, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			return this._filter(search, settings);
		}

		// TODO::migration search -> select

	}, {
		key: 'search',
		value: function search(settings) {
			console.warn('Collection::search, will be removed soon');
			return this.select(settings);
		}
	}, {
		key: 'select',
		value: function select(settings) {
			var ctx, test;

			for (var i = settings.tests.length - 1; i !== -1; i--) {
				test = testStack(test, settings.tests[i]);
			}

			var hash = settings.hash || 'search:' + Date.now();

			return this._filter(function (datum) {
				if (!datum.$normalized) {
					datum.$normalized = {};
				}

				var cache = datum.$normalized[hash];
				if (!cache) {
					cache = settings.normalizeDatum(datum);
					datum.$normalized[hash] = cache;
				}

				return test(cache, ctx);
			}, Object.assign(settings, {
				before: function before() {
					ctx = settings.normalizeContext();
				},
				hash: hash
			}));
		}

		// settings { size }

	}, {
		key: 'paginate',
		value: function paginate(settings) {
			var child = null;

			var parent = this;
			var origSize = settings.size;

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

			child = this.makeChild(settings, function () {
				var span = settings.size,
				    length = parent.data.length,
				    steps = Math.ceil(length / span);

				nav.span = span;
				nav.steps = steps;
				nav.count = length;

				var start = nav.pos * span;
				var stop = start + span;

				nav.start = start;
				if (stop > length) {
					stop = length;
				}
				nav.stop = stop;

				this.empty();

				for (var i = start; i < stop; i++) {
					this.add(this.parent.data[i]);
				}

				this.next();
			});

			child.nav = nav;

			return child;
		}
	}]);

	return Collection;
}(Feed);

module.exports = Collection;

/***/ }),
/* 8 */
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
	var _this = this;

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
	this.fn = fn;
	this.parse = function (search) {
		if (bmoor.isObject(search)) {
			return _this.fn(search);
		} else {
			return search;
		}
	};
	this.go = function (search) {
		if (settings.massage && bmoor.isObject(search)) {
			search = settings.massage(search);
		}

		return _this.parse(search);
	};
};

module.exports = Hash;

/***/ }),
/* 9 */
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
	var _this = this;

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
	this.parse = fn;
	this.go = function (search) {
		if (settings.massage) {
			search = settings.massage(search);
		}

		return _this.parse(search);
	};
};

module.exports = Test;

/***/ }),
/* 10 */
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
	var mask = bmoor.isArray(target) ? target.slice(0) : bmoor.object.mask(target);

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

			if (!(bothObj && k in mask) && o !== m) {
				mask[k] = o;
			}
		});
	}

	return mask;
}

function _isDirty(obj, cmp) {
	if (!obj) {
		return false;
	}

	var keys = Object.keys(obj);

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	}

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i];

		if (k.charAt(0) !== '$') {
			var t = obj[k];

			if (t === cmp[k]) {
				continue;
			} else if (!bmoor.isObject(t) || _isDirty(t, cmp[k])) {
				return true;
			}
		}
	}

	return false;
}

function _getChanges(obj, cmp) {
	if (!obj) {
		return;
	}

	var rtn = {},
	    valid = false,
	    keys = Object.keys(obj);

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	} else if (!bmoor.isObject(cmp)) {
		return bmoor.object.merge(rtn, obj);
	}

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i];

		if (k.charAt(0) !== '$') {
			var datum = obj[k];

			if (bmoor.isObject(datum)) {
				var res = _getChanges(datum, cmp ? cmp[k] : null);

				if (res) {
					valid = true;
					rtn[k] = res;
				}
			} else if (!(k in cmp) || cmp[k] !== datum) {
				valid = true;
				rtn[k] = datum;
			}
		}
	}

	if (valid) {
		return rtn;
	}
}

function _map(obj, delta) {
	var keys = Object.keys(delta);

	for (var i = 0, c = keys.length; i < c; i++) {
		var k = keys[i],
		    d = delta[k],
		    o = obj[k];

		if (k.charAt(0) !== '$') {
			if (d !== o) {
				if (bmoor.isObject(d) && bmoor.isObject(o)) {
					_map(o, d);
				} else {
					obj[k] = d;
				}
			}
		}
	}
}

function _flatten(obj, cmp) {
	var rtn = {};

	if (!cmp) {
		cmp = Object.getPrototypeOf(obj);
	}

	Object.keys(cmp).forEach(function (key) {
		if (key.charAt(0) !== '$') {
			var v = cmp[key];

			if (bmoor.isObject(v) && !obj.hasOwnProperty(key)) {
				rtn[key] = bmoor.object.copy({}, v);
			} else {
				rtn[key] = v;
			}
		}
	});

	Object.keys(obj).forEach(function (key) {
		if (key.charAt(0) !== '$') {
			var v = obj[key];

			if (bmoor.isObject(v)) {
				rtn[key] = _flatten(v, cmp[key]);
			} else {
				rtn[key] = v;
			}
		}
	});

	return rtn;
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

	// a 'deep copy' of the datum, but using mask() to have the original
	// as the object's prototype.


	_createClass(Proxy, [{
		key: 'getMask',
		value: function getMask(override) {
			if (!this.mask || override) {
				this.mask = makeMask(this.getDatum(), override);
			}

			return this.mask;
		}

		// create a true deep copy of the datum.  if applyMask == true, 
		// we copy the mask on top as well.  Can be used for stringify then

	}, {
		key: 'copy',
		value: function copy(applyMask) {
			var rtn = {};

			bmoor.object.merge(rtn, this.getDatum());
			if (applyMask) {
				bmoor.object.merge(rtn, bmoor.isObject(applyMask) ? applyMask : this.getMask());
			}

			return rtn;
		}

		// create a shallow copy of the datum.  if applyMask == true, 
		// we copy the mask on top as well.  Can be used for stringify then

	}, {
		key: 'extend',
		value: function extend(applyMask) {
			var rtn = {};

			bmoor.object.extend(rtn, this.getDatum());
			if (applyMask) {
				bmoor.object.extend(rtn, bmoor.isObject(applyMask) ? applyMask : this.getMask());
			}

			return rtn;
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

			_map(mask, delta);

			return mask;
		}
	}, {
		key: 'merge',
		value: function merge(delta) {
			if (!delta) {
				delta = this.getChanges();
			} else {
				delta = _getChanges(delta, this.getDatum());
			}

			if (delta) {
				bmoor.object.merge(this.getDatum(), delta);

				this.mask = null;
				this.trigger('update', delta);
			}
		}
	}, {
		key: 'flatten',
		value: function flatten(delta) {
			if (delta) {
				return _flatten(delta, this.getDatum());
			} else {
				return _flatten(this.getMask());
			}
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

Proxy.map = _map;
Proxy.isDirty = _isDirty;
Proxy.flatten = _flatten;
Proxy.getChanges = _getChanges;

module.exports = Proxy;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Memory = __webpack_require__(0).Memory,
    schemas = {
	default: Memory.use('data-structure-schema')
};

module.exports = {
	default: schemas.default,
	get: function get(name) {
		var schema;

		if (name !== 'default') {
			name = 'data-structure-schema-' + name;
		}

		schema = schemas[name];
		if (!schema) {
			schema = schemas[name] = Memory.use(name);
		}

		return schema;
	}
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);
var DataProxy = __webpack_require__(1).object.Proxy;
var Schema = __webpack_require__(2).default;

// NOTE: borrowed from bmoor.array.watch, replace when version ready
function watch(arr, insert, remove, preload) {
	if (insert) {
		var oldPush = arr.push.bind(arr);
		var oldUnshift = arr.unshift.bind(arr);

		arr.push = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			args.forEach(insert);

			oldPush.apply(undefined, args);
		};

		arr.unshift = function () {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			args.forEach(insert);

			oldUnshift.apply(undefined, args);
		};

		if (preload) {
			arr.forEach(insert);
		}
	}

	if (remove) {
		var oldShift = arr.shift.bind(arr);
		var oldPop = arr.pop.bind(arr);
		var oldSplice = arr.splice.bind(arr);

		arr.shift = function () {
			remove(oldShift.apply(undefined, arguments));
		};

		arr.pop = function () {
			remove(oldPop.apply(undefined, arguments));
		};

		arr.splice = function () {
			var res = oldSplice.apply(undefined, arguments);

			res.forEach(remove);

			return res;
		};
	}
}

/*
Object.keys(joins).forEach( tableName => {
	var join = joins[tableName],
		foreignTable = schema.get( tableName );

	if ( join.type === 'child' ){
		let root = proxy.$(join.path);

		proxy.connectors[tableName] = {
			insert: function( datum ){
				if ( root.indexOf(datum) === -1 ){
					root.push(datum);
				}

				if ( join.massage ){
					join.massage(datum, helperMethods);
				}

				datum.$parentId = uid;

				foreignTable.set( datum );
			},
			delete: function( datum ){
				if ( datum instanceof DataProxy ){
					root.splice( root.indexOf(datum.getDatum()), 1 );
				}else{
					root.splice( root.indexOf(datum), 1 );
				}

				foreignTable.del( datum );
			},
			get: function(){
				return foreignTable.collection.filter(
					{ '$parentId': uid },
					{
						hash:'child-'+uid
					}
				);
			}
		};
	}

	if ( join && join.auto ){
		proxy.join(tableName);
	}
});
*/
function stack(old, fn) {
	if (!old) {
		return function stackFirst(datum, onload, name) {
			return [fn(datum, onload, name)];
		};
	} else {
		return function stackNext(datum, onload, name) {
			var rtn = old(datum, onload, name);

			rtn.push(fn(datum, onload, name));

			return rtn;
		};
	}
}

/**
	key: path on the local datum whose value should be used
	sibling: foreign reference table
	target: mount position of the collection on local datum
	type: relationship type [one,many]
	link: link object for more info
**/
function linkFn(key, sibling, target, type, link) {
	return {
		add: function linkAdd(datum, onload, name) {
			var ctrl = datum;

			if (name && sibling.name !== name) {
				return;
			}

			if (onload && !link.auto) {
				return;
			}

			if (datum instanceof DataProxy) {
				datum = datum.getDatum();
			}

			// no need to load this if it's already been called
			if (!bmoor.get(ctrl, '$links.' + target)) {
				var src = bmoor.get(datum, key),
				    rtn = sibling[type === 'many' ? 'getMany' : 'get'](src);

				rtn.then(function (res) {
					bmoor.set(ctrl, '$links.' + target, res);

					return res;
				});

				return rtn;
			}
		}
	};
}

/**
	key: path on the local datum whose value should be used
	child: foreign reference table
	target: mount position on foreign datum to put back reference
	type: relationship type [one,many]
	link: link object for more info
**/
function childFn(key, child, target, type, link) {
	return {
		add: function childAdd(datum, onload, name) {
			var ctrl = datum;

			if (name && child.name !== name) {
				return;
			}

			// prevents 
			if (onload && !link.auto) {
				return;
			}

			if (datum instanceof DataProxy) {
				datum = datum.getDatum();
			}

			// link back to the original datum
			var values = bmoor.get(datum, key);

			// push data to child, and link back to origin
			var set = function set(value) {
				if (link.massage) {
					value = link.massage(value);
				}

				if (link.filter && !link.filter(value)) {
					return;
				}

				if (value === undefined) {
					return Promise.resolve(null);
				} else {
					return child.set(value).then(function (res) {
						// back reference
						bmoor.set(res, '$links.' + target, // mount on $links property
						ctrl);

						return res;
					});
				}
			};

			var remove = function remove(value) {
				if (link.massage) {
					value = link.massage(value);
				}

				if (link.filter && !link.filter(value)) {
					return;
				}

				// TODO : make this delete?
				return child.del(value);
			};
			/*
   	I'm pushing to the table's name, shouldn't conflict
   	because you can only have one child with the same name
   	I'm sure someone will find a way to prove me wrong
   
   	QUESTION : Do I really need this?  I might remove later
   */
			if (type === 'one') {
				return set(values).then(function (res) {
					bmoor.set(ctrl, '$links.' + child.name, res);

					return res;
				});
			} else {
				var collection = child.collectionFactory();

				watch(values, function (datum) {
					set(datum).then(function (res) {
						if (res) {
							collection.add(res);
						}
					});
				}, function (datum) {
					var res = remove(datum);

					if (res) {
						// TODO : bug in lower code
						if (collection.data) {
							collection.remove(res);
						}
					}
				}, false);

				return Promise.all(values.map(set)).then(function (res) {
					// prune undefined
					collection.consume(res.filter(function (d) {
						return d;
					}));

					bmoor.set(ctrl, '$links.' + child.name, collection);

					return res;
				});
			}
		}
	};
}

/*
links: [{
	type: [child,link] - [one,many]
	table:  // where connecting to
	key: 
	target: //
	massage:
	filter:
	auto:
}]
*/

var Linker = function () {
	function Linker(table, links) {
		var _this = this;

		_classCallCheck(this, Linker);

		this.table = table;

		if (links) {
			links.forEach(function (link) {
				var _link$type$split = link.type.split('-'),
				    _link$type$split2 = _slicedToArray(_link$type$split, 2),
				    relationship = _link$type$split2[0],
				    type = _link$type$split2[1];

				if (relationship === 'child') {
					var parent = Schema.get(link.table);

					if (!parent.linker) {
						parent.linker = new Linker(link.table, []);
					}

					parent.linker.setChild(link.key, _this.table, link.target, type, link);
				} else {
					_this.setLink(link.key, Schema.get(link.table), link.target, type, link);
				}
			});
		}
	}

	_createClass(Linker, [{
		key: 'setChild',
		value: function setChild(key, child, target, type, link) {
			var methods = childFn(key, child, target, type, link);

			this.onAdd = stack(this.onAdd, methods.add);
		}
	}, {
		key: 'setLink',
		value: function setLink(key, sibling, target, type, link) {
			var methods = linkFn(key, sibling, target, type, link);

			this.onAdd = stack(this.onAdd, methods.add);
		}

		/**
  * If the object has a setLinker, allow delay.  Otherwise add links
  */

	}, {
		key: 'add',
		value: function add(obj) {
			if (obj.setLinker) {
				obj.setLinker(this);
			}

			if (this.onAdd) {
				return Promise.all(this.onAdd(obj, true)).then(function () {
					return obj;
				});
			} else {
				return Promise.resolve(obj);
			}
		}
	}, {
		key: 'link',
		value: function link(obj, name) {
			if (this.onAdd) {
				return Promise.all(this.onAdd(obj, false, name)).then(function () {
					return obj.$links;
				});
			} else {
				return Promise.resolve(null);
			}
		}
	}]);

	return Linker;
}();

module.exports = {
	default: Linker
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataProxy = __webpack_require__(1).object.Proxy;

// { join: {table:'', field} }

var JoinableProxy = function (_DataProxy) {
	_inherits(JoinableProxy, _DataProxy);

	function JoinableProxy(obj) {
		_classCallCheck(this, JoinableProxy);

		var _this = _possibleConstructorReturn(this, (JoinableProxy.__proto__ || Object.getPrototypeOf(JoinableProxy)).call(this, obj));

		if (_this.inflate) {
			_this.inflate();
		}
		return _this;
	}

	_createClass(JoinableProxy, [{
		key: 'merge',
		value: function merge(delta) {
			_get(JoinableProxy.prototype.__proto__ || Object.getPrototypeOf(JoinableProxy.prototype), 'merge', this).call(this, delta);

			if (this.inflate) {
				this.inflate();
			}
		}
	}, {
		key: 'setLinker',
		value: function setLinker(linker) {
			this.linker = linker;
		}
	}, {
		key: 'link',
		value: function link(tableName) {
			return this.linker.link(this, tableName);
		}
	}]);

	return JoinableProxy;
}(DataProxy);

module.exports = {
	default: JoinableProxy
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(15);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	mockery: {
		Wrapper: __webpack_require__(16),
		Schema: __webpack_require__(4)
	},
	Table: __webpack_require__(17),
	table: __webpack_require__(37),
	object: __webpack_require__(38),
	Collection: __webpack_require__(39)
};

/***/ }),
/* 16 */
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
				table.collection.next.flush();
				return old.call(table, method);
			});
		}
	};
}

function makeMock(mock, method) {
	return function (datum, ctx) {
		return mock[method](datum, ctx.args, ctx.payload);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    schema = __webpack_require__(2).default,
    Test = __webpack_require__(1).object.Test,
    Linker = __webpack_require__(12).default,
    DataProxy = __webpack_require__(1).object.Proxy,
    CacheProxy = __webpack_require__(13).default,
    ProxiedCollection = __webpack_require__(1).collection.Proxied;

var defaultSettings = {
	proxyFactory: function proxyFactory(datum) {
		return new CacheProxy(datum);
	},
	collectionFactory: function collectionFactory(src) {
		return new ProxiedCollection(src);
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

		this.synthetic = ops.synthetic;
		this.connector = ops.connector;

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

		if (ops.links) {
			this.linker = new Linker(this, ops.links);
		}

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
				} else if (bmoor.isObject(qry) && !bmoor.isArray(qry)) {
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

		this._getting = {};

		this.reset();
	}

	_createClass(Table, [{
		key: 'reset',
		value: function reset() {
			this.collection = this.collectionFactory([]);
			this.index = this.collection.index(this.$id);
			this._selections = {};
			this._getting = {};
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
			var _this2 = this;

			var id = this.$id(obj),
			    t = this.index.get(id);

			if (id) {
				if (t) {
					obj = delta || obj;
					this.normalize(obj);

					t.merge(delta || obj);
				} else {
					this.normalize(obj);
					t = this.proxyFactory(obj);

					this.collection.add(t);
				}

				this._getting[id] = null;

				return this.collection.promise().then(function () {
					if (_this2.linker) {
						return _this2.linker.add(t);
					} else {
						return t;
					}
				});
			} else {
				throw new Error('missing id for object: ' + JSON.stringify(obj));
			}
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var _this3 = this;

			return Promise.all(arr.map(function (d) {
				return _this3.set(d);
			}));
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
			var _this4 = this;

			var id = this.$id(obj);

			var fetch = null;

			if (!options) {
				options = {};
			}

			// batch in the number of seconds you wait for another call
			// allow for the default to be batching
			var batch = 'batch' in options ? options.batch : 'batch' in defaultSettings ? defaultSettings.batch : null;

			if (this.synthetic && this.synthetic.get) {
				fetch = function fetch(datum) {
					return _this4.synthetic.get(datum).then(function () {
						return _this4.collection.promise();
					}).then(function () {
						return _this4.find(obj);
					});
				};
			} else if ((batch || batch === 0) && this.connector.readMany) {
				fetch = function fetch(datum) {
					return _this4.getMany([datum]).then(function () {
						return _this4.find(datum);
					});
				};
			} else {
				fetch = function fetch(datum) {
					var rtn = _this4.connector.read(_this4.$encode(datum), null, options).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						return _this4.set(res);
					});

					_this4._getting[id] = rtn;

					return rtn;
				};
			}

			return this.before('get').then(function () {
				var t = _this4.find(id);

				if (!t || options && options.cached === false) {
					// this needs to be an active promise
					if (_this4._getting[id]) {
						return _this4._getting[id].then(function () {
							return _this4.find(id);
						});
					} else {
						return fetch(obj);
					}
				} else {
					return t;
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
	}, {
		key: 'setMany',
		value: function setMany(prom, hook) {
			var _this5 = this;

			if (!prom.then) {
				prom = Promise.resolve(prom);
			}

			return prom.then(function (res) {
				if (hook) {
					hook(res);
				}

				return Promise.all(res.map(function (r) {
					return _this5.set(r);
				}));
			});
		}

		/**
  * No cacheing here because I can't programatically figure out what ids are being requested
  **/

	}, {
		key: 'fetch',
		value: function fetch(qry, options) {
			var _this6 = this;

			if (!options) {
				options = {};
			}

			return this.before('fetch', qry).then(function () {
				var rtn;

				if (_this6.synthetic && _this6.synthetic.fetch) {
					// NOTE : I don't love this...
					rtn = _this6.synthetic.fetch(qry, options).then(function (res) {
						return _this6.collection.promise().then(function () {
							return res;
						});
					});
				} else {
					rtn = _this6.connector.query(qry, null, options);
				}

				return _this6.setMany(rtn, options.hook).then(function (res) {
					var collection = _this6.collectionFactory([]);

					res.forEach(function (p, i) {
						collection.data[i] = p;
					});

					return collection;
				});
			});
		}

		// -- getMany

	}, {
		key: 'getMany',
		value: function getMany(arr, options) {
			var _this7 = this;

			if (!options) {
				options = {};
			}

			return this.before('get-many', arr).then(function () {
				var all = [];
				var req = [];

				// reduce the list using gotten
				arr.forEach(function (r) {
					var t = _this7.$id(r);

					all.push(t);

					if (!_this7.index.get(t)) {
						req.push(t);
					}
				});

				return _this7._getMany(req, options).then(function () {
					return _this7.collection.promise();
				}).then(function () {
					var collection = _this7.collectionFactory([]);

					all.forEach(function (id, i) {
						collection.data[i] = _this7.index.get(id);
					});

					return collection;
				});
			});
		}

		/**
  * arr => array of ids
  **/

	}, {
		key: '_getMany',
		value: function _getMany(arr, options) {
			var _this8 = this;

			var loading = [];

			var rtn = null;

			if (arr.length && !this.$getMany) {
				var batch = 'batch' in options ? options.batch : 'batch' in defaultSettings ? defaultSettings.batch : 0;

				this.$getMany = this.setMany(new Promise(function (resolve, reject) {
					setTimeout(function () {
						var thread = _this8.$getMany;

						_this8.$getMany = null;

						var prom = null;
						var req = [];

						for (var id in _this8._getting) {
							if (_this8._getting[id] === thread) {
								req.push(id);
							}
						}

						if (req.length) {
							// this works because I can assume id was defined for 
							// the feed
							if (_this8.synthetic && _this8.synthetic.getMany) {
								var query = _this8.$encode(req);

								prom = _this8.synthetic.getMany(query, options);
							} else if (_this8.connector.readMany) {
								var _query = _this8.$encode(req);

								prom = _this8.connector.readMany(_query, null, options);
							} else {
								// The feed doesn't have readMany, so many reads will work
								prom = Promise.all(req.map(function (id) {
									return _this8.connector.read(_this8.$encode(id), null, options);
								}));
							}
						} else {
							prom = Promise.resolve([]); // nothing to do
						}

						prom.then(resolve, reject);
					}, batch);
				}), options.hook);
			}

			rtn = this.$getMany;

			loading.push(rtn);

			arr.forEach(function (id) {
				if (id in _this8._getting) {
					// assumed to be either null or a promise
					loading.push(_this8._getting[id]);
				} else {
					_this8._getting[id] = rtn;
				}
			});

			return Promise.all(loading);
		}

		// -- all
		// all returns back the whole collection.  Allowing obj for dynamic
		// urls

	}, {
		key: 'all',
		value: function all(obj, options) {
			var _this9 = this;

			if (!options) {
				options = {};
			}

			return this.before('all').then(function () {
				if (!_this9.$all || options.cached === false) {
					var res = void 0;

					if (_this9.synthetic) {
						if (_this9.synthetic.all) {
							res = _this9.synthetic.all(obj, options);
						} else {
							res = Promise.resolve([]);
						}
					} else {
						res = _this9.connector.all(obj, null, options);
					}

					res.catch(function () {
						_this9.$all = null;
					});

					_this9.$all = res.then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						_this9.consume(res);

						return _this9.collection.promise();
					});
				}

				return _this9.$all;
			});
		}

		// -- insert

	}, {
		key: 'insert',
		value: function insert(obj, options) {
			var _this10 = this;

			if (!options) {
				options = {};
			}

			return this.before('insert', obj).then(function () {
				var t = _this10.find(obj);

				if (_this10.synthetic && _this10.synthetic.insert) {
					// if it exists, don't do anything
					if (t) {
						return Promise.resolve(t);
					} else {
						return _this10.synthetic.insert(obj, options).then(function () {
							return _this10.collection.promise();
						}).then(function () {
							return _this10.find(obj);
						});
					}
				} else {
					if (t) {
						throw new Error('This already exists ' + JSON.stringify(obj));
					} else {
						return _this10.connector.create(obj, obj, options).then(function (res) {
							if (options.hook) {
								options.hook(res);
							}

							var datum = void 0;

							if (!options.ignoreResponse && bmoor.isObject(res)) {
								datum = res;
							} else {
								datum = obj;

								if (options.makeId) {
									options.makeId(obj, res);
								}
							}

							return datum;
						}).then(function (datum) {
							return _this10.set(datum).then(function (proxy) {
								return _this10.collection.promise().then(function () {
									if (options.useProto) {
										proxy.merge(obj);
									}

									return proxy;
								});
							});
						});
					}
				}
			});
		}

		// -- update
		// delta is optional

	}, {
		key: 'update',
		value: function update(from, delta, options) {
			var _this11 = this;

			if (!options) {
				options = {};
			}

			return this.before('update', from, delta).then(function () {
				var proxy;

				if (from instanceof DataProxy) {
					proxy = from;
					from = from.getDatum();
				} else {
					from = _this11.$encode(from);
					proxy = _this11.find(from);
				}

				if (delta === true) {
					delta = proxy.getDatum();
				} else if (!delta) {
					delta = proxy.getChanges();
				}

				if (_this11.synthetic && _this11.synthetic.update) {
					return _this11.synthetic.update(from, delta, options, proxy).then(function () {
						return _this11.collection.promise();
					}).then(function () {
						return proxy;
					});
				} else {
					if (proxy && delta) {
						return _this11.connector.update(from, delta, options).then(function (res) {
							return _this11.collection.promise().then(function () {
								if (options.hook) {
									options.hook(res, from, delta);
								}

								if (!options.ignoreResponse && bmoor.isObject(res)) {
									proxy.merge(res);
								} else if (!options.ignoreDelta) {
									proxy.merge(delta);
								}

								return proxy;
							});
						});
					} else if (proxy) {
						return Promise.resolve(proxy);
					} else {
						throw new Error('Can not update that which does not exist' + JSON.stringify(from));
					}
				}
			});
		}

		// -- delete

	}, {
		key: 'delete',
		value: function _delete(obj, options) {
			var _this12 = this;

			if (!options) {
				options = {};
			}

			return this.before('delete', obj).then(function () {
				var proxy = _this12.find(obj);

				if (proxy) {
					var datum = proxy.getDatum();

					if (_this12.synthetic) {
						_this12.synthetic.delete(obj, datum, options, proxy).then(function () {
							return _this12.collection.promise();
						}).then(function () {
							return proxy;
						});
					} else {
						return _this12.connector.delete(datum, datum, options).then(function (res) {
							return _this12.collection.promise().then(function () {
								if (options.hook) {
									options.hook(res);
								}

								_this12.del(obj);

								return proxy;
							});
						});
					}
				} else {
					throw new Error('Can not delete that which does not exist' + JSON.stringify(obj));
				}
			});
		}

		// -- select

	}, {
		key: 'select',
		value: function select(qry, options) {
			var _this13 = this;

			return this.before('select', qry).then(function () {
				var op,
				    rtn,
				    test,
				    selection,
				    selections = _this13._selections;

				if (!options) {
					options = {};
				}

				_this13.normalize(qry);

				test = options instanceof Test ? options : options.test || new Test(options.fn || qry, {
					hash: options.hash,
					massage: options.massage || _this13.$datum
				});
				selection = selections[test.hash];

				if (selection && options.cached !== false) {
					selection.count++;

					return selection.filter;
				}

				if (_this13.connector.search) {
					rtn = _this13.connector.search(qry, // variables
					null, // no datum to send
					options // allow more fine tuned management
					).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						_this13.consume(res);
					});
				} else {
					rtn = _this13.all(qry, options);
				}

				if (selection) {
					selection.count++;

					return rtn.then(function () {
						return _this13.collection.promise();
					}).then(function () {
						return selection.filter;
					});
				} else {
					selections[test.hash] = op = {
						filter: rtn.then(function () {
							return _this13.collection.promise();
						}).then(function () {
							var res = _this13.collection.filter(test),
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
/* 18 */
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
    Mapper = __webpack_require__(19).Mapper;

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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(20),
	Generator: __webpack_require__(23),
	Path: __webpack_require__(3),
	validate: __webpack_require__(25)
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    bmoorSchema: __webpack_require__(21).default,
    jsonSchema: __webpack_require__(22).default
};

/***/ }),
/* 21 */
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

	ops[method](def, path.slice(0), val);
}

function formatProperty(prop, escaped) {
	if (prop.charAt(0) !== '[' && prop.search(escaped) !== -1) {
		prop = '["' + prop + '"]';
	}

	return prop;
}

function join(path, escaped) {
	var rtn = '';

	if (path && path.length) {
		rtn = formatProperty(path.shift(), escaped);

		while (path.length) {
			var prop = formatProperty(path.shift(), escaped),
			    nextChar = prop[0];

			if (nextChar !== '[') {
				rtn += '.';
			}

			rtn += prop;
		}
	}

	return rtn;
}

ops = {
	array: function array(def, path, val) {
		// always encode first value of array
		var next = val[0];

		path.push('[]');

		parse(def, path, next);
	},
	object: function object(def, path, val) {
		var pos = path.length;

		Object.keys(val).forEach(function (key) {
			path[pos] = key;

			parse(def, path, val[key]);
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

function encode(json, escaped) {
	var t = [];

	if (!escaped) {
		escaped = /[\W]/;
	}

	if (json) {
		parse(t, [], json);

		t.forEach(function (d) {
			return d.path = join(d.path, escaped);
		});

		return t;
	} else {
		return json;
	}
}

module.exports = {
	default: encode,
	types: ops
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Tokenizer = __webpack_require__(6).default;

var go;

function buildLeaf(info, token, prior) {
	var t = {},
	    types = [info.type];

	if (info.sensitivity && info.sensitivity === 'ignore') {
		t.ignore = true;
		types.push('null');
	} else if (info.sensitivity && info.sensitivity === 'required') {
		prior.push(token);
	} else {
		types.push('null');
	}

	t.type = types;

	if (info.encrypted) {
		t.encrypted = true;
	}

	return t;
}

function decorateObject(tokens, obj, info) {
	// could also be blank object coming from 
	if (!obj.type) {
		obj.type = ['object', 'null'];
	}

	if (!obj.required) {
		obj.required = [];
	}

	if (!obj.properties) {
		obj.properties = {};
	}

	go(tokens, obj.properties, info, obj.required);
}

function decorateArray(tokens, obj, token, info) {
	var path = token.value,
	    next = token.next;

	if (!obj.type) {
		obj.type = ['array', 'null'];
	}

	if (!obj.items) {
		obj.items = {};
	}

	if (info.sensitivity === 'required') {
		obj.minItems = 1;
	}

	if (next) {
		if (next.charAt(0) === '[') {
			decorateArray(tokens, obj.items, tokens.next(), info);
		} else {
			decorateObject(tokens, obj.items, info);
		}
	} else {
		obj.items = buildLeaf(info, path, []);
	}
}

go = function go(tokens, root, info, prior) {
	var token = tokens.next(),
	    path = token.value,
	    pos = path.indexOf('['),
	    next = token.next;

	if (pos !== -1 && path.charAt(pos + 1) === ']') {
		// this is an array
		var prop = path.substr(0, pos),
		    t = root[prop];

		if (!t) {
			t = root[prop] = {};
		}

		decorateArray(tokens, t, token, info);
	} else {
		if (pos === 0) {
			path = path.substring(2, path.length - 2);
		}

		if (next) {
			var _t = root[path];

			if (!_t) {
				_t = root[path] = {};
			}

			decorateObject(tokens, _t, info);
		} else {
			root[path] = buildLeaf(info, path, prior);
		}
	}
};

function encode(fields, shift, extra) {
	var root = {},
	    reqs = [];

	if (shift) {
		shift += '.';
	} else {
		shift = '';
	}

	fields.map(function (field) {
		var path = shift + field.path;

		try {
			var tokens = new Tokenizer(path);

			go(tokens, root, field, reqs);
		} catch (ex) {
			console.log('-------');
			console.log(path);
			console.log(ex.message);
			console.log(ex);
		}
	});

	return Object.assign({
		'$schema': 'http://json-schema.org/schema#',
		type: 'object',
		required: reqs,
		properties: root
	}, extra || {});
}

module.exports = {
	default: encode
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);
var Path = __webpack_require__(3).default;
var Writer = __webpack_require__(24).default;

var generators = {
	constant: function constant(cfg) {
		var value = cfg.value;
		return function () {
			return value;
		};
	},
	string: {
		random: function random() {
			return function () {
				return 'random string';
			};
		}
	},
	number: {
		index: function index() {
			var count = 1;
			return function () {
				return count++;
			};
		},
		random: function random(cfg) {
			if (!cfg) {
				cfg = {};
			}

			if (!cfg.min) {
				cfg.min = 1;
			}

			if (!cfg.max) {
				cfg.max = 100;
			}

			return function () {
				var val = Math.random() * (cfg.max - cfg.min);

				return val + cfg.min;
			};
		}
	},
	boolean: {
		random: function random() {
			return function () {
				return Math.random() * 10 % 2 === 0;
			};
		}
	},
	array: function array(cfg) {
		return function () {
			var count = cfg.length || 1;

			if (count < 1) {
				count = 1;
			}

			var rtn = [];

			while (count) {
				rtn.push({});
				count--;
			}

			return rtn;
		};
	}
};

var Generator = function () {
	function Generator(config) {
		var _this = this;

		_classCallCheck(this, Generator);

		this.fields = {};

		config.forEach(function (cfg) {
			_this.addField(new Path(cfg.path), cfg.generator, cfg.options);
		});
	}

	/*
 	path:
 	---
 	string: generator
 	object: options
 	||
 	any: value
 	||
 	function: factory
 */

	_createClass(Generator, [{
		key: 'addField',
		value: function addField(path, generator, options) {
			if (bmoor.isString(generator)) {
				generator = bmoor.get(generators, generator)(options);
			}

			var accessors = path.tokenizer.getAccessors();
			var name = accessors[0].join('.');
			var field = this.fields[accessors[0]];

			if (field) {
				field.addPath(path, generator);
			} else {
				field = new Writer(accessors.shift());

				field.addChild(accessors, generator);

				this.fields[name] = field;
			}
		}
	}, {
		key: 'generate',
		value: function generate() {
			var rtn = {};

			for (var f in this.fields) {
				var field = this.fields[f];

				field.generateOn(rtn);
			}

			return rtn;
		}
	}]);

	return Generator;
}();

module.exports = {
	default: Generator,
	generators: generators
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeSetter = __webpack_require__(0).makeSetter;

var Writer = function () {
	function Writer(accessor) {
		_classCallCheck(this, Writer);

		this.accessor = accessor;

		this.set = makeSetter(accessor);
	}

	_createClass(Writer, [{
		key: '_makeChild',
		value: function _makeChild(accessor) {
			return new this.constructor(accessor);
		}
	}, {
		key: 'addChild',
		value: function addChild(accessors, generator) {
			if (accessors.length) {
				var next = accessors.shift();

				if (!this.children) {
					this.children = {};

					if (!this.generator) {
						this.setGenerator(function () {
							return [{}];
						});
					}
				}

				var value = next.join('.');
				var child = this.children[value];

				if (!child) {
					child = this.children[value] = this._makeChild(next);
				}

				child.addChild(accessors, generator);
			} else {
				this.setGenerator(generator);
			}
		}
	}, {
		key: 'addPath',
		value: function addPath(path, generator) {
			var accessors = path.tokenizer.getAccessors();

			// TODO : better way to do this right?
			if (accessors[0].join('.') !== this.accessor.join('.')) {
				throw new Error('can not add path that does not ' + 'have matching first accessor');
			}

			accessors.shift();

			this.addChild(accessors, generator);
		}
	}, {
		key: 'setGenerator',
		value: function setGenerator(fn) {
			this.generator = fn;
		}
	}, {
		key: 'generateOn',
		value: function generateOn(obj) {
			var _this = this;

			var val = this.generator();

			this.set(obj, val);

			if (this.children) {
				val.forEach(function (datum) {
					for (var p in _this.children) {
						var child = _this.children[p];

						child.generateOn(datum);
					}
				});
			}
		}
	}]);

	return Writer;
}();

module.exports = {
	default: Writer
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(3).default;

var tests = [function (def, v, errors) {
	if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== def.type && (def.required || v !== undefined)) {
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
		var arr = new Path(def.path).flatten(obj);

		if (def.required && arr.length === 1 && arr[0] === undefined) {
			errors.push({
				path: def.path,
				type: 'missing',
				value: undefined,
				expect: def.type
			});
		} else if (arr.length) {
			arr.forEach(function (v) {
				tests.forEach(function (fn) {
					fn(def, v, errors);
				});
			});
		}
	});

	if (errors.length) {
		return errors;
	} else {
		return null;
	}
}

validate.$ops = tests;

module.exports = {
	default: validate,
	tests: tests
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0),
    setUid = bmoor.data.setUid;

module.exports = {
	fn: function route(dex, parent) {
		var old = null;
		var index = {};

		var _get = function _get(key) {
			var collection = index[key];

			if (!collection) {
				collection = parent.makeChild({}, function () {
					// I don't want the children to do anything
					// the parent will copy data down
				});
				index[key] = collection;
			}

			return collection;
		};

		function add(datum) {
			var d = dex.go(datum);

			old[setUid(datum)] = d;

			_get(d).add(datum);
		}

		function remove(datum) {
			var dex = setUid(datum);

			if (dex in old) {
				_get(old[dex]).remove(datum);
			}
		}

		function makeRouter() {
			old = {};

			for (var k in index) {
				index[k].empty();
			}

			for (var i = 0, c = parent.data.length; i < c; i++) {
				add(parent.data[i]);
			}
		}

		makeRouter();

		var _disconnect = parent.subscribe({
			next: makeRouter
		});

		return {
			get: function get(search) {
				return _get(dex.parse(search));
			},
			reroute: function reroute(datum) {
				remove(datum);
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
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function indexer(dex, parent) {
		var index = null;

		function makeIndex() {
			index = {};

			if (parent.data) {
				for (var i = 0, c = parent.data.length; i < c; i++) {
					var datum = parent.data[i],
					    key = dex.go(datum);

					index[key] = datum;
				}
			}
		}

		makeIndex();

		var _disconnect = parent.subscribe({
			next: makeIndex
		});

		return {
			get: function get(search) {
				var key = dex.parse(search);
				return index[key];
			},
			keys: function keys() {
				return Object.keys(index);
			},
			disconnect: function disconnect() {
				_disconnect();
			}
		};
	}
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return parent.makeChild(settings, function () {
			var _this = this;

			this.empty(); // empty calls next

			if (settings.before) {
				settings.before();
			}

			parent.data.forEach(function (datum) {
				if (dex.go(datum)) {
					_this.add(datum);
				}
			});

			if (settings.after) {
				settings.after();
			}
		});
	}
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		return parent.makeChild(settings, function () {
			this.empty();

			if (settings.before) {
				settings.before();
			}

			this.consume(parent.data);
			this.data.sort(dex.go);

			if (settings.after) {
				settings.after();
			}
		});
	}
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function fn(dex, parent, settings) {
		var child = parent.makeChild(settings);

		child.go = function () {
			var arr = parent.data;

			child.empty();

			if (settings.before) {
				settings.before();
			}

			for (var i = 0, c = arr.length; i < c; i++) {
				var datum = arr[i];

				child.add(dex.go(datum));
			}

			if (settings.after) {
				settings.after();
			}
		};

		child.go();

		return child;
	}
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	test: function test(old, fn) {
		if (old) {
			return function () {
				if (fn.apply(this, arguments)) {
					return true;
				} else {
					return old.apply(this, arguments);
				}
			};
		} else {
			return fn;
		}
	}
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	memorized: function memorized(parent, cache, expressor, generator, settings) {
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
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataProxy = __webpack_require__(10),
    DataCollection = __webpack_require__(7);

var defaultSettings = {
	proxyFactory: function proxyFactory(datum) {
		return new DataProxy(datum);
	}
};

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

var Proxied = function (_DataCollection) {
	_inherits(Proxied, _DataCollection);

	function Proxied(src, settings) {
		_classCallCheck(this, Proxied);

		var _this = _possibleConstructorReturn(this, (Proxied.__proto__ || Object.getPrototypeOf(Proxied)).call(this, src, settings));

		if (src) {
			_this.data.forEach(function (datum, i) {
				_this.data[i] = _this._wrap(datum);
			});
		}
		return _this;
	}

	//--- array methods


	_createClass(Proxied, [{
		key: 'indexOf',
		value: function indexOf(obj, start) {
			if (!start) {
				start = 0;
			}

			if (obj instanceof DataProxy) {
				return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'indexOf', this).call(this, obj, start);
			} else {
				var c = this.data.length;
				while (start < c && this.data[start].getDatum() !== obj) {
					start++;
				}

				if (this.data.length !== start) {
					return start;
				} else {
					return -1;
				}
			}
		}
	}, {
		key: 'mergeChanges',
		value: function mergeChanges() {
			return this.data.map(function (p) {
				p.merge();

				return p.getDatum();
			});
		}
	}, {
		key: 'flattenAll',
		value: function flattenAll() {
			return this.data.map(function (p) {
				return p.flatten();
			});
		}

		//--- collection methods

	}, {
		key: '_wrap',
		value: function _wrap(datum) {
			var proxy;

			if (datum instanceof DataProxy) {
				proxy = datum;
			} else {
				var factory = this.settings.proxyFactory || defaultSettings.proxyFactory;
				proxy = factory(datum);
			}

			return proxy;
		}
	}, {
		key: '_add',
		value: function _add(datum) {
			var proxy = this._wrap(datum);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), '_add', this).call(this, proxy);
		}
	}, {
		key: 'index',
		value: function index(search, settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'index', this).call(this, search, settings);
		}

		//--- child generators 

	}, {
		key: 'route',
		value: function route(search, settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'route', this).call(this, search, settings);
		}
	}, {
		key: 'filter',
		value: function filter(search, settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'filter', this).call(this, search, settings);
		}
	}, {
		key: 'search',
		value: function search(settings) {
			return this.select(settings);
		}
	}, {
		key: 'select',
		value: function select(settings) {
			settings = configSettings(settings);

			return _get(Proxied.prototype.__proto__ || Object.getPrototypeOf(Proxied.prototype), 'select', this).call(this, settings);
		}
	}]);

	return Proxied;
}(DataCollection);

Proxied.settings = defaultSettings;

module.exports = Proxied;

/***/ }),
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    schema = __webpack_require__(11),
    Join = __webpack_require__(36).Join;

/*
/models
 - name
 - properties [prop name]
  - read
  - write
  - update
 - relationships [prop name]
  - type (toOne, toMany)
  - model 
  - foreignKey
  - through []
    - model
    - incoming
    - outgoing
*/

function normalizeProperty(prop) {
	if (!('read' in prop)) {
		prop.read = true;
	}

	if (!('write' in prop)) {
		prop.write = false;
	}

	if (!('update' in prop)) {
		prop.update = false;
	}

	return prop;
}

var Model = function () {
	function Model(name, settings) {
		var _this = this;

		_classCallCheck(this, Model);

		this.name = name;

		this.id = settings.id || 'id';

		this.schema = schema.get(settings.schema || 'default');
		this.schema.register(name, this);

		/*
  [ name ] => {
  	read
  	write
  	update
  }
  */
		this.selectFields = settings.selectFields || [];
		this.createFields = settings.createFields || [];
		this.updateFields = settings.updateFields || [];

		this.properties = Object.keys(settings.properties).reduce(function (props, p) {
			var prop,
			    v = settings.properties[p];

			if (bmoor.isBoolean(v)) {
				prop = normalizeProperty({
					read: v,
					write: v,
					update: v
				});
			} else if (v === null) {
				prop = normalizeProperty({
					read: true,
					write: false,
					update: false
				});
			} else {
				prop = normalizeProperty(v);
			}

			props[p] = prop;

			if (prop.read) {
				_this.selectFields.push(p);
			}

			if (prop.write) {
				_this.createFields.push(p);
			}

			if (prop.update) {
				_this.updateFields.push(p);
			}

			return props;
		}, {});

		/*
  [ targetModel ] => {
  	type: 'toMany' || 'toOne'
  	key,
  	model:
  	foreignKey:
  	through: [{
  		model: 
  		incoming:
  		outgoing:
  	}]
  }
  */
		this.relationships = settings.relationships;
	}

	_createClass(Model, [{
		key: 'getJoin',
		value: function getJoin(target) {
			var relationship = this.relationships[target];

			if (relationship) {
				// right now I'm not handling cross schema stuff
				return new Join(relationship.type, {
					model: this.name,
					key: relationship.key
				}, {
					model: relationship.model,
					key: relationship.foreignKey
				}, relationship.through);
			} else {
				throw new Error('connection missing to ' + target);
			}
		}
	}]);

	return Model;
}();

module.exports = {
	Model: Model
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Join = function Join(type, begin, end, through) {
	var _this = this;

	_classCallCheck(this, Join);

	this.type = type;
	this.path = [];

	var curr = {
		fromModel: begin.model,
		fromKey: begin.key
	};

	if (through) {
		through.forEach(function (r) {
			curr.toModel = r.model;
			curr.toKey = r.incoming;

			_this.path.push(curr);

			curr = {
				fromModel: r.model,
				fromKey: r.outgoing
			};
		});
	}

	curr.toModel = end.model;
	curr.toKey = end.key;

	this.path.push(curr);
};

module.exports = {
	Join: Join
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Schema: __webpack_require__(2).default,
	Linker: __webpack_require__(12).default
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Proxy: __webpack_require__(13).default
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataCollection = __webpack_require__(1).collection.Proxied;

var defaultSettings = {};

var Collection = function (_DataCollection) {
  _inherits(Collection, _DataCollection);

  function Collection() {
    _classCallCheck(this, Collection);

    return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
  }

  return Collection;
}(DataCollection);

Collection.settings = defaultSettings;

module.exports = Collection;

/***/ })
/******/ ]);