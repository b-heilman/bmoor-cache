const bmoor = require('bmoor'),
	schema = require('./Schema.js'),
	Test = require('bmoor-data').object.Test,
	DataProxy = require('bmoor-data').object.Proxy,
	DataCollection = require('bmoor-data').Collection;

var defaultSettings = {
		Proxy: DataProxy,
		proxySettings: {},
		Collection: DataCollection
	};

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

		schema.register( name, this );

		this.name = name;
		this.connector = ops.connector;
		
		this.joins = ops.joins || {};
		this.proxyClass = ops.proxy || defaultSettings.Proxy;
		this.proxySettings = ops.proxySettings || defaultSettings.proxySettings;
		this.collectionClass = ops.collection || defaultSettings.Collection;

		if ( !ops.id ){
			throw new Error(
				'bmoor-comm::Table requires a id field of function'
			);
		}

		// If performance matters, use bmoor-data's Proxy
		this.preload = ops.preload || function(){
			return Promise.resolve(true);
		};

		this.normalize = ops.normalize || function(){};

		if ( bmoor.isFunction( id ) ){
			this.$encode = function( qry ){
				if ( qry instanceof DataProxy ){
					return qry.getDatum();
				}else{
					return qry;
				}
			};
			parser = id;
		}else if ( bmoor.isString(id) ){
			this.$encode = function( qry ){
				var t;

				if ( qry instanceof DataProxy ){
					return qry.getDatum();
				}else if ( bmoor.isObject(qry) ){
					return qry;
				}else{
					t = {};
					bmoor.set(t,id,qry);
					return t;
				}
			};
			parser = function( qry ){
				if ( bmoor.isObject(qry) ){
					return bmoor.get(qry,id);
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
			if ( obj instanceof DataProxy ){
				obj = obj.getDatum();
			}

			return obj;
		};

		this.$id = ( obj ) => {
			return parser( this.$datum(obj) );
		};

		if ( ops.partialList ){
			this.gotten = true;
		}

		this.reset();
	}

	reset(){
		this.collection = new (this.collectionClass)();
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
				obj = delta || obj;
				this.normalize( obj );

				t.merge( delta || obj );
			}else{
				this.normalize( obj );
				t = new (this.proxyClass)( obj, this, this.proxySettings );

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
		var fetch;

		if ( !options ){
			options = {};
		}

		if ( options.batch ){
			if ( this.batched ){
				this.batched.list.push( obj ); 
			}else{
				this.batched = {
					list: [ obj ],
					promise: new Promise(( resolve, reject ) => {
						setTimeout( () => {
							var batched = this.batched;

							this.batched = null;

							return this.getMany( batched.list )
							.then( resolve, reject );
						}, options.batch);
					})
				};
			}

			let res = this.batched.promise.then( () => this.find(obj) );
			fetch = () => res;
		}else{
			fetch = () => {
				return this.connector.read( this.$encode(obj), null, options )
					.then( ( res ) => {
						if ( options.hook ){
							options.hook( res );
						}

						return this._set( res ); 
					});
			};
		}

		return this.preload( 'get' ).then( () => {
			var t = this.find( obj );
			
			if ( !t || (options&&options.cached===false) ){
				return fetch( obj );
			}else{
				if ( this.gotten && !this.gotten[this.$id(obj)] ){
					return fetch( obj );
				}else{
					return t;
				}
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
		if ( !options ){
			options = {};
		}

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
					if ( options.hook ){
						options.hook( res );
					}

					res.forEach( ( r ) => {
						this._set( r );
					});
				});
			}else{
				rtn = Promise.resolve( true ); // nothing to do
			}

			return rtn.then( () => {
				var collection = new (this.collectionClass)();

				all.forEach( ( id, i ) => {
					collection.data[i] = this.index.get( id );
				});

				return collection;
			});
		});
	}

	// -- all
	// all returns back the whole collection.  Allowing obj for dynamic
	// urls
	all( obj, options ){
		if ( !options ){
			options = {};
		}

		return this.preload( 'all' ).then( () => {
			if ( !this.$all || options.cached===false ){
				this.$all = this.connector.all( obj, null, options ).then( (res) => {
					if ( options.hook ){
						options.hook( res );
					}

					this.consume( res );
					
					return this.collection;
				});
			}

			return this.$all;
		});
	}

	// -- insert
	insert( obj, options ){
		if ( !options ){
			options = {};
		}

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

					if ( options.hook ){
						options.hook( res );
					}

					proxy.merge( obj );

					return proxy;
				});
			}
		});
	}

	// -- update
	// delta is optional
	update( from, delta, options ){
		if ( !options ){
			options = {};
		}

		return this.preload( 'update' ).then( () => {
			var proxy;

			if ( from instanceof Proxy ){
				proxy = from;
				from = from.getDatum();
			}else{
				from = this.$encode( from );
				proxy = this.find( from );
			}

			if ( !delta ){
				delta = proxy.getChanges();
			}

			if ( proxy ){
				return this.connector.update( from, delta, options )
				.then( ( res ) => {
					if ( !options.ignoreDelta ){
						proxy.merge( delta );
					}

					if ( !options.ignoreResponse && !bmoor.isObject(res) ){
						proxy.merge( res );
					}

					if ( options.hook ){
						options.hook( res );
					}

					return proxy;
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
		if ( !options ){
			options = {};
		}

		return this.preload( 'delete' ).then( () => {
			var proxy = this.find( obj );

			if ( proxy ){
				let datum = proxy.getDatum();

				return this.connector.delete( datum, datum, options )
				.then( ( res ) => {
					this.del( obj );

					if ( options.hook ){
						options.hook( res );
					}

					return proxy;
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
				test,
				selection,
				selections = this._selections;
			
			if ( !options ){
				options = {};
			}

			this.normalize( qry );

			test = options instanceof Test ? options :
				new Test( options.fn || qry, {
					hash: options.hash,
					massage: this.$datum
				});
			selection = selections[test.hash];

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
					if ( options.hook ){
						options.hook(res);
					}

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
				selections[test.hash] = op = {
					filter: rtn.then(() => {
						var res = this.collection.filter( test ),
							disconnect = res.disconnect;

						res.disconnect = function(){
							op.count--;

							if ( !op.count ){
								selections[test.hash] = null;
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
Table.settings = defaultSettings;

module.exports = Table;
