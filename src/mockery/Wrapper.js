
var schema = require('./Schema.js');

// TODO : I don't think this should always call all?
function makeStub( table, old ){
	// the idea is to route all requests through all, since all 
	// should be the simplest thing to stub.  Simplifies queries.
	return function( method ){
		if ( method === 'all' ){
			return old.call( table, method );
		}else{
			return table.all().then(() => {
				table.collection._next.flush();

				return old.call( table, method );
			});
		}
	};
}

function makeMock( mock, method ){
	return function( datum, ctx ){
		return mock[method](datum, ctx.args, ctx.payload);
	};
}

class Wrapper{
	constructor( table, mock ){
		this.mock = mock;
		this.table = table;
		
		schema.register( table.name, this );
	}

	enable(){
		if ( !this.previous ){
			let mock = this.mock,
				table = this.table,
				prev = {
					before: table.before,
					search: table.connector.search,
					intercept: table.connector.all.$settings.intercept
				};

			table.before = makeStub(table, prev.before);

			table.connector.search = null; // force search through all
			table.connector.all.$settings.intercept = mock.all;
		
			if ( table.connector.create && mock.create ){
				prev.create = table.connector.create.$settings.intercept;
				table.connector.create.$settings.intercept = makeMock(mock,'create');
			}

			if ( table.connector.update ){
				prev.update = table.connector.update.$settings.intercept;
				table.connector.update.$settings.intercept = makeMock(mock,'update');
			}

			if ( table.connector.delete ){
				prev.delete = table.connector.delete.$settings.intercept;
				table.connector.delete.$settings.intercept = makeMock(mock,'delete');
			}

			this.previous = prev;
		}
	}

	disable(){
		let prev = this.previous,
			table = this.table;

		if ( prev ){
			table.preload = prev.preload;
			table.connector.search = prev.search;
			table.connector.all.$settings.intercept = prev.intercept;
		
			this.previous = null;
		}
	}
}

module.exports = Wrapper;
