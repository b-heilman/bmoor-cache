
const bmoor = require('bmoor');
const DataProxy = require('bmoor-data').object.Proxy;
const Schema = require('./Schema.js').default;

// NOTE: borrowed from bmoor.array.watch, replace when version ready
function watch( arr, insert, remove, preload ){
	if (insert){
		let oldPush = arr.push.bind(arr);
		let oldUnshift = arr.unshift.bind(arr);

		arr.push = function(...args){
			args.forEach(insert);

			oldPush(...args);
		};

		arr.unshift = function(...args){
			args.forEach(insert);

			oldUnshift(...args);
		};

		if(preload){
			arr.forEach(insert);
		}
	}

	if (remove){
		let oldShift = arr.shift.bind(arr);
		let oldPop = arr.pop.bind(arr);
		let oldSplice = arr.splice.bind(arr);

		arr.shift = function(...args){
			remove(oldShift(...args));
		};

		arr.pop = function(...args){
			remove(oldPop(...args));
		};

		arr.splice = function(...args){
			var res = oldSplice(...args);

			res.forEach(remove);

			return res;
		};
	}
}

/*
Object.keys(joins).forEach( tableName => {
	var join = joins[tableName],
		foreignTable = schema.get( tableName );

	if ( join.type === 'child' ){
		let root = proxy.$(join.path);

		proxy.connectors[tableName] = {
			insert: function( datum ){
				if ( root.indexOf(datum) === -1 ){
					root.push(datum);
				}

				if ( join.massage ){
					join.massage(datum, helperMethods);
				}

				datum.$parentId = uid;

				foreignTable.set( datum );
			},
			delete: function( datum ){
				if ( datum instanceof DataProxy ){
					root.splice( root.indexOf(datum.getDatum()), 1 );
				}else{
					root.splice( root.indexOf(datum), 1 );
				}

				foreignTable.del( datum );
			},
			get: function(){
				return foreignTable.collection.filter(
					{ '$parentId': uid },
					{
						hash:'child-'+uid
					}
				);
			}
		};
	}

	if ( join && join.auto ){
		proxy.join(tableName);
	}
});
*/
function stack( old, fn ){
	if (!old){
		return function(datum, onload, name){
			return [fn(datum, onload, name)];
		};
	}else{
		return function(datum, onload, name){
			var rtn = old(datum, onload, name);

			rtn.push(fn(datum, onload, name));

			return rtn;
		};
	}
}

/**
	key: path on the local datum whose value should be used
	sibling: foreign reference table
	target: mount position of the collection on local datum
	type: relationship type [one,many]
	link: link object for more info
**/
function linkFn(key, sibling, target, type, link){
	return {
		add: function(datum, onload, name){
			var ctrl = datum;

			if (name && sibling.name !== name){
				return;
			}

			if (onload && !link.auto){
				return;
			}

			if (datum instanceof DataProxy){
				datum = datum.getDatum();
			}

			// no need to load this if it's already been called
			if (!bmoor.get(ctrl, '$links.'+target)){
				let src = bmoor.get(datum, key),
					rtn = sibling[type === 'many'?'getMany':'get'](src);

				rtn.then(res => {
					bmoor.set(
						ctrl,
						'$links.'+target, 
						res
					);

					return res;
				});

				return rtn;
			}
		}
	};
}

/**
	key: path on the local datum whose value should be used
	child: foreign reference table
	target: mount position on foreign datum to put back reference
	type: relationship type [one,many]
	link: link object for more info
**/
function childFn(key, child, target, type, link){
	return {
		add: function(datum, onload, name){
			var ctrl = datum;

			if (name && target.name !== name){
				return;
			}

			if (onload && !link.auto){
				return;
			}

			if (datum instanceof DataProxy){
				datum = datum.getDatum();
			}

			// link back to the original datum
			let values = bmoor.get(datum, key);

			// push data to child, and link back to origin
			let set = value => {
				if (link.massage){
					value = link.massage(value);
				}
				
				if (link.filter && !link.filter(value)){
					return;
				}

				// TODO: make this insert?
				return child.set(value)
				.then( res => {
					// back reference
					bmoor.set(
						res,
						'$links.'+target, // mount on $links property
						ctrl
					);

					return res;
				});
			};

			let remove = value => {
				if (link.massage){
					value = link.massage(value);
				}
				
				if (link.filter && !link.filter(value)){
					return;
				}

				// TODO : make this delete?
				return child.del(value);
			};
			/*
				I'm pushing to the table's name, shouldn't conflict
				because you can only have one child with the same name
				I'm sure someone will find a way to prove me wrong
			
				QUESTION : Do I really need this?  I might remove later
			*/		
			if (type === 'one') {
				return set(values)
				.then( res => {
					bmoor.set(
						ctrl,
						'$links.'+child.name,
						res
					);

					return res;
				});
			}else{
				var collection = child.collectionFactory();

				watch(
					values,
					function(datum){
						set(datum)
						.then(res => {
							if ( res ){
								collection.add(res);
							}
						});
					},
					function(datum){
						var res = remove(datum);
						
						if ( res ){
							collection.remove(res);
						}
					},
					false
				);

				return Promise.all(values.map(set))
				.then( res => {
					// prune undefined
					collection.consume(res.filter(d => d));
				
					bmoor.set(
						ctrl,
						'$links.'+child.name,
						collection
					);

					return res;
				});
			}
		}
	};
}

/*
links: [{
	type: [child,link] - [one,many]
	table:  // where connecting to
	key: 
	target: //
	massage:
	filter:
	auto:
}]
*/
class Linker {
	constructor(table, links){
		this.table = table;

		if (links){
			links.forEach(link => {
				var [relationship, type] = link.type.split('-');

				if (relationship === 'child'){
					let parent = Schema.get(link.table);

					parent.linker.setChild(
						link.key,
						this.table,
						link.target, 
						type,
						link
					);
				}else{
					this.setLink(
						link.key,
						Schema.get(link.table),
						link.target,
						type,
						link
					);
				}
			});
		}
	}

	setChild(key, child, target, type, link){
		var methods = childFn(key, child, target, type, link);

		this.onAdd = stack(this.onAdd, methods.add);
	}

	setLink(key, sibling, target, type, link){
		var methods = linkFn(key, sibling, target, type, link);

		this.onAdd = stack(this.onAdd, methods.add);
	}

	add(obj){
		if (obj.setLinker){
			obj.setLinker(this);
		}

		if (this.onAdd){
			return Promise.all(this.onAdd(obj, true))
			.then(() => obj);
		}else{
			return Promise.resolve(obj);
		}
	}

	link(obj, name){
		if (this.onAdd){
			return Promise.all(this.onAdd(obj, false, name))
			.then(() => obj.$links);
		}else{
			return Promise.resolve(null);
		}
	}
}

module.exports = {
	default: Linker
};
