
module.exports = {
	mockery: {
		Wrapper: require('./src/mockery/Wrapper.js'),
		Schema: require('./src/mockery/Schema.js')
	},
	Table: require('./src/Table.js'),
	table: require('./src/table/index.js'),
	object: require('./src/object/index.js'),
	Collection: require('./src/Collection.js')
};
