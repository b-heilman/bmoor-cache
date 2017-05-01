var bmoor = require('bmoor'),
	Proxy = require('bmoor-data').object.Proxy,
	schema = require('./Schema.js'),
	Promise = require('es6-promise').Promise,
	Collection = require('bmoor-data').Collection;

function consume( table, res ){
	var i, c;

	for( i = 0, c = res.length; i < c; i++ ){
		table.$set( res[i] );
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
		var dex,
			parser,
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

		dex = function( obj ){
			if ( obj instanceof Proxy ){
				obj = obj.getDatum();
			}

			return parser( obj );
		};

		this.connector = ops.connector;
		this.collection = new Collection();
		this.index = this.collection.index( dex );

		this.$find = function( obj ){
			return this.index.get( dex(obj) );
		};

		// TODO : proxy won't work right now
		this.$set = function( obj, delta ){
			var t,
				id = parser( obj );

			if ( delta ){
				t = this.index.get( id );

				if ( t instanceof Proxy ){
					t.update( delta );
				}else if ( t ){
					ops.merge( t, delta );
				}else{
					throw new Error(
						'tried to update something that does not exist' +
						JSON.stringify( obj )
					);
				}
			}else{
				if ( ops.proxy ){
					t = new ops.proxy( obj );
				}else{
					t = obj;
				}

				this.collection.add( t );
			}

			return t;
		};

		this.$del = function( obj ){
			var t = this.index.get( parser(obj) );

			this.collection.remove( t );

			return t;
		};
	}

	// get
	get( obj ){
		var t = this.$find( obj );
		
		// how do I handle the object cacheing out?
		if ( t ){
			return Promise.resolve( t );
		}else{
			return this.connector.read( this.$encode(obj) )
				.then( ( res ) => {
					return this.$set( res );
				});
		}
	}

	// all
	all( obj ){
		// TODO : once again, cache this out somehow?
		if ( !this.$all ){
			this.$all = this.connector.all( obj )
				.then( ( res ) => {
					consume( this, res );

					return this.collection; 
				});
		}

		return this.$all;
	}

	// insert
	insert( obj ){
		var t = this.$find( obj );

		if ( t ){
			throw new Error(
				'This already exists ' +
				JSON.stringify( obj )
			);
		}else{
			return this.connector.create( obj )
				.then( ( res ) => {
					return bmoor.isObject(res) ?
						this.$set( res ) :
						this.$set( obj );
				});
		}
	}

	// update
	// delta is optional
	update( from, delta, ignoreResult ){
		var t;

		from = this.$encode( from );
		t = this.$find( from );

		if ( t ){
			return this.connector.update( from, delta )
				.then( ( res ) => {
					if ( !ignoreResult ){
						bmoor.isObject(res) ?
							this.$set( from, res ) : 
							this.$set( from, delta );
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

	// delete
	delete( obj ){
		var t = this.$find( obj );

		if ( t ){
			return this.connector.delete( this.$encode(obj) )
				.then( ( res ) => {
					this.$del( obj );

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
	select( qry ){
		// TODO : turn qry into a function if it isn't

		if ( this.$all ){
			return this.$all;
		}else if ( this.connector.search ){
			// TODO : this is broken... how to make search compatible object
			// a filter method?
			return this.connector.search( qry ).then( ( res ) => {
				consume( this, res );

				return this.collection.filter( qry );
			});
		}else{
			return this.connector.all( qry ).then( ( res ) => {
				consume( this, res );

				return this.collection; 
			});
		}
	}
}

Table.schema = schema;

module.exports = Table;
