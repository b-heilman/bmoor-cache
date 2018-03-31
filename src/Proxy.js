var bmoor = require('bmoor'),
	schema = require('./Schema.js'),
	DataProxy = require('bmoor-data').object.Proxy;

// { join: {table:'', field} }
class JoinableProxy extends DataProxy {
	constructor( datum, table ){
		super( datum );
		
		this.getTable = function(){ // prevent circular 
			return table;
		};

		this.joins = {};
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
					foreignJoin : foreignJoin.field;

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
	
	join( tableName ){
		var type,
			field,
			rtn = this.joins[tableName],
			myTable = this.getTable(),
			joins = myTable.joins,
			join = joins[tableName];

		if ( !rtn ){ 
			if ( bmoor.isObject(join) ){
				type = join.type;
				field = join.field;
			}else{
				type = 'oneway';
				field = join;
			}

			rtn = this[type+'Join'](
				tableName,
				this.$( field )
			);

			this.joins[tableName] = rtn;
		}else if ( !join ){
			throw new Error('Missing join to table: '+tableName);
		}

		return rtn;
	}

	inflate(){
		var joins = this.getTable().joins,
			keys = Object.keys( joins ),
			req = [];

		Object.keys( joins ).forEach( (join) => {
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
