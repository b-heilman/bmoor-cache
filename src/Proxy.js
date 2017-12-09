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

	join( joinName ){
		var join = this.settings.joins[joinName];

		if ( !this.joins[joinName] && join ){
			let table = schema.check( join.table );

			if ( table ){
				let datum = this.getDatum(),
					target = bmoor.get( datum, join.field );

				this.joins[joinName] = bmoor.isArray(target) ?
					table.getMany( target ) : table.get( target );
			}
		}

		return this.joins[joinName];
	}
}

module.exports = JoinableProxy;
