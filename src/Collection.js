const bmoor = require('bmoor'), 
	DataCollection = require('bmoor-data').Collection;

var defaultSettings = {};

function configSettings( settings ){
	if ( !settings ){
		settings = {};
	}

	if ( !('massage' in settings) ){
		settings.massage = function( proxy ){
			return proxy.getDatum();
		};
	}

	return settings;
}

class Collection extends DataCollection {
	index( search, settings ){
		if ( !bmoor.isFunction(search) ){
			settings = configSettings( settings );
		}

		return super.index( search, settings );
	}

	route( search, settings ){
		if ( !bmoor.isFunction(search) ){
			settings = configSettings( settings );
		}

		return super.route( search, settings );
	}

	filter( search, settings ){
		if ( !bmoor.isFunction(search) ){
			settings = configSettings( settings );
		}

		return super.filter( search, settings );
	}

	search( settings ){
		settings = configSettings( settings );

		return super.search( settings );
	}
}

Collection.settings = defaultSettings;

module.exports = Collection;
