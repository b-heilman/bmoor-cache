var bmoor = require('bmoor'),
	P = require('bmoor-data').object.Proxy,
	Proxy = require('./Proxy.js'),
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

		if ( !ops.proxy ){
			ops.proxy = Proxy;
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
			if ( obj instanceof P ){
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
		this._selections = {};
		
		this.proxy = ops.proxy;
		this.join = ops.join;

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
				t.merge( delta || obj );
			}else{
				t = new (this.proxy)( obj, this.join );

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

	// Used to check if that datum has been specifically fetched
	_set( obj ){
		var t = this.set(obj);

		// TODO : I might want to time out the gotten cache
		if ( this.gotten ){
			this.gotten[ t.id ] = true;
		}

		return t.ref;
	}

	_get( obj ){
		return this.connector.read( this.$encode(obj) )
			.then( ( res ) => { return this._set( res ); });
	}

	// get
	get( obj ){
		var t = this.find( obj );
		
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

	getMany( arr ){
		var rtn,
			all = [],
			req = [];

		// reduce the list using gotten
		if ( this.gotten ){
			arr.forEach( ( r ) => {
				var t = this.$id(r);

				all.push( t );

				if ( !this.gotten[t] ){
					req.push( this.$encode(r) );
				}
			});
		}else{
			arr.forEach( ( r ) => {
				var t = this.$id(r);

				all.push( t );

				if ( !this.index.get(t) ){
					req.push( this.$encode(r) );
				}
			});
		}

		if ( req.length ){
			// this works because I can assume id was defined for 
			// the feed
			if ( this.connector.readMany ){
				rtn = this.connector.readMany( req )
			}else{
				// The feed doesn't have readMany, so many reads will work
				req.forEach( ( id, i ) => {
					req[i] = this.connector.read( id );
				});
				rtn = Promise.all( req );
			}

			rtn.then( ( res ) => {
				res.forEach( ( r ) => {
					this._set( r );
				})
			});
		}else{
			rtn = Promise.resolve( true ); // nothing to do
		}

		return rtn.then( () => {
			all.forEach( ( id, i ) => {
				all[i] = this.index.get( id );
			});

			return all;
		});
	}

	// all
	all( obj, options ){
		if ( !this.$all || (options&&options.cached === false) ){
			this.$all = new Promise( ( resolve, reject ) => {
				this.connector.all( obj, null, options ).then(
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
				var proxy = this.set( res ).ref;

				proxy.merge( obj );

				return proxy;
			});
		}
	}

	// update
	// delta is optional
	update( from, delta ){
		var t,
			wasProxy = false;

		if ( from instanceof P ){
			wasProxy = true;

			t = from;
			from = t.getDatum();
		}else{
			from = this.$encode( from );
			t = this.find( from );
		}

		if ( !delta ){
			delta = t.getChanges();
		}

		if ( t ){
			return this.connector.update( from, delta )
				.then( ( res ) => {
					t.merge( delta );

					if ( bmoor.isObject(res) ){
						t.merge( res );
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
	select( qry, options ){
		var op,
			rtn,
			filter,
			selection,
			selections = this._selections;
		
		if ( !options ){
			options = {};
		}

		filter = new Filter( options.fn || qry, options.hash );
		selection = selections[filter.hash];

		if ( selection && options.cached !== false ){
			selection.count++;

			return selection.filter;
		}

		if ( this.connector.search ){
			rtn = this.connector.search(
				qry, // variables
				null, // no datum to send
				options // allow more fine tuned management
			).then(( res ) => {
				consume( this, res );
			});
		}else{
			rtn = this.all( qry, options );
		}

		if ( selection ){
			selection.count++;

			return rtn.then(function(){
				return selection.filter;
			});
		}else{
			selections[filter.hash] = op = {
				filter: rtn.then(() => {
					var res = this.collection.filter( ( datum ) => {
							return filter.go( this.$datum(datum) );
						}),
						disconnect = res.$disconnect;

					res.$disconnect = function(){
						op.count--;

						if ( !op.count ){
							selections[filter.hash] = null;
							disconnect();
						}
					};

					return res;
				}),
				count: 1
			};

			return op.filter;
		}
	}
}

Table.schema = schema;

module.exports = Table;
