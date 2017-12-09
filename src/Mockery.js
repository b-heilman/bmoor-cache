var schema = require('./Schema.js');

class Mockery{
	constructor(){
		this.mocks = {};
		this.previous = {};
	}

	add( table, ops ){
		this.mocks[ table ] = ops;
	}

	mock( mock, method ){
		return function( datum, ctx ){
			return mock[method]( datum, ctx.$args );
		};
	}

	enable(){
		for( let i = 0, c = arguments.length; i < c; i++ ){
			let name = arguments[i],
				mock = this.mocks[name],
				table = schema.check( name );

			if ( mock && table && !this.previous[name] ){
				let prev = {
						preload: table.preload,
						search: table.connector.search,
						intercept: table.connector.all.$settings.intercept
					};

				table.preload = this.makeStub( prev.preload );

				table.connector.search = null; // force search through all
				table.connector.all.$settings.intercept = mock.all;
			
				if ( table.connector.create && mock.create ){
					prev.create = table.connector.create.$settings.intercept;
					table.connector.create.$settings.intercept = this.mock(mock,'create');
				}

				if ( table.connector.update ){
					prev.update = table.connector.update.$settings.intercept;
					table.connector.update.$settings.intercept = this.mock(mock,'update');
				}

				if ( table.connector.delete ){
					prev.delete = table.connector.delete.$settings.intercept;
					table.connector.delete.$settings.intercept = this.mock(mock,'delete');
				}

				this.previous[name] = prev;
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
