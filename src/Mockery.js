var schema = require('./Schema.js');

class Mockery{
	constructor(){
		this.mocks = {};
		this.previous = {};
	}

	add( table, ops ){
		this.mocks[ table ] = ops;
	}

	enable(){
		for( let i = 0, c = arguments.length; i < c; i++ ){
			let name = arguments[i],
				mock = this.mocks[name],
				table = schema.check( name );

			if ( mock && table && !this.previous[name] ){
				let old = table.preload;

				table.preload = this.makeStub( old );

				this.previous[name] = {
					preload: old,
					search: table.connector.search,
					intercept: table.connector.all.$settings.intercept
				};

				table.connector.search = null;
				table.connector.all.$settings.intercept = mock.all;
			}
		}
	}

	makeStub( old ){
		// the idea is to route all requests through all, since all 
		// should be the simplest thing to stub.  Simplifies queries.
		return function( method ){
			if ( method === 'all' ){
				return old.call( this, method );
			}else{
				return this.all().then( () => {
					return old.call( this, method );
				});
			}
		};
	}

	disable(){
		for( let i = 0, c = arguments.length; i < c; i++ ){
			let name = arguments[i],
				prev = this.previous[name],
				table = schema.check( name );

			if ( prev && table ){
				let old = table.preload;

				table.preload = this.makeStub( old );

				this.previous[name] = null;

				table.connector.search = prev.search;
				table.connector.all.$settings.intercept = prev.intercept;
			}
		}
	}
}

module.exports = Mockery;
