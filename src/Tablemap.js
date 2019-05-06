
const Table = require('./Table.js');
const {Sitemap} = require('bmoor-comm');

class Tablemap {
	constructor(root){
		this.sitemap = new Sitemap(root);
		this.map = {};
	}

	ingest(config){
		this.sitemap.ingest(config);

		for(let name in this.sitemap.map){
			let feed = this.sitemap.map[name];
			let table = this.map[name];

			if (!table){
				table = new Table(name, {
					connector: feed
				});

				this.map[name] = table;
			}
		}
	}
}

module.exports = {
	Tablemap
};
