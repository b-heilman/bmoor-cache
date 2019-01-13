
const DataProxy = require('bmoor-data').object.Proxy;

// { join: {table:'', field} }
class JoinableProxy extends DataProxy {

	constructor(obj){
		super(obj);

		if (this.inflate){
			this.inflate();
		}
	}

	merge(delta){
		super.merge(delta);

		if (this.inflate){
			this.inflate();
		}
	}

	setLinker(linker){
		this.linker = linker;
	}
	
	link( tableName ){
		return this.linker.link(this, tableName);
	}
}

module.exports = {
	default: JoinableProxy
};
