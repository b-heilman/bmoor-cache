var bmoor = require('bmoor');

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
		flat = bmoor.object.implode( obj ),
		values = [];

	Object.keys( flat ).sort().forEach(function( path ){
		var v = flat[path];

		fn = stackFilter(
			fn,
			bmoor.makeGetter(path),
			v
		);

		values.push( path+'='+v );
	});

	return {
		fn: fn,
		index: values.join(';')
	};
}

class Filter {

	constructor( ops, hash ){
		var t;

		if ( bmoor.isFunction(ops) ){
			this.go = ops;
			this.hash = hash;
		}else if ( bmoor.isObject(ops) ){
			t = buildFilter( ops );

			this.go = t.fn;
			this.hash = t.index;
		}else{
			throw new Error(
				'I can not build a Filter out of '+typeof(ops)
			);
		}
	}
}

module.exports = Filter;