
const DataCollection = require('bmoor-data').collection.Proxied;

var defaultSettings = {};

class Collection extends DataCollection {}

Collection.settings = defaultSettings;

module.exports = Collection;
