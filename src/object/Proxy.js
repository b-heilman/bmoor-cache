
const DataProxy = require('bmoor-data').object.Proxy;

// { join: {table:'', field} }
class JoinableProxy extends DataProxy {

	setLinker(linker){
		this.linker = linker;
	}
	
	link( tableName ){
		return this.linker.link(this, tableName);
	}

	inflate(){
		return this.linker.link(this);
	}
}

module.exports = {
	default: JoinableProxy
};
