var bmoor = require('bmoor'),
	schema = require('./Schema.js'),
	DataProxy = require('bmoor-data').object.Proxy;

// { join: {table:'', field} }
class JoinableProxy extends DataProxy {
	constructor( datum, settings ){
		super( datum );
		
		if ( this.$normalize ){
			this.$normalize(this);
		}

		this.joins = {};
		this.settings = settings;
	}

	inflate(){
		var keys = Object.keys( this.settings.joins ),
			req = [];

		Object.keys( this.settings.joins ).forEach( (join) => {
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

	join( joinName ){
		var join = this.settings.joins[joinName];

		if ( !bmoor.get(this.joins,joinName)  && join ){
			if ( join.right ){
				this.rightJoin(
					join.table,
					this.$( join.right ),
					join.field,
					joinName
				);
			}else{
				this.leftJoin(
					join.table,
					this.$( join.field ),
					joinName
				);
			}
		}

		return bmoor.get(this.joins,joinName);
	}

	leftJoin( tableName, search, setTo ){
		var table = schema.check( tableName );

		if ( table ){
			let matches = bmoor.isArray(search) ?
				table.getMany( search ) : table.get( search );

			bmoor.set( this.joins, setTo, matches );
		}else{
			throw new Error(tableName+' is not a known table');
		}
	}

	rightJoin( tableName, myId, foreignKey, setTo ){
		var table = schema.check( tableName );

		if ( table ){
			let qry = {[foreignKey]: myId};
			bmoor.set( this.joins, setTo, table.select(qry) );
		}else{
			throw new Error(tableName+' is not a known table');
		}
	}
}

module.exports = JoinableProxy;
