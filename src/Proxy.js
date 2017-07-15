var P = require('bmoor-data').object.Proxy,
	bmoor = require('bmoor'),
	schema = require('./Schema.js');

// { join: {table:'', field} }
class Proxy extends P {
	constructor( datum, settings ){
		super( datum );

		this.joins = {};
		this.settings = settings;
	}

	join( joinName ){
		var join = this.settings[joinName];

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

module.exports = Proxy;
