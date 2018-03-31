module.exports = {
	mockery: {
		Wrapper: require('./src/mockery/Wrapper.js'),
		Schema: require('./src/mockery/Schema.js')
	},
	Schema: require('./src/Schema.js'),
	Table: require('./src/Table.js'),
	Proxy: require('./src/Proxy.js'),
	Collection: require('./src/Collection.js')
};