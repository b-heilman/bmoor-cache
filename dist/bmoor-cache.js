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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
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
	Feed: __webpack_require__(6),
	Pool: __webpack_require__(19),
	Collection: __webpack_require__(8),
	collection: {
		Proxied: __webpack_require__(35)
	},
	stream: {
		Converter: __webpack_require__(36)
	},
	object: {
		Proxy: __webpack_require__(11),
		Test: __webpack_require__(10),
		Hash: __webpack_require__(9)
	},
	structure: {
		Model: __webpack_require__(37).default,
		Schema: __webpack_require__(12).default
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

// makeSetter = bmoor.makeSetter,
Writer = __webpack_require__(25).default,
    Reader = __webpack_require__(26).default,
    Tokenizer = __webpack_require__(4).default;

var Path = function () {
	// normal path: foo.bar
	// array path : foo[].bar
	function Path(path) {
		_classCallCheck(this, Path);

		this.tokenizer = new Tokenizer(path);
	}

	// converts something like [{a:1},{a:2}] to [1,2]
	// when given [].a


	_createClass(Path, [{
		key: 'flatten',
		value: function flatten(obj) {
			var target = [obj],
			    chunks = this.tokenizer.accessors();

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
			this.flatten(obj).forEach(function (o) {
				fn(o);
			});
		}
	}, {
		key: 'getReader',
		value: function getReader() {
			return new Reader(this.tokenizer);
		}
	}, {
		key: 'getWriter',
		value: function getWriter() {
			return new Writer(this.tokenizer);
		}
	}]);

	return Path;
}();

module.exports = Path;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	default: __webpack_require__(0).Memory.use('cache-table-schema')
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

        var tokens = [];

        this.path = path;

        while (path) {
            var cur = nextToken(path);
            tokens.push(cur);
            path = cur.next;
        }

        this.pos = 0;
        this.tokens = tokens;
    }

    _createClass(Tokenizer, [{
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
        key: 'accessors',
        value: function accessors() {
            var rtn = [],
                cur = null;

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

            return rtn;
        }
    }, {
        key: 'chunk',
        value: function chunk() {
            var rtn = [],
                cur = null;

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

            return rtn;
        }
    }]);

    return Tokenizer;
}();

module.exports = {
    default: Tokenizer
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).Memory.use('cache-mockery-schema');

/***/ }),
/* 6 */
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
		_this.$dirty = false;

		if (_this.settings.controller) {
			_this.controller = new _this.settings.controller(_this);
		}

		_this.ready = bmoor.flow.window(function () {
			if (_this.controller && _this.controller.ready) {
				_this.controller.ready();
			}

			_this.trigger('update');
		}, _this.settings.windowMin || 0, _this.settings.windowMax || 30);
		return _this;
	}

	_createClass(Feed, [{
		key: '_add',
		value: function _add(datum) {
			oldPush.call(this.data, datum);

			this.$dirty = true;

			return datum;
		}
	}, {
		key: 'add',
		value: function add(datum) {
			var added = this._add(datum);

			this.trigger('insert', added);

			this.ready();

			return added;
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var i, c;

			for (i = 0, c = arr.length; i < c; i++) {
				var d = arr[i],
				    added = this._add(d);

				this.trigger('insert', added);
			}

			this.ready();
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
			console.warn('Feed::sort, will be removed soon');
			this.data.sort(fn);
		}
	}, {
		key: 'getData',
		value: function getData() {
			if (!this.$clone || this.$dirty) {
				this.$dirty = false;

				this.$clone = this.data.slice(0);
			}

			return this.$clone;
		}
	}]);

	return Feed;
}(Eventing);

module.exports = Feed;

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bmoor = __webpack_require__(0),
    Feed = __webpack_require__(6),
    Hash = __webpack_require__(9),
    Test = __webpack_require__(10),
    _route = __webpack_require__(28).fn,
    _index = __webpack_require__(29).fn,
    filter = __webpack_require__(30).fn,
    _sorted = __webpack_require__(31).fn,
    mapped = __webpack_require__(32).fn,
    testStack = __webpack_require__(33).test,
    memorized = __webpack_require__(34).memorized;

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
		key: '_add',
		value: function _add(datum) {
			if (this.settings.follow && datum.on) {
				datum.on[this.$$bmoorUid] = datum.on('update', this.settings.follow);
			}

			return _get(Collection.prototype.__proto__ || Object.getPrototypeOf(Collection.prototype), '_add', this).call(this, datum);
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

				if (this.settings.follow && datum.on) {
					datum.on[this.$$bmoorUid]();
				}

				return rtn;
			}
		}
	}, {
		key: 'remove',
		value: function remove(datum) {
			var rtn = this._remove(datum);

			if (rtn) {
				this.trigger('remove', rtn);

				this.ready();

				return rtn;
			}
		}
	}, {
		key: 'empty',
		value: function empty() {
			var arr = this.data;

			while (arr.length) {
				var d = arr[0];

				this._remove(d);
				this.trigger('remove', d);
			}

			this.ready();
		}
	}, {
		key: 'follow',
		value: function follow(parent, settings) {
			var _this2 = this;

			var disconnect = parent.subscribe(Object.assign({
				insert: function insert(datum) {
					_this2.add(datum);
				},
				remove: function remove(datum) {
					_this2.remove(datum);
				},
				process: function process() {
					_this2.go();
				},
				destroy: function destroy() {
					_this2.destroy();
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

			// if you just want to disconnect from this one
			// you can later be specific
			return disconnect;
		}
	}, {
		key: 'makeChild',
		value: function makeChild(settings) {
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

			return this._filter(function (datum) {
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

			child = this.makeChild(settings);

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
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0);
var DataProxy = __webpack_require__(1).object.Proxy;
var Schema = __webpack_require__(3).default;

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
		return function (datum, onload, name) {
			return [fn(datum, onload, name)];
		};
	} else {
		return function (datum, onload, name) {
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
		add: function add(datum, onload, name) {
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
		add: function add(datum, onload, name) {
			var ctrl = datum;

			if (name && target.name !== name) {
				return;
			}

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

				// TODO: make this insert?
				return child.set(value).then(function (res) {
					// back reference
					bmoor.set(res, '$links.' + target, // mount on $links property
					ctrl);

					return res;
				});
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
						collection.remove(res);
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataProxy = __webpack_require__(1).object.Proxy;

// { join: {table:'', field} }

var JoinableProxy = function (_DataProxy) {
	_inherits(JoinableProxy, _DataProxy);

	function JoinableProxy() {
		_classCallCheck(this, JoinableProxy);

		return _possibleConstructorReturn(this, (JoinableProxy.__proto__ || Object.getPrototypeOf(JoinableProxy)).apply(this, arguments));
	}

	_createClass(JoinableProxy, [{
		key: 'setLinker',
		value: function setLinker(linker) {
			this.linker = linker;
		}
	}, {
		key: 'link',
		value: function link(tableName) {
			return this.linker.link(this, tableName);
		}
	}, {
		key: 'inflate',
		value: function inflate() {
			return this.linker.link(this);
		}
	}]);

	return JoinableProxy;
}(DataProxy);

module.exports = {
	default: JoinableProxy
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(16);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	mockery: {
		Wrapper: __webpack_require__(17),
		Schema: __webpack_require__(5)
	},
	Table: __webpack_require__(18),
	table: __webpack_require__(39),
	object: __webpack_require__(40),
	Collection: __webpack_require__(41)
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var schema = __webpack_require__(5);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    schema = __webpack_require__(3).default,
    Test = __webpack_require__(1).object.Test,
    Linker = __webpack_require__(13).default,
    DataProxy = __webpack_require__(1).object.Proxy,
    CacheProxy = __webpack_require__(14).default,
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

		if (ops.synthetic) {
			// TODO : I might move synthetic to its own table like class
			this.synthetic = ops.synthetic;
		} else {
			this.connector = ops.connector;
		}

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

		this.linker = new Linker(this, ops.links);

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
			this.collection = this.collectionFactory();
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
					t = this.proxyFactory(obj);

					this.collection.add(t);
				}

				if (this.gotten) {
					this.gotten[id] = true;
				}

				if (this.linker) {
					return this.linker.add(t);
				} else {
					return Promise.resolve(t);
				}
			} else {
				throw new Error('missing id for object: ' + JSON.stringify(obj));
			}
		}
	}, {
		key: 'consume',
		value: function consume(arr) {
			var _this2 = this;

			return Promise.all(arr.map(function (d) {
				return _this2.set(d);
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
			var _this3 = this;

			var fetch;

			if (!options) {
				options = {};
			}

			// batch in the number of seconds you wait for another call
			// allow for the default to be batching
			var batch = 'batch' in options ? options.batch : 'batch' in defaultSettings ? defaultSettings.batch : null;

			if (this.synthetic) {
				fetch = function fetch(datum) {
					return _this3.synthetic.get(datum).then(function () {
						return _this3.find(obj);
					});
				};
			} else if (batch || batch === 0) {
				if (this.batched) {
					this.batched.list.push(obj);
				} else {
					this.batched = {
						list: [obj],
						promise: new Promise(function (resolve, reject) {
							setTimeout(function () {
								var batched = _this3.batched;

								_this3.batched = null;

								return _this3.getMany(batched.list).then(resolve, reject);
							}, batch);
						})
					};
				}

				fetch = function fetch(datum) {
					return _this3.batched.promise.then(function () {
						return _this3.find(datum);
					});
				};
			} else {
				fetch = function fetch(datum) {
					return _this3.connector.read(_this3.$encode(datum), null, options).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						return _this3.set(res);
					});
				};
			}

			return this.before('get').then(function () {
				var t = _this3.find(obj);

				if (!t || options && options.cached === false) {
					return fetch(obj);
				} else {
					if (_this3.gotten && !_this3.gotten[_this3.$id(obj)]) {
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
	}, {
		key: 'setMany',
		value: function setMany(prom, ids, hook) {
			var _this4 = this;

			var rtn = prom.then(function (res) {
				if (hook) {
					hook(res);
				}

				return Promise.all(res.map(function (r) {
					return _this4.set(r);
				}));
			});

			return rtn.then(function (res) {
				var collection = _this4.collectionFactory();

				if (ids) {
					ids.forEach(function (id, i) {
						collection.data[i] = _this4.index.get(id);
					});
				} else {
					res.forEach(function (p, i) {
						collection.data[i] = p;
					});
				}

				return collection;
			});
		}
	}, {
		key: 'fetch',
		value: function fetch(qry, options) {
			var _this5 = this;

			if (!options) {
				options = {};
			}

			return this.before('fetch', qry).then(function () {
				var rtn;

				if (_this5.synthetic) {
					// NOTE : I don't love this...
					rtn = _this5.synthetic.fetch(qry, options);
				} else {
					rtn = _this5.connector.query(qry, null, options);
				}

				return _this5.setMany(rtn, null, options.hook);
			});
		}

		// -- getMany

	}, {
		key: 'getMany',
		value: function getMany(arr, options) {
			var _this6 = this;

			if (!options) {
				options = {};
			}

			return this.before('get-many', arr).then(function () {
				var rtn,
				    all = [],
				    req = [];

				// reduce the list using gotten
				if (_this6.gotten) {
					arr.forEach(function (r) {
						var t = _this6.$id(r);

						all.push(t);

						if (!_this6.gotten[t]) {
							req.push(_this6.$encode(r));
						}
					});
				} else {
					arr.forEach(function (r) {
						var t = _this6.$id(r);

						all.push(t);

						if (!_this6.index.get(t)) {
							req.push(_this6.$encode(r));
						}
					});
				}

				if (req.length) {
					// this works because I can assume id was defined for 
					// the feed
					if (_this6.synthetic && _this6.synthetic.getMany) {
						rtn = _this6.synthetic.getMany(req, options);
					} else if (_this6.connector.readMany) {
						rtn = _this6.connector.readMany(req, null, options);
					} else {
						// The feed doesn't have readMany, so many reads will work
						req.forEach(function (id, i) {
							req[i] = _this6.connector.read(id, null, options);
						});
						rtn = Promise.all(req);
					}
				} else {
					rtn = Promise.resolve([]); // nothing to do
				}

				return _this6.setMany(rtn, all, options.hook);
			});
		}

		// -- all
		// all returns back the whole collection.  Allowing obj for dynamic
		// urls

	}, {
		key: 'all',
		value: function all(obj, options) {
			var _this7 = this;

			if (!options) {
				options = {};
			}

			return this.before('all').then(function () {
				if (!_this7.$all || options.cached === false) {
					var res = void 0;

					if (_this7.synthetic) {
						if (_this7.synthetic.all) {
							res = _this7.synthetic.all(obj, options);
						} else {
							res = Promise.resolve([]);
						}
					} else {
						res = _this7.connector.all(obj, null, options);
					}

					_this7.$all = res.then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						_this7.consume(res);

						return _this7.collection;
					});
				}

				return _this7.$all;
			});
		}

		// -- insert

	}, {
		key: 'insert',
		value: function insert(obj, options) {
			var _this8 = this;

			if (!options) {
				options = {};
			}

			return this.before('insert', obj).then(function () {
				var t = _this8.find(obj);

				if (_this8.synthetic) {
					// if it exists, don't do anything
					if (t) {
						return Promise.resolve(t);
					} else {
						return _this8.synthetic.insert(obj, options).then(function () {
							return _this8.find(obj);
						});
					}
				} else {
					if (t) {
						throw new Error('This already exists ' + JSON.stringify(obj));
					} else {
						return _this8.connector.create(obj, obj, options).then(function (res) {
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
							return _this8.set(datum).then(function (proxy) {
								if (options.useProto) {
									proxy.merge(obj);
								}

								return proxy;
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
			var _this9 = this;

			if (!options) {
				options = {};
			}

			return this.before('update', from, delta).then(function () {
				var proxy;

				if (from instanceof DataProxy) {
					proxy = from;
					from = from.getDatum();
				} else {
					from = _this9.$encode(from);
					proxy = _this9.find(from);
				}

				if (delta === true) {
					delta = proxy.getDatum();
				} else if (!delta) {
					delta = proxy.getChanges();
				}

				if (_this9.synthetic) {
					return _this9.synthetic.update(delta).then(function () {
						return proxy;
					});
				} else {
					if (proxy && delta) {
						return _this9.connector.update(from, delta, options).then(function (res) {
							if (options.hook) {
								options.hook(res);
							}

							if (!options.ignoreResponse && bmoor.isObject(res)) {
								proxy.merge(res);
							} else if (!options.ignoreDelta) {
								proxy.merge(delta);
							}

							return proxy;
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
			var _this10 = this;

			if (!options) {
				options = {};
			}

			return this.before('delete', obj).then(function () {
				var proxy = _this10.find(obj);

				if (proxy) {
					if (_this10.synthetic) {
						_this10.synthetic.delete().then(function () {
							return proxy;
						});
					} else {
						var datum = proxy.getDatum();

						return _this10.connector.delete(datum, datum, options).then(function (res) {
							if (options.hook) {
								options.hook(res);
							}

							_this10.del(obj);

							return proxy;
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
			var _this11 = this;

			return this.before('select', qry).then(function () {
				var op,
				    rtn,
				    test,
				    selection,
				    selections = _this11._selections;

				if (!options) {
					options = {};
				}

				_this11.normalize(qry);

				test = options instanceof Test ? options : options.test || new Test(options.fn || qry, {
					hash: options.hash,
					massage: options.massage || _this11.$datum
				});
				selection = selections[test.hash];

				if (selection && options.cached !== false) {
					selection.count++;

					return selection.filter;
				}

				if (_this11.connector.search) {
					rtn = _this11.connector.search(qry, // variables
					null, // no datum to send
					options // allow more fine tuned management
					).then(function (res) {
						if (options.hook) {
							options.hook(res);
						}

						_this11.consume(res);
					});
				} else {
					rtn = _this11.all(qry, options);
				}

				if (selection) {
					selection.count++;

					return rtn.then(function () {
						return selection.filter;
					});
				} else {
					selections[test.hash] = op = {
						filter: rtn.then(function () {
							var res = _this11.collection.filter(test),
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
/* 19 */
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
    Mapper = __webpack_require__(20).Mapper;

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	encode: __webpack_require__(21),
	Mapper: __webpack_require__(24),
	Mapping: __webpack_require__(7),
	Path: __webpack_require__(2),
	path: {
		Tokenizer: __webpack_require__(4).default
	},
	validate: __webpack_require__(27)
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    bmoorSchema: __webpack_require__(22).default,
    jsonSchema: __webpack_require__(23).default
};

/***/ }),
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Tokenizer = __webpack_require__(4).default;

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = __webpack_require__(2),
    bmoor = __webpack_require__(0),
    Mapping = __webpack_require__(7);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeSetter = __webpack_require__(0).makeSetter;

var Writer = function Writer(tokenizer, pos) {
	_classCallCheck(this, Writer);

	if (!pos) {
		pos = 0;
	}

	this.token = tokenizer.tokens[pos];

	if (pos + 1 < tokenizer.tokens.length) {
		this.child = new Writer(tokenizer, pos + 1);
	}

	this.set = makeSetter(this.token.accessor);
};

module.exports = {
	default: Writer
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeGetter = __webpack_require__(0).makeGetter;

var Reader = function Reader(tokenizer, pos) {
	_classCallCheck(this, Reader);

	if (!pos) {
		pos = 0;
	}

	this.token = tokenizer.tokens[pos];

	if (pos + 1 < tokenizer.tokens.length) {
		this.child = new Reader(tokenizer, pos + 1);
	}

	this.get = makeGetter(this.token.accessor);
};

module.exports = {
	default: Reader
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Path = __webpack_require__(2);

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

module.exports = validate;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0),
    setUid = bmoor.data.setUid;

module.exports = {
	fn: function route(dex, parent) {
		var old = {},
		    index = {},
		    _get = function _get(key) {
			var collection = index[key];

			if (!collection) {
				collection = parent.makeChild(false);
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
				return _get(dex.parse(search));
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
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	fn: function index(dex, parent) {
		var index = {};

		for (var i = 0, c = parent.data.length; i < c; i++) {
			var datum = parent.data[i],
			    key = dex.go(datum);

			index[key] = datum;
		}

		var _disconnect = parent.subscribe({
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0);

module.exports = {
	fn: function fn(dex, parent, settings) {
		var child;

		settings = Object.assign({
			follow: function follow() {
				// TODO: does go actually need to be called?
				child.go();
			},
			insert: function insert(datum) {
				if (dex.go(datum)) {
					child.add(datum);
				}
			}
		}, settings);

		child = parent.makeChild(settings);

		child.go = bmoor.flow.window(function () {
			var arr = parent.data;

			child.empty();

			if (settings.before) {
				settings.before();
			}

			arr.forEach(settings.insert);

			if (settings.after) {
				settings.after();
			}

			child.trigger('process');
		}, settings.min || 5, settings.max || 30);

		child.go.flush();

		return child;
	}
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0);

module.exports = {
	fn: function fn(dex, parent, settings) {
		var child;

		settings = Object.assign({
			follow: function follow() {
				// TODO: does go actually need to be called?
				child.go();
			},
			insert: function insert(datum) {
				child.add(datum);
				child.go();
			},
			update: function update() {
				child.go();
			}
		}, settings);

		child = parent.makeChild(settings);

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
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bmoor = __webpack_require__(0);

module.exports = {
	fn: function fn(dex, parent, settings) {
		var child;

		settings = Object.assign({}, {
			insert: function insert(datum) {
				// I only need to 
				child.add(dex.go(datum));
			}
			// remove should use a look-aside
		}, settings);

		child = parent.makeChild(settings);

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
};

/***/ }),
/* 33 */
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
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataProxy = __webpack_require__(11),
    DataCollection = __webpack_require__(8);

var defaultSettings = {
	proxyFactory: function proxyFactory(datum) {
		return new DataProxy(datum);
	}
};

function configSettings(settings) {
	if (!settings) {
		settings = {};
	}

	if (settings.massage) {
		var old = settings.massage;
		settings.massage = function (proxy) {
			return old(proxy.getDatum());
		};
	} else if (!('massage' in settings)) {
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

		_this.data.forEach(function (datum, i) {
			_this.data[i] = _this._wrap(datum);
		});
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
/* 36 */
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bmoor = __webpack_require__(0),
    schema = __webpack_require__(12),
    Join = __webpack_require__(38).Join;

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
/* 38 */
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Schema: __webpack_require__(3).default,
	Linker: __webpack_require__(13).default
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Proxy: __webpack_require__(14).default
};

/***/ }),
/* 41 */
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