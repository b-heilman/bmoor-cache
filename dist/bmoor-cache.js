var bmoorCache =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = {
		Filter: __webpack_require__(2),
		Schema: __webpack_require__(17),
		Table: __webpack_require__(18),
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3);

	function stackFilter( old, getter, value ){
		if ( old ){
			return function( obj ){
				if ( getter(obj) === value ){
					return old( obj );
				}else{
					return false;
				}
			};
		}else{
			return function( obj ){
				return getter( obj ) === value;
			};
		}
	}

	function buildFilter( obj ){
		var fn,
			flat = bmoor.object.implode( obj );

		Object.keys( flat ).forEach(function( path ){
			fn = stackFilter(
				fn,
				bmoor.makeGetter(path),
				flat[path]
			);
		});

		return fn;
	}

	class Filter {
		constructor( ops ){
			if ( bmoor.isFunction(ops) ){
				this.go = ops;
			}else if ( bmoor.isObject(ops) ){
				this.go = buildFilter( ops );
			}else{
				throw new Error(
					'I can not build a Filter out of '+typeof(ops)
				);
			}
		}
	}

	module.exports = Filter;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = Object.create( __webpack_require__(4) );

	bmoor.dom = __webpack_require__(5);
	bmoor.data = __webpack_require__(6);
	bmoor.array = __webpack_require__(7);
	bmoor.build = __webpack_require__(8);
	bmoor.object = __webpack_require__(12);
	bmoor.string = __webpack_require__(13);
	bmoor.promise = __webpack_require__(14);

	bmoor.Memory = __webpack_require__(15);
	bmoor.Eventing = __webpack_require__(16);

	module.exports = bmoor;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * The core of bmoor's usefulness
	 * @module bmoor
	 **/

	/**
	 * Tests if the value is undefined
	 *
	 * @function isUndefined
	 * @param {*} value - The variable to test
	 * @return {boolean}
	 **/
	function isUndefined( value ) {
		return value === undefined;
	}

	/**
	 * Tests if the value is not undefined
	 *
	 * @function isDefined
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isDefined( value ) {
		return value !== undefined;
	}

	/**
	 * Tests if the value is a string
	 *
	 * @function isString
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isString( value ){
		return typeof value === 'string';
	}

	/**
	 * Tests if the value is numeric
	 *
	 * @function isNumber
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isNumber( value ){
		return typeof value === 'number';
	}

	/**
	 * Tests if the value is a function
	 *
	 * @function isFuncion
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isFunction( value ){
		return typeof value === 'function';
	}

	/**
	 * Tests if the value is an object
	 *
	 * @function isObject
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isObject( value ){
		return value  && typeof value === 'object';
	}

	/**
	 * Tests if the value is a boolean
	 *
	 * @function isBoolean
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isBoolean( value ){
		return typeof value === 'boolean';
	}

	/**
	 * Tests if the value can be used as an array
	 *
	 * @function isArrayLike
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isArrayLike( value ) {
		// for me, if you have a length, I'm assuming you're array like, might change
		if ( value ){
			return isObject( value ) && ( value.length === 0 || (0 in value && (value.length-1) in value) );
		}else{
			return false;
		}
	}

	/**
	 * Tests if the value is an array
	 *
	 * @function isArray
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isArray( value ) {
		return value instanceof Array;
	}

	/**
	 * Tests if the value has no content.
	 * If an object, has no own properties.
	 * If array, has length == 0.
	 * If other, is not defined
	 *
	 * @function isEmpty
	 * @param {*} value The variable to test
	 * @return {boolean}
	 **/
	function isEmpty( value ){
		var key;

		if ( isObject(value) ){
			for( key in value ){ 
				if ( value.hasOwnProperty(key) ){
					return false;
				}
			}
		}else if ( isArrayLike(value) ){
			return value.length === 0;
		}else{
			return isUndefined( value );
		}

		return true;
	}

	function parse( path ){
		if ( !path ){
			return [];
		}else if ( isString(path) ){
			return path.split('.');
		}else if ( isArray(path) ){
			return path.slice(0);
		}else{
			throw new Error(
				'unable to parse path: '+
				path+ ' : '+typeof(path)
			);
		}
	}

	/**
	 * Sets a value to a namespace, returns the old value
	 *
	 * @function set
	 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
	 * @param {string|array} space The namespace
	 * @param {*} value The value to set the namespace to
	 * @return {*}
	 **/
	function set( root, space, value ){
		var i, c, 
			val,
			nextSpace,
			curSpace = root;
		
		space = parse(space);

		val = space.pop();

		for( i = 0, c = space.length; i < c; i++ ){
			nextSpace = space[ i ];
				
			if ( isUndefined(curSpace[nextSpace]) ){
				curSpace[ nextSpace ] = {};
			}
				
			curSpace = curSpace[ nextSpace ];
		}

		curSpace[ val ] = value;

		return curSpace;
	}

	function _makeSetter( property, next ){
		if ( next ){
			return function( ctx, value ){
				var t = ctx[property];

				if ( !t ){
					t = ctx[property] = {};
				}
				
				return next( t, value );
			};
		}else{
			return function( ctx, value ){
				ctx[property] = value;
				return ctx;
			};
		}
	}

	function makeSetter( space ){
		var i,
			fn,
			readings = parse(space);

		for( i = readings.length-1; i > -1; i-- ){
			fn = _makeSetter( readings[i], fn );
		}

		return fn;
	}

	/**
	 * get a value from a namespace, if it doesn't exist, the path will be created
	 *
	 * @function get
	 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
	 * @param {string|array|function} space The namespace
	 * @return {array}
	 **/
	function get( root, path ){
		var i, c,
			space,
			nextSpace,
			curSpace = root;
		
		space = parse(path);
		if ( space.length ){
			for( i = 0, c = space.length; i < c; i++ ){
				nextSpace = space[i];
					
				if ( isUndefined(curSpace[nextSpace]) ){
					return;
				}
				
				curSpace = curSpace[nextSpace];
			}
		}

		return curSpace;
	}

	function _makeGetter( property, next ){
		if ( next ){
			return function( obj ){
				try {
					return next( obj[property] );
				}catch( ex ){
					return undefined;
				}
			};
		}else{
			return function( obj ){
				try {
					return obj[property];
				}catch( ex ){
					return undefined;
				}
			};
		}
	}

	function makeGetter( path ){
		var i,
			fn,
			space = parse(path);

		if ( space.length ){
			for( i = space.length-1; i > -1; i-- ){
				fn = _makeGetter( space[i], fn );
			}
		}else{
			return function( obj ){
				return obj;
			};
		}

		return fn;
	}

	/**
	 * Delete a namespace, returns the old value
	 *
	 * @function del
	 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
	 * @param {string|array} space The namespace
	 * @return {*}
	 **/
	function del( root, space ){
		var old,
			val,
			nextSpace,
			curSpace = root;
		
		if ( space && (isString(space) || isArrayLike(space)) ){
			space = parse( space );

			val = space.pop();

			for( var i = 0; i < space.length; i++ ){
				nextSpace = space[ i ];
					
				if ( isUndefined(curSpace[nextSpace]) ){
					return;
				}
					
				curSpace = curSpace[ nextSpace ];
			}

			old = curSpace[ val ];
			delete curSpace[ val ];
		}

		return old;
	}

	/**
	 * Call a function against all elements of an array like object, from 0 to length.  
	 *
	 * @function loop
	 * @param {array} arr The array to iterate through
	 * @param {function} fn The function to call against each element
	 * @param {object} context The context to call each function against
	 **/
	function loop( arr, fn, context ){
		var i, c;

		if ( !context ){
			context = arr;
		}

		if ( arr.forEach ){
			arr.forEach( fn, context );
		}else{
			for ( i = 0, c = arr.length; i < c; ++i ){
				if ( i in arr ) {
					fn.call(context, arr[i], i, arr);
				}
			}
		}
	}

	/**
	 * Call a function against all own properties of an object.  
	 *
	 * @function each
	 * @param {object} arr The object to iterate through
	 * @param {function} fn The function to call against each element
	 * @param {object} context The context to call each function against
	 **/
	function each( obj, fn, context ){
		var key;

		if ( !context ){
			context = obj;
		}

		for( key in obj ){
			if ( obj.hasOwnProperty(key) ){
				fn.call( context, obj[key], key, obj );
			}
		}
	}

	/**
	 * Call a function against all own properties of an object, skipping specific framework properties.
	 * In this framework, $ implies a system function, _ implies private, so skip _
	 *
	 * @function iterate
	 * @param {object} obj The object to iterate through
	 * @param {function} fn The function to call against each element
	 * @param {object} context The scope to call each function against
	 **/
	function iterate( obj, fn, context ){
		var key;

		if ( !context ){
			context = obj;
		}

		for( key in obj ){ 
			if ( obj.hasOwnProperty(key) && key.charAt(0) !== '_' ){
				fn.call( context, obj[key], key, obj );
			}
		}
	}

	/**
	 * Call a function against all own properties of an object, skipping specific framework properties.
	 * In this framework, $ implies a system function, _ implies private, so skip both
	 *
	 * @function safe
	 * @param {object} obj - The object to iterate through
	 * @param {function} fn - The function to call against each element
	 * @param {object} scope - The scope to call each function against
	 **/
	function safe( obj, fn, context ){
		var key;

		if ( !context ){
			context = obj;
		}

		for( key in obj ){ 
			if ( obj.hasOwnProperty(key) && key.charAt(0) !== '_' && key.charAt(0) !== '$' ){
				fn.call( context, obj[key], key, obj );
			}
		}
	}

	function naked( obj, fn, context ){
		safe( obj, function( t, k, o ){
			if ( !isFunction(t) ){
				fn.call( context, t, k, o );
			}
		});
	}

	module.exports = {
		// booleans
		isUndefined: isUndefined,
		isDefined: isDefined,
		isString: isString,
		isNumber: isNumber,
		isFunction: isFunction,
		isObject: isObject,
		isBoolean: isBoolean,
		isArrayLike: isArrayLike,
		isArray: isArray,
		isEmpty: isEmpty,
		// access
		parse: parse,
		set: set,
		makeSetter: makeSetter,
		get: get,
		makeGetter: makeGetter,
		del: del,
		// controls
		loop: loop,
		each: each,
		iterate: iterate,
		safe: safe,
		naked: naked
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(4),
		regex = {};

	function getReg( className ){
		var reg = regex[className];

		if ( !reg ){
			reg = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
			regex[className] = reg;
		}

		return reg;
	}

	function getScrollPosition( doc ){
		if ( !doc ){
			doc = document;
		}

		return {
			left:  window.pageXOffset || ( doc.documentElement || doc.body ).scrollLeft ,
			top: window.pageYOffset || ( doc.documentElement || doc.body ).scrollTop
		};
	}

	function getBoundryBox( element ){
		return element.getBoundingClientRect();
	}

	function centerOn( element, target, doc ){
		var el = getBoundryBox(element),
			targ = getBoundryBox( target ),
			pos = getScrollPosition( doc );

		if ( !doc ){
			doc = document;
		}

		element.style.top = pos.top + targ.top + targ.height/2 - el.height / 2;
		element.style.left = pos.left + targ.left + targ.width/2 - el.width / 2;
		element.style.right = '';
		element.style.bottom = '';

		element.style.position = 'absolute';
		doc.body.appendChild( element );
	}

	function showOn( element, target, doc ){
		var direction,
			targ = getBoundryBox( target ),
			x = targ.x + targ.width / 2,
			y = targ.y + targ.height / 2,
			centerX = window.innerWidth / 2,
			centerY = window.innerHeight / 2,
			pos = getScrollPosition( doc );

		if ( !doc ){
			doc = document;
		}

		if ( x < centerX ){
			// right side has more room
			direction = 'r';
			element.style.left = pos.left + targ.right;
			element.style.right = '';
		}else{
			// left side has more room
			//element.style.left = targ.left - el.width - offset;
			direction = 'l';
			element.style.right = window.innerWidth - targ.left - pos.left;
			element.style.left = '';
		}

		if ( y < centerY ){
			// more room on bottom
			direction = 'b' + direction;
			element.style.top = pos.top + targ.bottom;
			element.style.bottom = '';
		}else{
			// more room on top
			direction = 't' + direction;
			element.style.bottom = window.innerHeight - targ.top - pos.top;
			element.style.top = '';
		}
		
		element.style.position = 'absolute';
		doc.body.appendChild( element );

		return direction;
	}

	function massage( elements ){
		if ( !bmoor.isArrayLike(elements) ){
			elements = [elements];
		}

		return elements;
	}

	function getDomElement( element, doc ){
		if ( !doc ){
			doc = document;
		}

		if ( bmoor.isString(element) ){
			return doc.querySelector( element );
		}else{
			return element;
		}
	}

	function getDomCollection( elements, doc ){
		var i, c,
			j, co,
			el,
			selection,
			els = [];

		if ( !doc ){
			doc = document;
		}

		elements = massage(elements);

		for( i = 0, c = elements.length; i < c; i++ ){
			el = elements[i];
			if ( bmoor.isString(el) ){
				selection = doc.querySelectorAll(el);
				for( j = 0, co = selection.length; j < co; j++ ){
					els.push( selection[j] );
				}
			}else{
				els.push( el );
			}
		}

		return els;
	}

	function addClass( elements, className ){
		var i, c,
			node,
			baseClass,
			reg = getReg( className );

		elements = massage( elements );
		
		for( i = 0, c = elements.length; i < c; i++ ){
			node = elements[i];
			baseClass = node.getAttribute('class') || '';

			if ( !baseClass.match(reg) ){
				node.setAttribute( 'class', baseClass+' '+className );
			}
		}
	}

	function removeClass( elements, className ){
		var i, c,
			node,
			reg = getReg( className );

		elements = massage( elements );
		
		for( i = 0, c = elements.length; i < c; i++ ){
			node = elements[i];
			node.setAttribute( 'class', (node.getAttribute('class')||'').replace(reg,'') );
		}
	}

	function triggerEvent( elements, eventName, eventData ){
		var i, c,
			doc,
			node,
			event,
			EventClass;

		elements = massage( elements );
		
		for( i = 0, c = elements.length; i < c; i++ ){
			node = elements[i];
			
			// Make sure we use the ownerDocument from the provided node to avoid cross-window problems
			if (node.ownerDocument){
				doc = node.ownerDocument;
			}else if (node.nodeType === 9){
				// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
				doc = node;
			}else if ( typeof document !== 'undefined' ){
				doc = document;
			}else{
				throw new Error('Invalid node passed to fireEvent: ' + node.id);
			}

			if ( node.dispatchEvent ){
				try{
					// modern, except for IE still? https://developer.mozilla.org/en-US/docs/Web/API/Event
					// I ain't doing them all
					// slightly older style, give some backwards compatibility
					switch (eventName) {
						case 'click':
						case 'mousedown':
						case 'mouseup':
							EventClass = MouseEvent;
							break;

						case 'focus':
						case 'blur':
							EventClass = FocusEvent; // jshint ignore:line
							break;

						case 'change':
						case 'select':
							EventClass = UIEvent; // jshint ignore:line
							break;

						default:
							EventClass = CustomEvent;
					}

					if ( !eventData ){
						eventData = { 'view': window, 'bubbles': true, 'cancelable': true };
					}else{
						if ( eventData.bubbles === undefined ){
							eventData.bubbles = true;
						}
						if ( eventData.cancelable === undefined ){
							eventData.cancelable = true;
						}
					}

					event = new EventClass( eventName, eventData );
				}catch( ex ){
					// slightly older style, give some backwards compatibility
					switch (eventName) {
						case 'click':
						case 'mousedown':
						case 'mouseup':
							EventClass = 'MouseEvents';
							break;

						case 'focus':
						case 'change':
						case 'blur':
						case 'select':
							EventClass = 'HTMLEvents';
							break;

						default:
							EventClass = 'CustomEvent';
					}
					event = doc.createEvent(EventClass);
					event.initEvent(eventName, true, true); 
				}

				event.$synthetic = true; // allow detection of synthetic events
				
				node.dispatchEvent(event);
			}else if (node.fireEvent){
				// IE-old school style
				event = doc.createEventObject();
				event.$synthetic = true; // allow detection of synthetic events
				node.fireEvent('on' + eventName, event);
			}
		}
	}

	function bringForward( elements ){
		var i, c,
			node;

		elements = massage( elements );

		for( i = 0, c = elements.length; i < c; i++ ){
			node = elements[i];

			if ( node.parentNode ){
				node.parentNode.appendChild( node );
			}
		}
	}

	module.exports = {
		getScrollPosition: getScrollPosition,
		getBoundryBox: getBoundryBox,
		getDomElement: getDomElement,
		getDomCollection: getDomCollection,
		showOn: showOn,
		centerOn: centerOn,
		addClass: addClass,
		removeClass: removeClass,
		triggerEvent: triggerEvent,
		bringForward: bringForward
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * Array helper functions
	 * @module bmoor.data
	 **/

	 var _id = 0;

	function nextUid(){
		return ++_id;
	}

	function setUid( obj ){
		var t = obj.$$bmoorUid;

		if ( !t ){
			t = obj.$$bmoorUid = nextUid();
		}

		return t;
	}

	function getUid( obj ){
		if ( !obj.$$bmoorUid ){
			setUid( obj );
		}

		return obj.$$bmoorUid;
	}

	module.exports = {
		setUid: setUid,
		getUid: getUid
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Array helper functions
	 * @module bmoor.array
	 **/

	var bmoor = __webpack_require__(4);

	/**
	 * Search an array for an element, starting at the begining or a specified location
	 *
	 * @function indexOf
	 * @param {array} arr An array to be searched
	 * @param {*} searchElement Content for which to be searched
	 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
	 * @return {integer} -1 if not found, otherwise the location of the element
	 **/
	function indexOf( arr, searchElement, fromIndex ){
		if ( arr.indexOf ){
			return arr.indexOf( searchElement, fromIndex );
		} else {
			var length = parseInt( arr.length, 0 );

			fromIndex = +fromIndex || 0;

			if (Math.abs(fromIndex) === Infinity){
				fromIndex = 0;
			}

			if (fromIndex < 0){
				fromIndex += length;
				if (fromIndex < 0) {
					fromIndex = 0;
				}
			}

			for ( ; fromIndex < length; fromIndex++ ){
				if ( arr[fromIndex] === searchElement ){
					return fromIndex;
				}
			}

			return -1;
		}
	}

	/**
	 * Search an array for an element and remove it, starting at the begining or a specified location
	 *
	 * @function remove
	 * @param {array} arr An array to be searched
	 * @param {*} searchElement Content for which to be searched
	 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
	 * @return {array} array containing removed element
	 **/
	function remove( arr, searchElement, fromIndex ){
		var pos = indexOf( arr, searchElement, fromIndex );

		if ( pos > -1 ){
			return arr.splice( pos, 1 )[0];
		}
	}

	/**
	 * Search an array for an element and remove all instances of it, starting at the begining or a specified location
	 *
	 * @function remove
	 * @param {array} arr An array to be searched
	 * @param {*} searchElement Content for which to be searched
	 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
	 * @return {integer} number of elements removed
	 **/
	function removeAll( arr, searchElement, fromIndex ){
		var r,
			pos = indexOf( arr, searchElement, fromIndex );

		if ( pos > -1 ){
			r = removeAll( arr, searchElement, pos+1 );
			r.unshift( arr.splice(pos,1)[0] );
			
			return r;
		} else {
			return [];
		}
	}

	function bisect( arr, value, func, preSorted ){
		var idx,
			val,
			bottom = 0,
			top = arr.length - 1;

		if ( !preSorted ){
			arr.sort(function(a,b){
				return func(a) - func(b);
			});
		}

		if ( func(arr[bottom]) >= value ){
			return {
				left : bottom,
				right : bottom
			};
		}

		if ( func(arr[top]) <= value ){
			return {
				left : top,
				right : top
			};
		}

		if ( arr.length ){
			while( top - bottom > 1 ){
				idx = Math.floor( (top+bottom)/2 );
				val = func( arr[idx] );

				if ( val === value ){
					top = idx;
					bottom = idx;
				}else if ( val > value ){
					top = idx;
				}else{
					bottom = idx;
				}
			}

			// if it is one of the end points, make it that point
			if ( top !== idx && func(arr[top]) === value ){
				return {
					left : top,
					right : top
				};
			}else if ( bottom !== idx && func(arr[bottom]) === value ){
				return {
					left : bottom,
					right : bottom
				};
			}else{
				return {
					left : bottom,
					right : top
				};
			}
		}
	}

	/**
	 * Generate a new array whose content is a subset of the intial array, but satisfies the supplied function
	 *
	 * @function remove
	 * @param {array} arr An array to be searched
	 * @param {*} searchElement Content for which to be searched
	 * @param {integer} fromIndex The begining index from which to begin the search, defaults to 0
	 * @return {integer} number of elements removed
	 **/
	function filter( arr, func, thisArg ){
		if ( arr.filter ){
			return arr.filter( func, thisArg );
		}else{
			var i,
				val,
				t = Object( this ), // jshint ignore:line
				c = parseInt( t.length, 10 ),
				res = [];

			if ( !bmoor.isFunction(func) ){
				throw new Error('func needs to be a function');
			}

			for ( i = 0; i < c; i++ ){
				if ( i in t ){
					val = t[i];

					if ( func.call(thisArg, val, i, t) ){
						res.push( val );
					}
				}
			}

			return res;
		}
	}

	/**
	 * Compare two arrays, 
	 *
	 * @function remove
	 * @param {array} arr1 An array to be compared
	 * @param {array} arr2 An array to be compared
	 * @param {function} func The comparison function
	 * @return {object} an object containing the elements unique to the left, matched, and unqiue to the right
	 **/
	function compare( arr1, arr2, func ){
		var cmp,
			left = [],
			right = [],
			leftI = [],
			rightI = [];

		arr1 = arr1.slice(0);
		arr2 = arr2.slice(0);

		arr1.sort( func );
		arr2.sort( func );

		while( arr1.length > 0 && arr2.length > 0 ){
			cmp = func( arr1[0], arr2[0] );

			if ( cmp < 0 ){
				left.push( arr1.shift() );
			}else if ( cmp > 0 ){
				right.push( arr2.shift() );
			}else{
				leftI.push( arr1.shift() );
				rightI.push( arr2.shift() );
			}
		}

		while( arr1.length ){
			left.push( arr1.shift() );
		}

		while( arr2.length ){
			right.push( arr2.shift() );
		}

		return {
			left : left,
			intersection : {
				left : leftI,
				right : rightI
			},
			right : right
		};
	}

	module.exports = {
		indexOf: indexOf,
		remove: remove,
		removeAll: removeAll,
		bisect: bisect,
		filter: filter,
		compare: compare
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(4),
		mixin = __webpack_require__(9),
		plugin = __webpack_require__(10),
		decorate = __webpack_require__(11);

	function proc( action, proto, def ){
		var i, c;

		if ( bmoor.isArray(def) ){
			for( i = 0, c = def.length; i < c; i++ ){
				action( proto, def[i] );
			}
		}else{
			action( proto, def );
		}
	}

	function maker( root, config, base ){
		if ( !base ){
			base = function BmoorPrototype(){};

			if ( config ){
				if ( bmoor.isFunction(root) ){
					base = function BmoorPrototype(){
						root.apply( this, arguments );
					};

					base.prototype = Object.create( root.prototype );
				}else{
					base.prototype = Object.create( root );
				}
			}else{
				config = root;
			}
		}

		if ( config.mixin ){
			proc( mixin, base.prototype, config.mixin );
		}

		if ( config.decorate ){
			proc( decorate, base.prototype, config.decorate );
		}

		if ( config.plugin ){
			proc( plugin, base.prototype, config.plugin );
		}

		return base;
	}

	maker.mixin = mixin;
	maker.decorate = decorate;
	maker.plugin = plugin;

	module.exports = maker;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(4);

	module.exports = function( to, from ){
		bmoor.iterate( from, function( val, key ){
			to[key] = val;
		});
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(4);

	function override( key, target, action, plugin ){
		var old = target[key];
		
		if ( old === undefined ){
			if ( bmoor.isFunction(action) ){
				target[key] = function(){
					return action.apply( plugin, arguments );
				};
			} else {
				target[key] = action;
			}
		} else {
			if ( bmoor.isFunction(action) ){
				if ( bmoor.isFunction(old) ){
					target[key] = function(){
						var backup = plugin.$old,
							reference = plugin.$target,
							rtn;

						plugin.$target = target;
						plugin.$old = function(){
							return old.apply( target, arguments );
						};

						rtn = action.apply( plugin, arguments );

						plugin.$old = backup;
						plugin.$target = reference;

						return rtn;
					};
				}else{
					console.log( 'attempting to plug-n-play '+key+' an instance of '+typeof(old) );
				}
			}else{
				console.log( 'attempting to plug-n-play with '+key+' and instance of '+typeof(action) );
			}
		}
	}

	module.exports = function( to, from, ctx ){
		bmoor.iterate( from, function( val, key ){
			override( key, to, val, ctx );
		});
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(4);

	function override( key, target, action ){
		var old = target[key];
		
		if ( old === undefined ){
			target[key] = action;
		} else {
			if ( bmoor.isFunction(action) ){
				if ( bmoor.isFunction(old) ){
					target[key] = function(){
						var backup = this.$old,
							rtn;

						this.$old = old;

						rtn = action.apply( this, arguments );

						this.$old = backup;

						return rtn;
					};
				} else {
					console.log( 'attempting to decorate '+key+' an instance of '+typeof(old) );
				}
			}else{
				console.log( 'attempting to decorate with '+key+' and instance of '+typeof(action) );
			}
		}
	}

	module.exports = function( to, from ){
		bmoor.iterate( from, function( val, key ){
			override( key, to, val );
		});
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Object helper functions
	 * @module bmoor.object
	 **/

	var bmoor = __webpack_require__(4);

	function values( obj ){
		var res = [];

		bmoor.naked( obj, function( v ){
			res.push( v );
		});

		return res;
	}

	function keys( obj ){
		var res = [];

		if ( Object.keys ){
			return Object.keys(obj);
		}else{
			bmoor.naked( obj, function( v, key ){
				res.push( key );
			});

			return res;
		}
	}

	/**
	 * Takes a hash and uses the indexs as namespaces to add properties to an objs
	 *
	 * @function explode
	 * @param {object} target The object to map the variables onto
	 * @param {object} mappings An object orientended as [ namespace ] => value
	 * @return {object} The object that has had content mapped into it
	 **/
	function explode( target, mappings ){
		if (!mappings ){
			mappings = target;
			target = {};
		}

		bmoor.iterate( mappings, function( val, mapping ){
			bmoor.set( target, mapping, val );
		});

		return target;
	}

	function implode( obj, ignore ){
		var rtn = {};

		if ( !ignore ){
			ignore = {};
		}

		bmoor.iterate( obj, function( val, key ){
			var t = ignore[key];

			if ( bmoor.isObject(val) ){
				if ( t === false ){
					rtn[key] = val;
				} else if ( !t || bmoor.isObject(t) ){
					bmoor.iterate( implode(val,t), function( v, k ){
						rtn[key+'.'+k] = v;
					});
				}
			}else if ( !t ){
				rtn[key] = val;
			}
		});

		return rtn;
	}

	/**
	 * Create a new instance from an object and some arguments
	 *
	 * @function mask
	 * @param {function} obj The basis for the constructor
	 * @param {array} args The arguments to pass to the constructor
	 * @return {object} The new object that has been constructed
	 **/
	function mask( obj ){
		if ( Object.create ){
			var T = function Masked(){};

			T.prototype = obj;

			return new T();
		}else{
			return Object.create( obj );
		}
	}

	/**
	 * Create a new instance from an object and some arguments.  This is a shallow copy to <- from[...]
	 * 
	 * @function extend
	 * @param {object} to Destination object.
	 * @param {...object} src Source object(s).
	 * @returns {object} Reference to `dst`.
	 **/
	function extend( to ){
		bmoor.loop( arguments, function(cpy){
			if ( cpy !== to ) {
				if ( to && to.extend ){
					to.extend( cpy );
				}else{
					bmoor.iterate( cpy, function(value, key){
						to[key] = value;
					});
				}
				
			}
		});

		return to;
	}

	function empty( to ){
		bmoor.iterate( to, function( v, k ){
			delete to[k]; // TODO : would it be ok to set it to undefined?
		});
	}

	function copy( to ){
		empty( to );

		return extend.apply( undefined, arguments );
	}

	// Deep copy version of extend
	function merge( to ){
		var from,
			i, c,
			m = function( val, key ){
				to[ key ] = merge( to[key], val );
			};

		for( i = 1, c = arguments.length; i < c; i++ ){
			from = arguments[i];

			if ( to === from || !from ){
				continue;
			}else if ( to && to.merge ){
				to.merge( from );
			}else if ( !bmoor.isObject(to) ){
				if ( bmoor.isObject(from) ){
					to = merge( {}, from );
				}else{
					to = from;
				}
			}else{
				bmoor.safe( from, m );
			}
		}
		
		return to;
	}

	/**
	 * A general comparison algorithm to test if two objects are equal
	 *
	 * @function equals
	 * @param {object} obj1 The object to copy the content from
	 * @param {object} obj2 The object into which to copy the content
	 * @preturns {boolean}
	 **/
	function equals( obj1, obj2 ){
		var t1 = typeof obj1,
			t2 = typeof obj2,
			c,
			i,
			keyCheck;

		if ( obj1 === obj2 ){
			return true;
		}else if ( obj1 !== obj1 && obj2 !== obj2 ){
			return true; // silly NaN
		}else if ( obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined ){
			return false; // undefined or null
		}else if ( obj1.equals ){
			return obj1.equals( obj2 );
		}else if ( obj2.equals ){
			return obj2.equals( obj1 ); // because maybe somene wants a class to be able to equal a simple object
		}else if ( t1 === t2 ){
			if ( t1 === 'object' ){
				if ( bmoor.isArrayLike(obj1) ){
					if ( !bmoor.isArrayLike(obj2) ){ 
						return false; 
					}

					if ( (c = obj1.length) === obj2.length ){
						for( i = 0; i < c; i++ ){
							if ( !equals(obj1[i], obj2[i]) ) { 
								return false;
							}
						}

						return true;
					}
				}else if ( !bmoor.isArrayLike(obj2) ){
					keyCheck = {};
					for( i in obj1 ){
						if ( obj1.hasOwnProperty(i) ){
							if ( !equals(obj1[i],obj2[i]) ){
								return false;
							}

							keyCheck[i] = true;
						}
					}

					for( i in obj2 ){
						if ( obj2.hasOwnProperty(i) ){
							if ( !keyCheck && obj2[i] !== undefined ){
								return false;
							}
						}
					}
				}
			}
		}

		return false;
	}

	module.exports = {
		keys: keys,
		values: values,
		explode: explode,
		implode: implode,
		mask: mask,
		extend: extend,
		empty: empty,
		copy: copy,
		merge: merge,
		equals: equals
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(4);

	/**
	 * Array helper functions
	 * @module bmoor.string
	 **/

	function trim( str, chr ){
		if ( !chr ){
			chr = '\\s';
		}
		return str.replace( new RegExp('^'+chr+'+|'+chr+'+$','g'), '' );
	}

	function ltrim( str, chr ){
		if ( !chr ){
			chr = '\\s';
		}
		return str.replace( new RegExp('^'+chr+'+','g'), '' );
	}

	function rtrim( str, chr ){
		if ( !chr ){
			chr = '\\s';
		}
		return str.replace( new RegExp(chr+'+$','g'), '' );
	}

	// TODO : eventually I will make getCommands and getFormatter more complicated, but for now
	//        they work by staying simple
	function getCommands( str ){
		var commands = str.split('|');

		commands.forEach(function( command, key ){
			var args = command.split(':');

			args.forEach(function( arg, k ){
				args[k] = trim( arg );
			});

			commands[key] = {
				command: command,
				method: args.shift(),
				args: args
			};
		});

		return commands;
	}

	function stackFunctions( newer, older ){
		return function( o ){
			return older( newer(o) );
		};
	}

	var filters = {
		precision: function( dec ){
			dec = parseInt(dec,10);

			return function ( num ){
				return parseFloat(num,10).toFixed( dec );
			};
		},
		currency: function(){
			return function( num ){
				return '$'+num;
			};
		},
		url: function(){
			return function( param ){
				return encodeURIComponent( param );
			};
		}
	};

	function doFilters( ters ){
		var fn,
			command,
			filter;

		while( ters.length ){
			command = ters.pop();
			fn = filters[command.method];
			
			if ( fn ){
				fn = fn.apply( null, command.args );

				if ( filter ){
					filter = stackFunctions( fn, filter );
				}else{
					filter = fn;
				}
			}
		}

		return filter;
	}

	function doVariable( lines ){
		var fn,
			rtn,
			dex,
			line,
			getter,
			command,
			commands,
			remainder;

		if ( !lines.length ){
			return null;
		}else{
			line = lines.shift();
			dex = line.indexOf('}}');
			fn = doVariable(lines);
			
			if ( dex === -1 ){
				return function(){
					return '| no close |';
				};
			}else if ( dex === 0 ){
				// is looks like this {{}}
				remainder = line.substr(2);
				getter = function( o ){
					if ( bmoor.isObject(o) ){
						return JSON.stringify(o);
					}else{
						return o;
					}
				};
			}else{
				commands = getCommands( line.substr(0,dex) );
				command = commands.shift().command;
				remainder = line.substr(dex+2);
				getter = bmoor.makeGetter( command );

				if ( commands.length ){
					commands = doFilters(commands,getter);

					if ( commands ){
						getter = stackFunctions( getter, commands );
					}
				}
			}

			//let's optimize this a bit
			if ( fn ){
				// we have a child method
				rtn = function( obj ){
					return getter(obj)+remainder+fn(obj);
				};
				rtn.$vars = fn.$vars;
			}else{
				// this is the last variable
				rtn = function( obj ){
					return getter(obj)+remainder;
				};
				rtn.$vars = [];
			}

			if ( command ){
				rtn.$vars.push(command);
			}

			return rtn;
		}
	}

	function getFormatter( str ){
		var fn,
			rtn,
			lines = str.split(/{{/g);

		if ( lines.length > 1 ){
			str = lines.shift();
			fn = doVariable( lines );
			rtn = function( obj ){
				return str + fn( obj );
			};
			rtn.$vars = fn.$vars;
		}else{
			rtn = function(){
				return str;
			};
			rtn.$vars = [];
		}

		return rtn;
	}

	getFormatter.filters = filters;

	module.exports = {
		trim: trim,
		ltrim: ltrim,
		rtrim: rtrim,
		getCommands: getCommands,
		getFormatter: getFormatter
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	function always( promise, func ){
		promise.then(func, func);
		return promise;
	}

	module.exports = {
		always: always
	};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	var master = {};

	class Memory{
		constructor(){
			var index = {};

			this.check = function( name ){
				return index[name];
			};

			this.register = function( name, obj ){
				index[name] = obj;
			};

			this.clear = function( name ){
				if ( name in index ){
					delete index[name];
				}
			};
		}
	}

	module.exports = {
		Memory: Memory,
		use: function( title ){
			var rtn = master[title];

			if ( rtn ){
				throw new Error('Memory already exists '+title);
			}else{
				rtn = master[title] = new Memory(title);
			}

			return rtn;
		}
	};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	class Eventing {

		constructor(){
			this._listeners = {};
		}

		on( event, cb ){
			var listeners;

			if ( !this._listeners[event] ){
				this._listeners[event] = [];
			}

			listeners = this._listeners[event];

			listeners.push( cb );

			return function clear$on(){
				listeners.splice( listeners.indexOf(cb), 1 );
			};
		}

		once( event, cb ){
			var clear,
				fn = function(){
					clear();
					cb.apply( this, arguments );
				};

			clear = this.on( event, fn );

			return clear;
		}

		subscribe( subscriptions ){
			var dis = this,
				kills = [],
				events =  Object.keys(subscriptions);

			events.forEach(function( event ){
				var action = subscriptions[event];

				kills.push( dis.on(event,action) );
			});

			return function killAll(){
				kills.forEach(function( kill ){
					kill();
				});
			};
		}

		trigger( event ){
			var args = Array.prototype.slice.call(arguments,1);

			if ( this.hasWaiting(event) ){
				this._listeners[event].slice(0).forEach( ( cb ) => {
					cb.apply( this, args );
				});
			}
		}

		hasWaiting( event ){
			return !!this._listeners[event];
		}
	}

	module.exports = Eventing;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3).Memory.use('schema');

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		Proxy = __webpack_require__(19).object.Proxy,
		schema = __webpack_require__(17),
		Filter = __webpack_require__(2),
		Promise = __webpack_require__(32).Promise,
		Collection = __webpack_require__(19).Collection;

	function consume( table, res ){
		var i, c;

		for( i = 0, c = res.length; i < c; i++ ){
			table.set( res[i] );
		}
	}

	class Table {
		/* 
		* name : the name of your table
		* ops
		* <required>
		* - connector : bmoor-comm.connector object
		* - id
		* - merge : fn( to, from )
		* - proxy : proxy to apply to all elements
		*/
		constructor( name, ops ){
			var parser,
				id = ops.id;

			if ( !ops.connector ){
				throw new Error(
					'bmoor-comm::Table requires a connector'
				);
			}

			if ( !ops.id ){
				throw new Error(
					'bmoor-comm::Table requires a id field of function'
				);
			}

			if ( !( ops.proxy || ops.merge ) ){
				throw new Error(
					'bmoor-comm::Table requires a merge field for collisions'
				);
			}

			schema.register( name, this );

			if ( bmoor.isFunction( id ) ){
				this.$encode = function( qry ){
					return qry;
				};
				parser = id;
			}else if ( bmoor.isString(id) ){
				this.$encode = function( qry ){
					var t;

					if ( bmoor.isObject(qry) ){
						return qry;
					}else{
						t = {};
						t[id] = qry;
						return t;
					}
				};
				parser = function( qry ){
					if ( bmoor.isObject(qry) ){
						return qry[id];
					}else{
						return qry;
					}
				};
			}else{
				throw new Error(
					'I do not know how to parse with' + 
					JSON.stringify(id)
				);
			}

			this.$datum = function( obj ){
				if ( obj instanceof Proxy ){
					obj = obj.getDatum();
				}

				return obj;
			};

			this.$id = ( obj ) => {
				return parser( this.$datum(obj) );
			};

			this.name = name;
			this.connector = ops.connector;
			this.collection = new Collection();
			this.index = this.collection.index( this.$id );
			
			this._proxy = ops.proxy;
			this._merge = ops.merge;

			if ( ops.partialList ){
				this.gotten = {};
			}
		}

		find( obj ){
			return this.index.get( this.$id(obj) );
		}

		set( obj, delta ){
			var id = this.$id( obj ),
				t = this.index.get( id );

			if ( id ){
				if( t ){
					if ( t instanceof Proxy ){
						t.merge( delta || obj );
					}else{
						this._merge( t, delta || obj );
					}
				}else{
					if ( this._proxy ){
						t = new (this._proxy)( obj );
					}else{
						t = obj;
					}

					this.collection.add( t );
				}

				return {
					id: id,
					ref: t
				};
			}else{
				throw new Error(
					'missing id for object: '+JSON.stringify( obj )
				);
			}
		}

		_set( obj ){
			return new Promise( ( resolve, reject ) => {
				try{
					resolve( this.set(obj).ref );
				}catch( ex ){
					reject( ex );
				}
			});
		}

		_get( obj ){
			return this.connector.read( this.$encode(obj) )
				.then( ( res ) => {
					var t = this._set( res );

					t.then( ( d ) => {
						if ( this.gotten ){
							this.gotten[ d.id ] = true;
						}
					});

					return t;
				});
		}

		// get
		get( obj ){
			var t = this.find( obj );
			
			// how do I handle the object cacheing out?
			if ( t ){
				if ( this.gotten && !this.gotten[this.$id(obj)] ){
					return this._get( obj );
				}else{
					return Promise.resolve( t );
				}
			}else{
				return this._get( obj );
			}
		}

		// all
		all( obj ){
			if ( !this.$all ){
				this.$all = new Promise( ( resolve, reject ) => {
					this.connector.all( obj ).then(
						( res ) => {
							try{
								consume( this, res );
								resolve( this.collection );
							}catch( ex ){
								reject( ex );
							}
						}
					);
				});
			}

			return this.$all;
		}

		// insert
		insert( obj ){
			var t = this.find( obj );

			if ( t ){
				throw new Error(
					'This already exists ' +
					JSON.stringify( obj )
				);
			}else{
				return this.connector.create( obj ).then( ( res ) => {
					return this._set( bmoor.isObject(res) ? res : obj );
				});
			}
		}

		// update
		// delta is optional
		update( from, delta, ignoreResult ){
			var t;

			from = this.$encode( from );
			t = this.find( from );

			if ( t ){
				return this.connector.update( from, delta )
					.then( ( res ) => {
						if ( !ignoreResult ){
							this.set( 
								from, 
								bmoor.isObject(res) ? res : delta 
							);
						}

						return res;
					});
			}else{
				throw new Error(
					'Can not update that which does not exist' +
					JSON.stringify( from )
				);	
			}
		}

		del( obj ){
			var t = this.index.get( this.$id(obj) );

			this.collection.remove( t );

			return t;
		}

		// delete
		delete( obj ){
			var t = this.find( obj );

			if ( t ){
				return this.connector.delete( this.$encode(obj) )
					.then( ( res ) => {
						this.del( obj );

						return res;
					});
			}else{
				throw new Error(
					'Can not delete that which does not exist' +
					JSON.stringify( obj )
				);	
			}
		}

		// select
		select( qry, fn ){
			var t,
				filter = new Filter( fn || qry );
			
			if ( this.$all ){
				t = this.$all;
			}else if ( this.connector.search ){
				// TODO : Feed doesn't currently support search
				t = this.connector.search( qry ).then(( res ) => {
					consume( this, res );
				});
			}else{
				t = this.all( qry );
			}

			return t.then(() => {
				return this.collection.filter( ( datum ) => {
					return filter.go( this.$datum(datum) );
				});
			});
		}
	}

	Table.schema = schema;

	module.exports = Table;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = {
		Feed: __webpack_require__(20),
		Pool: __webpack_require__(21),
		Collection: __webpack_require__(29),
		stream: {
			Converter: __webpack_require__(30)
		},
		object: {
			Proxy: __webpack_require__(31)
		}
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		Eventing = bmoor.Eventing,
		setUid = bmoor.data.setUid,
		oldPush = Array.prototype.push;

	// designed for one way data flows.
	// src -> feed -> target
	class Feed extends Eventing {

		constructor( src ){
			super();

			if ( !src ){
				src = [];
			}else{
				src.push = src.unshift = this.add.bind( this );
			}

			setUid(this);

			this.data = src;
		}

		add( datum ){
			oldPush.call( this.data, datum );

			this.trigger( 'insert', datum );

			this.trigger( 'update' );
		}

		consume( arr ){
			var i, c;

			oldPush.apply( this.data, arr );

			if ( this.hasWaiting('insert') ){
				for ( i = 0, c = arr.length; i < c; i++ ){
					this.trigger( 'insert', arr[i] );
				}
			}

			this.trigger( 'update' );
		}
	}

	module.exports = Feed;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		Eventing = bmoor.Eventing,
		getUid = bmoor.data.getUid,
		makeGetter = bmoor.makeGetter,
		Mapper = __webpack_require__(22).Mapper;

	class Pool extends Eventing {

		constructor(){
			super();

			bmoor.data.setUid(this);

			this.data = [];
			this.feeds = {};
			this.index = {};
		}

		addFeed( feed, index, readings ){
			var dex = makeGetter( index ),
				uid = getUid( feed ),
				data = this.data,
				dexs = this.index,
				mapper = ( new Mapper(readings) ).go,
				trigger = this.trigger.bind(this);

			function read( datum ){
				var i = dex( datum ), // identity
					d = dexs[i];

				if ( !d ){
					d = dexs[i] = {
						_ : i
					};
					data.push( d );
				}

				mapper( d, datum );

				trigger('update');
			}

			if ( !this.feeds[uid] ){
				this.feeds[uid] = feed.on( 'insert', read );
			}
		}
	}

	module.exports = Pool;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = {
		encode: __webpack_require__(23),
		Mapper: __webpack_require__(24),
		Mapping: __webpack_require__(26),
		Path: __webpack_require__(25),
		translate: __webpack_require__(27),
		validate: __webpack_require__(28)
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		ops;

	function parse( def, path, val ){
		var method;

		if ( bmoor.isArray(val) ){
			method = 'array';
		}else{
			method = typeof(val);
		}

		ops[method]( def, path, val );
	}

	ops = {
		array: function( def, path, val ){
			var next = val[0];

			parse( def, path+'[]', next );
		},
		object: function( def, path, val ){
			if ( path.length ){
				path += '.';
			}
			
			Object.keys(val).forEach( function( key ){
				parse( def, path+key, val[key]);
			});
		},
		number: function( def, path, val ){
			def.push({
				path: path,
				type: 'number',
				sample: val
			});
		},
		boolean: function( def, path, val ){
			def.push({
				path: path,
				type: 'boolean',
				sample: val
			});
		},
		string: function( def, path, val ){
			def.push({
				path: path,
				type: 'string',
				sample: val
			});
		}
	};

	function encode( json ){
		var t = [];

		if ( json ){
			parse( t, '', json );

			return t;
		}else{
			return json;
		}
	}

	encode.$ops = ops;

	module.exports = encode;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var Path = __webpack_require__(25),
		bmoor = __webpack_require__(3),
		Mapping = __webpack_require__(26);

	function stack( fn, old ){
		if ( old ){
			return function( to, from ){
				old( to, from );
				fn( to, from );
			};
		}else{
			return fn;
		}
	}

	// TODO : merging arrays

	// converts one object structure to another
	class Mapper {

		constructor( settings ){
			this.mappings = {};

			// this.run is defined via recursive stacks
			if ( settings ){
				Object.keys( settings ).forEach( ( to ) => {
					var from = settings[to];

					if ( bmoor.isObject(from) ){
						// so it's an object, parent is an array
						if ( from.to ){
							to = from.to;
						}

						if ( from.from ){
							from = from.from;
						}else{
							throw new Error('I can not find a from clause');
						}
					}

					this.addMapping( to, from );
				});
			}
		}

		addMapping( toPath, fromPath ){
			var to = new Path( toPath ),
				from = new Path( fromPath ),
				dex = to.leading + '-' + from.leading,
				mapping = this.mappings[dex]; 

			if ( mapping ){
				mapping.addChild( to.remainder, from.remainder );
			}else{
				mapping = new Mapping( to, from );
				this.mappings[ dex ] = mapping;

				this.go = stack( mapping.go, this.go );
			}
		}
	}

	module.exports = Mapper;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		makeGetter = bmoor.makeGetter,
		makeSetter = bmoor.makeSetter;

	class Path {
		// normal path: foo.bar
		// array path : foo[]bar
		constructor( path ){
			var end,
				dex = path.indexOf('['),
				args;

			this.raw = path;

			if ( dex === -1 ){
				this.type = 'linear';
			}else{
				this.type = 'array';

				end = path.indexOf( ']', dex );

				this.op = path.substring( dex+1, end );
				args = this.op.indexOf(':');

				if ( path.charAt(end+1) === '.' ){
					end++;
				}

				this.remainder = path.substr( end + 1 );

				if ( args === -1 ){
					this.args = '';
				}else{
					this.args = this.op.substr( args+1 );
					this.op = this.op.substring( 0, args );
				}

				path = path.substr( 0, dex );
			}

			this.leading = path;

			if ( path === '' ){
				this.path = [];
			}else{
				this.path = path.split('.');
				this.set = makeSetter( this.path );
			}

			// if we want to, we can optimize path performance
			this.get = makeGetter( this.path );
		}

		flatten( obj ){
			var t,
				rtn,
				next;

			if ( this.remainder === undefined ){
				return [ this.get(obj) ];
			}else{
				t = this.get(obj);
				rtn = [];
				next = new Path( this.remainder );
				t.forEach(function( o ){
					rtn = rtn.concat( next.flatten(o) );
				});

				return rtn;
			}
		}

		exec( obj, fn ){
			this.flatten( obj ).forEach(function( o ){
				fn( o );
			});
		}
	}

	module.exports = Path;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	var Path = __webpack_require__(25);

	function all( next ){
		return function( toObj, fromObj ){
			var i, c,
				dex,
				t;

			for( i = 0, c = fromObj.length; i < c; i++ ){
				t = {};
				dex = toObj.length;

				toObj.push(t);
				
				next( t, fromObj[i], toObj, dex );
			}
		};
	}

	var arrayMethods = {
		'': all,
		'*': all,
		'merge': function( next ){
			return function( toObj, fromObj, toRoot, toVar ){
				var i, c,
					dex,
					t;

				if ( fromObj.length ){
					next( toObj, fromObj[0], toRoot, toVar );

					for( i = 1, c = fromObj.length; i < c; i++ ){
						t = {};
						dex = toRoot.length;

						toRoot.push( t );
						
						next( t, fromObj[i], toRoot, dex );
					}
				}
			};
		},
		'first': function( next ){
			return function( toObj, fromObj, toRoot, toVar ){
				var t = {};

				toRoot[toVar] = t;

				next( t, fromObj[0], toRoot, toVar );
			};
		},
		'last': function( next ){
			return function( toObj, fromObj, toRoot, toVar ){
				var t = {};

				toRoot[toVar] = t;

				next( t, fromObj[fromObj.length-1], toRoot, toVar );
			};	
		},
		'pick': function( next, args ){
			return function( toObj, fromObj, toRoot, toVar ){
				var t = {},
					dex = parseInt( args, 10 );

				toRoot[toVar] = t;

				next( t, fromObj[dex], toRoot, toVar );
			};	
		}
	};

	function buildArrayMap( to, from, next ){
		var fn = arrayMethods[to.op]( next, to.args );

		if ( to.path.length ){
			return function( toObj, fromObj ){
				var t = [],
					parent = to.set( toObj, t );

				fn( t, from.get(fromObj), parent, to.path[to.path.length-1] );
			};
		}else{
			return function( toObj, fromObj, toRoot, toVar ){
				var t = [],
					myRoot;

				if ( toRoot ){
					t = [];
					toRoot[toVar] = t;
					myRoot = toRoot;
				}else{
					// this must be when an array leads
					myRoot = t = toObj;
				}

				fn( t, from.get(fromObj), myRoot, toVar );
			};
		}
	}

	function stackChildren( old, fn ){
		if ( old ){
			return function( toObj, fromObj, toRoot, toVar ){
				fn( toObj, fromObj, toRoot, toVar );
				old( toObj, fromObj, toRoot, toVar );
			};
		}else{
			return fn;
		}
	}

	class Mapping {
		constructor( toPath, fromPath ){
			var to = toPath instanceof Path ? toPath : new Path( toPath ),
				from = fromPath instanceof Path ? fromPath : new Path( fromPath );

			this.chidren = {};

			if ( to.type === 'linear' && from.type === to.type ){
				if ( to.path.length ){
					this.go = function( toObj, fromObj ){
						to.set( toObj, from.get(fromObj) );
					};
				}else if ( from.path.length ){
					this.go = function( ignore, fromObj, toRoot, i ){
						toRoot[i] = from.get(fromObj);
					};
				}else{
					this.go = function( ignore, value, toRoot, i ){
						toRoot[i] = value;
					};
				}
			}else if ( to.type === 'array' && from.type === to.type ){
				this.addChild( to.remainder, from.remainder );
				this.go = buildArrayMap(
					to,
					from,
					( toObj, fromObj, toRoot, toVar ) => {
						this.callChildren( toObj, fromObj, toRoot, toVar );
					}
				);
			}else{
				throw new Error(
					'both paths needs same amount of array hooks'
				);
			}
		}

		addChild( toPath, fromPath ){
			var child,
				to = new Path( toPath ),
				from = new Path( fromPath ),
				dex = to.leading + '-' + from.leading;

			child = this.chidren[ dex ];

			if ( child ){
				child.addChild( to.remainder, from.remainder );
			}else{
				child = new Mapping( to, from );
				this.callChildren = stackChildren(
					this.callChildren,
					child.go
				);
			}
		}
	}

	module.exports = Mapping;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	function go( from, root, info ){
		var cur = from.shift();

		if ( cur[cur.length-1] === ']' ){
			cur = cur.substr( 0, cur.length - 2 );
		
			if ( cur === '' ){
				// don't think anything...
			}else{
				if ( !root[cur] ){
					root[cur] = {
						type: 'array'
					};
				}
				root = root[cur];
			}
			cur = 'items';
		}

		if ( from.length ){
			if ( !root[cur] ){
				root[cur] = {
					type: 'object',
					properties: {}
				};
			}
			go( from, root[cur].properties, info );
		}else{
			root[ cur ] = info;
		}
	}

	function split( str ){
		return str.replace(/]([^\.$])/g,'].$1').split('.');
	}

	function encode( schema ){
		var i, c,
			d,
			t,
			rtn,
			root,
			path = schema[0].to || schema[0].path;

		if ( split(path)[0] === '[]' ){
			rtn = { type: 'array' };
			root = rtn;
		}else{
			rtn = { type: 'object', properties: {} };
			root = rtn.properties;
		}

		for( i = 0, c = schema.length; i < c; i++ ){
			d = schema[i];

			path = d.to || d.path;

			t = { type: d.type };

			if ( d.from ){
				t.alias = d.from;
			}

			go( split(path), root, t );
		}

		return rtn;
	}

	module.exports = encode;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var Path = __webpack_require__(25);

	var tests = [
			function( def, v, errors ){
				if ( typeof(v) !== def.type ){
					errors.push({
						path: def.path,
						type: 'type',
						value: v,
						expect: def.type
					});
				}
			}
		];

	function validate( schema, obj ){
		var errors = [];

		schema.forEach(function( def ){
			(new Path(def.path)).exec( obj, function( v ){
				tests.forEach(function( fn ){
					fn( def, v, errors );
				});
			});
		});

		if ( errors.length ){
			return errors;
		}else{
			return null;
		}
	}

	validate.$ops = tests;

	module.exports = validate;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		Feed = __webpack_require__(20),
		setUid = bmoor.data.setUid;

	class Collection extends Feed {

		remove( datum ){
			var dex = this.data.indexOf( datum );
			
			if ( dex !== -1 ){
				this.data.splice( dex, 1 );

				this.trigger( 'remove', datum );

				this.trigger( 'update' );
			}
		}

		filter( fn ){
			var i, c,
				d,
				src = [],
				child = new Collection( src );

			for( i = 0, c = this.data.length; i < c; i++ ){
				d = this.data[i];

				if ( fn(d) ){
					src.push( d );
				}
			}

			child.$parent = this;

			child.$disconnect = this.subscribe({
				insert: function( ins ){
					if ( fn(ins) ){
						child.add( ins );
					}
				},
				remove: function( outs ){
					child.remove( outs );
				}
			});

			return child;
		}

		index( fn ){
			var i, c,
				d,
				disconnect,
				index = {};

			for( i = 0, c = this.data.length; i < c; i++ ){
				d = this.data[i];

				index[ fn(d) ] = d;
			}

			disconnect = this.subscribe({
				insert: function( ins ){
					index[ fn(ins) ] = ins;
				},
				remove: function( outs ){
					delete index[ fn(outs) ];
				}
			});

			return {
				get: function( dex ){
					return index[ dex ];
				},
				keys: function(){
					return Object.keys( index );
				},
				disconnect: function(){
					disconnect();
				}
			};
		}

		route( hasher ){
			var i, c,
				old = {},
				index = {},
				disconnect;

			function get( i ){
				var t = index[i];

				if ( !t ){
					t = new Collection();
					index[i] = t;
				}

				return t;
			}

			function add( datum ){
				var i = hasher( datum );

				old[ setUid(datum) ] = i;

				get(i).add( datum );
			}

			function remove( datum ){
				var dex = setUid(datum);

				if ( dex in old ){
					get( old[dex] ).remove( datum );
				}
			}

			for( i = 0, c = this.data.length; i < c; i++ ){
				add( this.data[i] );
			}

			disconnect = this.subscribe({
				insert: function( ins ){
					add( ins );
				},
				remove: function( outs ){
					remove( outs );
				}
			});

			return {
				get: function( hash ){
					return get( hash );
				},
				reroute: function( datum ){
					remove( datum );
					add( datum );
				},
				keys: function(){
					return Object.keys( index );
				},
				disconnect: function(){
					disconnect();
				}
			};
		}
	}

	module.exports = Collection;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		Eventing = bmoor.Eventing;

	function _datumStack( fn, old ){
		if ( old ){
			return function( datum, orig ){
				return fn( old(datum,orig), orig );
			};
		}else{
			return function( orig ){
				return fn( orig, orig );
			};
		}
	}

	function datumStack( fns ){
		var i, c,
			fn;

		for( i = 0, c = fns.length; i < c; i++ ){
			fn = _datumStack( fns[i], fn );
		}

		return fn;
	}

	function _arrStack( fn, old ){
		if ( old ){
			return function( src ){
				return fn( old(src) );
			};
		}else{
			return fn;
		}
	}

	function arrStack( fns ){
		var i, c,
			fn;

		for( i = 0, c = fns.length; i < c; i++ ){
			fn = _arrStack( fns[i], fn );
		}

		return fn;
	}

	// array wrapper that allows for watching a feed 
	class Converter extends Eventing {

		constructor( arrFn, datumFn ){
			super();

			bmoor.data.setUid(this);

			this.data = [];

			this.setArrayCriteria( arrFn );
			this.setDatumCriteria( datumFn );
		}

		setArrayCriteria( fns ){
			if ( fns ){
				this.arrParse = arrStack( fns );
			}else{
				this.arrParse = null;
			}
		}

		setDatumCriteria( fns ){
			if ( fns ){
				this.datumParse = datumStack( fns );
			}else{
				this.datumParse = null;
			}
		}

		// I don't want to force it to be Feed, just needs .on and .data
		// technically converters can stack
		setFeed( feed ){
			var dis = this;

			if ( this.disconnect ){
				this.disconnect();
			}

			function readAll( changes ){
				var i, c,
					arr;

				if ( changes && changes.length ){
					if ( dis.arrParse ){
						arr = dis.arrParse( changes );
					}else{
						arr = changes.slice(0);
					}

					if ( dis.datumParse ){
						for( i = 0, c = arr.length; i < c; i++ ){
							arr[i] = dis.datumParse( arr[i] );
						}
					}

					dis.data = dis.data.concat(arr);
					dis.trigger('insert', arr);
				}
			}

			readAll( feed.data );
			this.disconnect = feed.on( 'insert', readAll );
		}
	}

	module.exports = Converter;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var bmoor = __webpack_require__(3),
		Eventing = bmoor.Eventing;

	function makeMask( target, seed ){
		var mask = bmoor.isArray(target) ?
			target.slice(0) : Object.create( target );
		
		// I'm being lazy
		Object.keys(target).forEach( ( k ) => {
			if ( bmoor.isObject(target[k]) ){
				mask[k] = makeMask( 
					target[k],
					bmoor.isObject(seed) ? seed[k] : null
				);
			}
		});

		if ( seed ){
			Object.keys(seed).forEach( ( k ) => {
				if ( !mask[k] || 
					!(bmoor.isObject(mask[k]) && bmoor.isObject(seed))
				){
					mask[k] = seed[k];
				}
			});
		}

		return mask;
	}

	function isDirty( obj ){
		var i, c,
			t,
			keys = Object.keys( obj );

		for( i = 0, c = keys.length; i < c; i++ ){
			t = obj[keys[i]];

			if ( !bmoor.isObject(t) || isDirty(t) ){
				return true;
			}
		}

		return false;
	}

	function getChanges( obj ){
		var rtn = {},
			valid = false;

		Object.keys( obj ).forEach(function( k ){
			var d = obj[k];

			if ( bmoor.isObject(d) ){
				d = getChanges(d);
				if ( d ){
					valid = true;
					rtn[k] = d;
				}
			}else{
				valid = true;
				rtn[k] = d;
			}
		});

		if ( valid ){
			return rtn;
		}
	}

	class Proxy extends Eventing {
		constructor( obj ){
			super();

			this.getDatum = function(){
				return obj;
			};
		}

		_( path ){
			return this.getDatum()[ path ];
		}

		getMask( seed ){
			if ( !this.mask || seed ){
				this.mask = makeMask( this.getDatum(), seed );
			}

			return this.mask;
		}

		$( path ){
			return this.getMask()[ path ];
		}

		getChanges(){
			return getChanges( this.mask );
		}

		isDirty(){
			return isDirty( this.mask );
		}

		merge( delta ){
			if ( !delta ){
				delta = this.mask;
			}

			bmoor.object.merge( this.getDatum(), delta );

			this.mask = null;
			this.trigger( 'update', delta );
		}

		trigger(){
			// always make the datum be the last argument passed
			arguments[arguments.length] = this.getDatum();
			arguments.length++;

			super.trigger.apply( this, arguments );
		}
	}

	Proxy.isDirty = isDirty;
	Proxy.getChanges = getChanges;

	module.exports = Proxy;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var require;/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   4.1.0
	 */

	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.ES6Promise = factory());
	}(this, (function () { 'use strict';

	function objectOrFunction(x) {
	  return typeof x === 'function' || typeof x === 'object' && x !== null;
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}

	var _isArray = undefined;
	if (!Array.isArray) {
	  _isArray = function (x) {
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
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

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
	    var vertx = __webpack_require__(34);
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

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
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

	})));
	//# sourceMappingURL=es6-promise.map

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33), (function() { return this; }())))

/***/ }),
/* 33 */
/***/ (function(module, exports) {

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
	function defaultClearTimeout () {
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
	} ())
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
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
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
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
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
	    while(len) {
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

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ })
/******/ ]);