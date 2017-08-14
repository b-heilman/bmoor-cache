var bmoor = require('bmoor'),
	P = require('bmoor-data').object.Proxy,
	Proxy = require('./Proxy.js'),
	schema = require('./Schema.js'),
	Filter = require('./Filter.js'),
	Promise = require('es6-promise').Promise,
	Collection = require('bmoor-data').Collection;

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

		this.preload = ops.preload || function(){
			return Promise.resolve(true);
		};

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
		
		this.proxy = ops.proxy;
		this.proxySettings = ops.proxySettings;

		if ( ops.partialList ){
			this.gotten = true;
		}

		this.reset();
	}

	reset(){
		this.collection = new Collection();
		this.index = this.collection.index( this.$id );
		this._selections = {};

		if ( this.gotten ){
			this.gotten = {};
		}
	}

	// no promise routes
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
				t = new (this.proxy)( obj, this.proxySettings );
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

	consume( arr ){
		var i, c;

		for( i = 0, c = arr.length; i < c; i++ ){
			this.set( arr[i] );
		}
	}

	del( obj ){
		var t = this.index.get( this.$id(obj) );

		this.collection.remove( t );

		return t;
	}

	// -- get
	get( obj, options ){
		var fetch = ( obj ) => {
			return this.connector.read( this.$encode(obj), null, options )
				.then( ( res ) => { return this._set( res ); });
		};

		return this.preload( 'get' ).then( () => {
			var t = this.find( obj );
			
			if ( t ){
				if ( this.gotten && !this.gotten[this.$id(obj)] ){
					return fetch( obj );
				}else{
					return t;
				}
			}else{
				return fetch( obj );
			}
		});
	}

	// --- get : cache busting
	refresh( obj, options ){
		if ( !options ){
			options = {};
		}

		options.cached = false;

		return this.get( obj, options );
	}

	// -- getMany
	getMany( arr, options ){
		return this.preload( 'get-many' ).then( () => {
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
					rtn = this.connector.readMany( req, null, options );
				}else{
					// The feed doesn't have readMany, so many reads will work
					req.forEach( ( id, i ) => {
						req[i] = this.connector.read( id, null, options );
					});
					rtn = Promise.all( req );
				}

				rtn.then( ( res ) => {
					res.forEach( ( r ) => {
						this._set( r );
					});
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
		});
	}

	// -- all
	// all returns back the whole collection.  Allowing obj for dynamic
	// urls
	all( obj, options ){
		return this.preload( 'all' ).then( () => {
			if ( !this.$all || (options&&options.cached === false) ){
				this.$all = this.connector.all( obj, null, options ).then( (res) => {
					this.consume( res );
					
					return this.collection;
				});
			}

			return this.$all;
		});
	}

	// -- insert
	insert( obj, options ){
		return this.preload( 'insert' ).then( () => {
			var t = this.find( obj );

			if ( t ){
				throw new Error(
					'This already exists ' +
					JSON.stringify( obj )
				);
			}else{
				return this.connector.create( obj, obj, options ).then( ( res ) => {
					var proxy = this.set( res ).ref;

					proxy.merge( obj );

					return proxy;
				});
			}
		});
	}

	// -- update
	// delta is optional
	update( from, delta, options ){
		return this.preload( 'update' ).then( () => {
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
				return this.connector.update( from, delta, options )
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
		});
	}

	// -- delete
	delete( obj, options ){
		return this.preload( 'delete' ).then( () => {
			var t = this.find( obj );

			if ( t ){
				return this.connector.delete( this.$encode(obj), null, options )
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

		});
	}

	// -- select
	select( qry, options ){
		return this.preload( 'select' ).then( () => {
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
				).then( (res) => {
					this.consume( res );
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
		});
	}
}

Table.schema = schema;

module.exports = Table;
