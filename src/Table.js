var bmoor = require('bmoor'),
	Proxy = require('bmoor-data').object.Proxy,
	schema = require('./Schema.js'),
	Filter = require('./Filter.js'),
	Promise = require('es6-promise').Promise,
	Collection = require('bmoor-data').Collection;

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
					t.update( delta || obj );
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
