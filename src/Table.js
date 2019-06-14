const bmoor = require('bmoor'),
	schema = require('./table/Schema.js').default,
	Test = require('bmoor-data').object.Test,
	Linker = require('./table/Linker.js').default,
	DataProxy = require('bmoor-data').object.Proxy,
	CacheProxy = require('./object/Proxy.js').default,
	ProxiedCollection = require('bmoor-data').collection.Proxied;

let tempCount = 1;

var defaultSettings = {
		proxyFactory: function( datum ){
			return new CacheProxy( datum );
		},
		collectionFactory: function(src){
			return new ProxiedCollection(src);
		}
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

		this.synthetic = ops.synthetic;
		this.connector = ops.connector;
		
		if ( ops.proxy && !ops.proxyFactory ){
			console.warn('ops.proxy will be deprecated in next major version');
			ops.proxyFactory = function(datum){
				return ops.proxy.factory ?
					ops.proxy.factory(datum) :
					new (ops.proxy)(datum);
			};
		}

		this.proxyFactory = ops.proxyFactory || 
			defaultSettings.proxyFactory;

		this.collectionFactory = ops.collectionFactory || 
			defaultSettings.collectionFactory;

		if ( !ops.id ){
			throw new Error(
				'bmoor-comm::Table requires a id field of function'
			);
		}

		if (ops.links){
			this.linker = new Linker(this, ops.links);
		}

		this.before = ops.before || function(){
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
				}else if (bmoor.isObject(qry) && !bmoor.isArray(qry)){
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

		this.$datum = function(obj){
			if ( obj instanceof DataProxy ){
				obj = obj.getDatum();
			}

			return obj;
		};

		this.$id = (obj) => {
			const datum = this.$datum(obj);

			return datum.$id || parser(datum);
		};

		this._getting = {};

		this.reset();
	}

	reset(){
		// if someone adds directly to the collection, then the data doesn't go through the usual hooks
		this.collection = this.collectionFactory([]);
		this.index = new Map(); // use a local instance, don't us a delayed index from collection
		this._selections = {};
		this._getting = {};
	}

	// no promise routes
	find(dex){
		if (bmoor.isObject(dex)){
			dex = this.$id(dex);
		}

		return this.index.get(dex);
	}

	set(obj, delta){
		const id = this.$id(obj);
			
		let t = this.index.get(id);

		if ( id ){
			if( t ){
				obj = delta || obj;
				this.normalize(obj);

				t.merge(delta || obj);
			}else{
				this.normalize(obj);
				t = this.proxyFactory(obj);

				this.index.set(id, t);
				this.collection.add(t);
			}

			this._getting[id] = null;

			return this.collection.promise()
			.then(() => {
				if (this.linker){
					return this.linker.add(t);
				}else{
					return t;
				}
			});

		}else{
			throw new Error(
				'missing id for object: '+JSON.stringify( obj )
			);
		}
	}

	consume( arr ){
		const rtn = Promise.all(arr.map(d=>this.set(d)));

		// this is very, very greedy, I need to create a local index
		// that's added to real time..  Using a chained index results in
		// a race condition or needed to reprocess the entire thing every
		// time.
		// this.index.go();

		rtn.then(() => this.collection.goHot());
		
		return rtn;
	}

	del( obj ){
		var id = this.$id(obj),
			t = this.index.get(id);

		this.index.delete(id);
		this.collection.remove(t);

		return t;
	}

	// -- get
	get(obj, options){
		const id = this.$id(obj);

		let fetch = null;

		if ( !options ){
			options = {};
		}

		// batch in the number of seconds you wait for another call
		// allow for the default to be batching
		let batch = 'batch' in options ? options.batch :
				( 'batch' in defaultSettings ? defaultSettings.batch : null );

		if (this.synthetic && this.synthetic.get){
			fetch = datum => {
				return this.synthetic.get(datum)
				.then(() => this.collection.promise())
				.then(() => this.find(obj));
			};
		}else if ((batch || batch === 0) && this.connector.readMany){
			fetch = datum => {
				return this.getMany([datum])
				.then(() => {
					return this.find(datum);
				});
			};
		}else{
			fetch = datum => {
				const rtn = this.connector.read(this.$encode(datum), null, options)
				.then(res => {
					if (options.hook){
						options.hook(res);
					}

					return this.set(res);
				});

				this._getting[id] = rtn;

				return rtn;
			};
		}

		return this.before( 'get' ).then( () => {
			const t = this.find(id);
			
			if (!t || (options&&options.cached===false)){
				// this needs to be an active promise
				if (this._getting[id]) {
					return this._getting[id]
					.then(() => {
						return this.find(id);
					});
				}else{
					return fetch(obj);
				}
			}else{
				return t;
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

	setMany(prom, hook){
		if (!prom.then){
			prom = Promise.resolve(prom);
		}

		return prom.then( res => {
			if ( hook ){
				hook( res );
			}

			return Promise.all(res.map(r => this.set(r)));
		});
	}

	/**
	* No cacheing here because I can't programatically figure out what ids are being requested
	**/
	fetch( qry, options ){
		if ( !options ){
			options = {};
		}

		return this.before( 'fetch', qry ).then( () => {
			var rtn;

			if (this.synthetic && this.synthetic.fetch){
				// NOTE : I don't love this...
				rtn = this.synthetic.fetch(qry, options)
				.then(res => this.collection.promise().then(() => res));
			}else{
				rtn = this.connector.query(qry, null, options);
			}

			return this.setMany(rtn, options.hook)
			.then(res => {
				const collection = this.collectionFactory([]);

				res.forEach(( p, i ) => {
					collection.data[i] = p;
				});

				return collection;
			});
		});
	}

	// -- getMany
	getMany(arr, options){
		if ( !options ){
			options = {};
		}

		if (!arr.length){
			const blank = this.collectionFactory([]);

			blank.goHot();

			return Promise.resolve(blank);
		}

		return this.before( 'get-many', arr )
		.then(() => {
			const all = [];
			const req = [];

			// reduce the list using gotten
			arr.forEach( ( r ) => {
				var t = this.$id(r);

				all.push(t);

				if (!this.index.get(t)){
					req.push(t);
				}
			});

			return this._getMany(req, options)
			.then(() => this.collection.promise())
			.then(() => {
				var collection = this.collectionFactory([]);

				all.forEach((id, i) => {
					collection.data[i] = this.index.get(id);
				});

				return collection;
			});
		});
	}

	/**
	* arr => array of ids
	**/
	_getMany(arr, options){
		const loading = [];

		let rtn = null;

		if (arr.length && !this.$getMany) {
			const batch = 'batch' in options ? options.batch :
				('batch' in defaultSettings ? defaultSettings.batch : 0);

			this.$getMany = this.setMany(new Promise((resolve, reject) => {
				setTimeout(() => {
					const thread = this.$getMany;

					this.$getMany = null;

					let prom = null;
					let req = [];
					
					for (let id in this._getting){
						if (this._getting[id] === thread){
							req.push(id);
						}
					}

					if ( req.length ){
						// this works because I can assume id was defined for 
						// the feed
						if (this.synthetic && this.synthetic.getMany){
							const query = this.$encode(req);

							prom = this.synthetic.getMany(query, options);
						} else if (this.connector.readMany){
							const query = this.$encode(req);

							prom = this.connector.readMany(query, null, options);
						} else {
							// The feed doesn't have readMany, so many reads will work
							prom = Promise.all(req.map(id => 
								this.connector.read(this.$encode(id), null, options)
							));
						}
					} else {
						prom = Promise.resolve([]); // nothing to do
					}

					prom.then(resolve, reject);
				}, batch);
			}), options.hook);
		}

		rtn = this.$getMany;

		loading.push(rtn);

		arr.forEach(id => {
			if (id in this._getting){
				// assumed to be either null or a promise
				loading.push(this._getting[id]);
			} else {
				this._getting[id] = rtn;
			}
		});

		return Promise.all(loading);
	}

	
	// -- all
	// all returns back the whole collection.  Allowing obj for dynamic
	// urls
	all( obj, options ){
		if ( !options ){
			options = {};
		}

		return this.before('all').then(() => {
			if (!this.$all || options.cached === false){
				let res;

				if (this.synthetic){
					if (this.synthetic.all){
						res = this.synthetic.all(obj, options);
					}else{
						res = Promise.resolve([]);
					}
				}else{
					res = this.connector.all(obj, null, options);
				}
				
				res.catch(() => {
					this.$all = null;
				});

				this.$all = res.then(res => {
					if ( options.hook ){
						options.hook( res );
					}

					this.consume(res);
					
					return this.collection.promise()
					.then(() => this.collection);
				});
			}

			return this.$all;
		});
	}

	// -- insert
	insert(obj, options = {}){
		return this.before('insert', obj)
		.then(() => {
			let content = this.$datum(obj);
			let temp = null;

			if (obj.$temp){
				temp = obj.$temp;
			}

			var t = this.find(content);

			if (t && !temp){
				throw new Error(
					'This already exists ' + JSON.stringify(obj)
				);
			} else if (this.synthetic && this.synthetic.insert){
				// if it exists, don't do anything
				if ( t ){
					return Promise.resolve(t);
				}else{
					return this.synthetic.insert(content, options)
					.then(() => this.collection.promise())
					.then(() => this.find(obj));
				}
			}else{
				return this.connector.create(content, content, options)
				.then(res => {
					if (options.hook){
						options.hook(res);
					}

					let datum;

					if (!options.ignoreResponse && bmoor.isObject(res)){
						datum = res;
					} else {
						datum = obj;

						if (options.makeId){
							options.makeId(obj, res);
						}
					}

					return datum;
				}).then(datum => {
					return Promise.all([
						this.set(datum)
						.then(proxy => this.collection.promise()
							.then(() => {
								if ( options.useProto ){
									proxy.merge( obj );
								}

								return proxy;
							})
						),
						temp ? this.del(temp) : null
					]).then(res => res[0]);
				});
			}
		});
	}

	// -- update
	// delta is optional
	update(from, delta, options = {}){
		return this.before('update', from, delta)
		.then(() => {
			var proxy;

			if ( from instanceof DataProxy ){
				proxy = from;
				from = from.getDatum();
			}else{
				from = this.$encode(from);
				proxy = this.find(from);
			}

			if (delta === true){
				delta = proxy.getDatum();
			}else if (!delta){
				delta = proxy.getChanges();
			}

			if (this.synthetic && this.synthetic.update){
				return this.synthetic.update(from, delta, options, proxy)
				.then(() => this.collection.promise())
				.then(() => proxy);
			}else{
				if (proxy && delta){
					return this.connector.update(from, delta, options)
					.then(res => {
						return this.collection.promise()
						.then(() => {
							if ( options.hook ){
								options.hook(res, from, delta);
							}

							if ( !options.ignoreResponse && bmoor.isObject(res) ){
								proxy.merge(res);
							}else if ( !options.ignoreDelta ){
								proxy.merge(delta);
							}

							return proxy;
						});
					});
				}else if (proxy){
					return Promise.resolve(proxy);
				}else{
					throw new Error(
						'Can not update that which does not exist' +
						JSON.stringify( from )
					);	
				}
			}
		});
	}

	// -- delete
	delete(obj, options = {}){
		return this.before( 'delete', obj )
		.then( () => {
			var proxy = this.find( obj );

			if ( proxy ){
				let datum = proxy.getDatum();

				if (this.synthetic){
					this.synthetic.delete(obj, datum, options, proxy)
					.then(() => this.collection.promise())
					.then(() => proxy);
				}else{
					return this.connector.delete( datum, datum, options )
					.then(res => {
						return this.collection.promise()
						.then(() => {
							if ( options.hook ){
								options.hook( res );
							}

							this.del( obj );

							return proxy;
						});
					});
				}
			}else{
				throw new Error(
					'Can not delete that which does not exist' +
					JSON.stringify( obj )
				);	
			}
		});
	}

	// -- select
	select(qry, options = {}){
		return this.before( 'select', qry )
		.then( () => {
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
				( options.test || 
					new Test( options.fn || qry, {
						hash: options.hash,
						massage: options.massage || this.$datum
					})
				);
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

				return rtn.then(() => this.collection.promise())
				.then(() => selection.filter);
			}else{
				selections[test.hash] = op = {
					filter: rtn.then(() => this.collection.promise())
					.then(() => {
						const rtn = this.collection.filter(test);
						const disconnect = rtn.disconnect;

						rtn.disconnect = function(){
							op.count--;

							if ( !op.count ){
								selections[test.hash] = null;
								disconnect();
							}
						};

						return rtn;
					}),
					count: 1
				};

				return op.filter;
			}
		});
	}

	push(obj, options = {}){
		const datum = this.$datum(obj);
		const id = this.$id(datum);

		if (id && !datum.$id){
			return this.update(obj, false, options);
		} else {
			return this.insert(obj, options);
		}
	}

	getTemp(base = {}, id = 'temp-'+tempCount++){
		base.$id = id;

		return this.set(base)
		.then(proxy => {
			proxy.$temp = id;

			return proxy;
		});
	}
}

Table.schema = schema;
Table.settings = defaultSettings;

module.exports = Table;
