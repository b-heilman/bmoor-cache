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