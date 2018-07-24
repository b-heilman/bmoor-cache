
const bmoor = require('bmoor'),
	schema = require('./Schema.js'),
	DataProxy = require('bmoor-data').object.Proxy;

var _fakeIds = 1,
	helperMethods = {
		makeId: function(){
			return _fakeIds++;
		}
	};

function buildConnectors( proxy, joins ){
	var uid = proxy.getTable().$id(proxy);

	if ( !proxy.connectors ){
		proxy.connectors = {};
	}

	Object.keys(joins).forEach( tableName => {
		var join = joins[tableName],
			foreignTable = schema.get( tableName );

		if ( join.type === 'child' ){
			let root = proxy.$(join.path);

			proxy.connectors[tableName] = {
				insert: function( datum ){
					if ( root.indexOf(datum) === -1 ){
						root.push(datum);
					}

					if ( join.massage ){
						join.massage(datum, helperMethods);
					}

					datum.$parentId = uid;

					foreignTable.set( datum );
				},
				delete: function( datum ){
					if ( datum instanceof DataProxy ){
						root.splice( root.indexOf(datum.getDatum()), 1 );
					}else{
						root.splice( root.indexOf(datum), 1 );
					}

					foreignTable.del( datum );
				},
				get: function(){
					return foreignTable.collection.filter(
						{ '$parentId': uid },
						{
							hash:'child-'+uid
						}
					);
				}
			};
		}

		if ( join && join.auto ){
			proxy.join(tableName);
		}
	});
}

// { join: {table:'', field} }
class JoinableProxy extends DataProxy {
	constructor( datum, table ){
		super( datum );
		
		this.getTable = function(){ // prevent circular 
			return table;
		};

		this.joins = {};

		buildConnectors(this, table.joins);
	}

	onewayJoin( tableName, searchValue ){
		var foreignTable = schema.get( tableName );

		if ( foreignTable ){
			return bmoor.isArray(searchValue) ?
				foreignTable.getMany( searchValue ) : 
				foreignTable.get( searchValue );
		}else{
			throw new Error(tableName+' is not a known table');
		}
	}

	twowayJoin( tableName, searchValue ){
		var foreignTable = schema.get( tableName );

		if ( foreignTable ){
			let myTable = this.getTable().name,
				foreignJoin = foreignTable.joins[ myTable ];

			if ( foreignJoin ){
				let foreignKey = bmoor.isString(foreignJoin) ? 
					foreignJoin : foreignJoin.path;

				return foreignTable.select( {[foreignKey]: searchValue} );
			}else{
				throw new Error(
					`Can not twoway join to ${tableName}, no back join found`
				);
			}
		}else{
			throw new Error(tableName+' is not a known table');
		}
	}

	childJoin( tableName, children ){
		children.forEach( this.connectors[tableName].insert );

		return this.connectors[tableName].get();
	}
	
	join( tableName ){
		var type,
			path,
			rtn = this.joins[tableName],
			myTable = this.getTable(),
			joins = myTable.joins,
			join = joins[tableName];

		if ( !rtn ){ 
			if ( bmoor.isObject(join) ){
				type = join.type;
				path = join.path;
			}else{
				type = 'oneway';
				path = join;
			}

			rtn = this[type+'Join'](
				tableName,
				this.$(path)
			);

			this.joins[tableName] = rtn;
		}else if ( !join ){
			throw new Error('Missing join to table: '+tableName);
		}

		return Promise.resolve(rtn);
	}

	inflate(){
		var joins = this.getTable().joins,
			keys = Object.keys( joins ),
			req = [];

		Object.keys( joins ).forEach( join => {
			req.push( this.join(join) );
		});

		return Promise.all( req ).then( (res) => {
			var rtn = {};

			keys.forEach(function( key, i ){
				rtn[ key ] = res[i];
			});

			return rtn;
		});
	}
}

module.exports = JoinableProxy;
