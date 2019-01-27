describe('bmoor-cache::Table', function(){

	var Feed = require('bmoor-comm').connect.Feed,
		Table = require('./Table.js'),
		httpMock = new (require('bmoor-comm').testing.Requestor)(),
		CacheProxy = require('./object/Proxy.js').default,
		CacheCollection = require('./Collection.js');

	describe('manual mode', function(){
		var table;

		beforeEach(function(){
			table = new Table('test',{
				id: 'foo.bar'
			});
		});

		it('should allow adding a complex object', function(){
			var t = {
					foo: {
						bar: 1
					},
					yay: 'ok'
				};

			table.set( t );

			expect( table.find( 1 ).getDatum() ).toBe( t );
			expect( table.name ).toBe('test');
		});
	});

	describe('simple requests', function(){
		var table;

		beforeEach(function(){
			table = new Table('test',{
				id: 'id',
				connector: new Feed({
					all: '/test/all',
					read: '/test/{{id}}',
					readMany: '/test?id[]={{id}}',
					create: '/test/create',
					update: '/test/update/{{id}}'
				})
			});

			httpMock.enable();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
		});

		it('should cache a read request', function( done ){
			httpMock.expect('/test/1234').respond({
				id: 1234,
				foo: 'bar'
			});

			table.get(1234).then(function( d ){
				expect( d.getDatum().foo ).toBe( 'bar' );
				
				return table.get({id:1234}).then( function( d ){
					expect( d.getDatum().foo ).toBe( 'bar' );
					
					done();
				});
			}).catch( (ex) => {
				console.log( ex.message );
				console.log( ex );
			});
		});

		it('should cache a read request', function( done ){
			httpMock.expect('/test?id[]=1&id[]=2').respond([
				{ id: 1 },
				{ id: 2 }
			]);

			table.getMany([1,2]).then(function( d ){
				expect( d.data.length ).toBe( 2 );
				expect( d.data[0].getDatum().id ).toBe( 1 );
				expect( d.data[1].getDatum().id ).toBe( 2 );

				table.getMany([1,2]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					done();
				});
			});
		});

		it('should batch parallel requests - same values', function( done ){
			httpMock.expect('/test?id[]=1&id[]=2').respond([
				{ id: 1 },
				{ id: 2 }
			]);

			Promise.all([
				table.getMany([1,2]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					expect( d.data[0].getDatum().id ).toBe( 1 );
					expect( d.data[1].getDatum().id ).toBe( 2 );
				}),
				table.getMany([1,2]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					expect( d.data[0].getDatum().id ).toBe( 1 );
					expect( d.data[1].getDatum().id ).toBe( 2 );
				}),
			]).then(done, done);
		});

		it('should batch parallel requests - different values', function( done ){
			httpMock.expect('/test?id[]=1&id[]=2&id[]=3&id[]=4').respond([
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 }
			]);

			Promise.all([
				table.getMany([1,2]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					expect( d.data[0].getDatum().id ).toBe( 1 );
					expect( d.data[1].getDatum().id ).toBe( 2 );
				}),
				table.getMany([3,4]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					expect( d.data[0].getDatum().id ).toBe( 3 );
					expect( d.data[1].getDatum().id ).toBe( 4 );
				}),
			]).then(done, done);
		});

		it('should batch parallel requests - different values with gets', function( done ){
			httpMock.expect('/test?id[]=1&id[]=2&id[]=3&id[]=4&id[]=5').respond([
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 },
				{ id: 5 }
			]);

			Promise.all([
				table.get(5, {batch:1}).then(res => {
					expect( res.getDatum().id ).toBe( 5 );
				}),
				table.get(2, {batch:1}).then(res => {
					expect( res.getDatum().id ).toBe( 2 );
				}),
				table.get(3, {batch:1}).then(res => {
					expect( res.getDatum().id ).toBe( 3 );
				}),
				table.getMany([1,2]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					expect( d.data[0].getDatum().id ).toBe( 1 );
					expect( d.data[1].getDatum().id ).toBe( 2 );
				}),
				table.getMany([3,4]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					expect( d.data[0].getDatum().id ).toBe( 3 );
					expect( d.data[1].getDatum().id ).toBe( 4 );
				}),
			]).then(done, done);
		});

		it('should cache a read request - with objects', function( done ){
			httpMock.expect('/test?id[]=1&id[]=2').respond([
				{ id: 1 },
				{ id: 2 }
			]);

			table.getMany([{id:1},{id:2}]).then(function( d ){
				expect( d.data.length ).toBe( 2 );
				expect( d.data[0].getDatum().id ).toBe( 1 );
				expect( d.data[1].getDatum().id ).toBe( 2 );

				table.getMany([1,2]).then(function( d ){
					expect( d.data.length ).toBe( 2 );
					done();
				});
			});
		});

		it('should allow a read to batch to many', function( done ){
			httpMock.expect('/test?id[]=10&id[]=20').respond([
				{ id: 10 },
				{ id: 20 }
			]);

			Promise.all([
				table.get({id:10},{batch:0}),
				table.get({id:20},{batch:0})
			]).then(function( d ){
				expect( d[0].getDatum().id ).toBe( 10 );
				expect( d[1].getDatum().id ).toBe( 20 );

				done();
			}).catch( ex => {
				console.log('exception ->', ex.message);
				console.log( ex );
			});
		});
		
		describe('all requests', function(){
			it('should cache a all request, and not need a matching read', function( done ){
				var all = [
					{
						id: 1234,
						foo: 'bar'
					},
					{
						id: 1235,
						foo: 'bar2'
					}
				];

				httpMock.expect('/test/all').respond( all );

				table.all().then(function( a ){
					expect( a.data[0].getDatum() ).toEqual( all[0] );
					expect( a.data[1].getDatum() ).toEqual( all[1] );
					expect( a.data.length ).toEqual( all.length );

					table.all().then(function( b ){
						expect( a ).toEqual( b );

						table.get({id:1234}).then( function( d ){
							expect( d.getDatum().foo ).toBe( 'bar' );

							done();
						});
					});
				});
			});

			it('should allow for a cache bust call of an all request', function( done ){
				var all = [
						{
							id: 1234,
							foo: 'bar'
						},
						{
							id: 1235,
							foo: 'bar2'
						}
					],
					all2 = [
						{
							id: 1234,
							foo: 'bar'
						},
						{
							id: 1235,
							foo: 'bar2'
						},
						{
							id: 1236,
							foo: 'bar3'
						}
					];

				httpMock.expect('/test/all').respond( all );
				httpMock.expect('/test/all').respond( all2 );

				table.all().then(function( a ){
					expect( a.data[0].getDatum() ).toEqual( all[0] );
					expect( a.data[1].getDatum() ).toEqual( all[1] );
					expect( a.data.length ).toEqual( 2 );

					table.all( null, {cached:false} ).then(function( b ){
						expect( b.data[0].getDatum() ).toEqual( all[0] );
						expect( b.data[1].getDatum() ).toEqual( all[1] );
						expect( b.data[2].getDatum() ).toEqual( all2[2] );
						expect( b.data.length ).toEqual( 3 );

						done();
					});
				});
			});
		
			it('should cache and call read on miss', function( done ){
				var all = [
						{
							id: 1234,
							foo: 'bar'
						},
						{
							id: 1235,
							foo: 'bar2'
						}
					],
					ein = {
						id: 1,
						foo: 'barier'
					};

				httpMock.expect('/test/all').respond( all );
				httpMock.expect('/test/1').respond( ein );
				httpMock.expect('/test/create').respond({
					id: 3,
					foo: 'woot'
				});

				table.all().then(function( a ){
					expect( a.data[0].getDatum() ).toEqual( all[0] );
					expect( a.data[1].getDatum() ).toEqual( all[1] );
					expect( a.data.length ).toBe( 2 );

					return table.get({id:1}).then( function( d ){
						expect( d.getDatum() ).toBe( ein );
						expect( a.data.length ).toBe( 3 );

						return table.insert({hello:'world'}, {useProto:true})
						.then(function( d ){
							expect( d.getDatum().foo ).toBe( 'woot' );
							expect( d.getDatum().hello ).toBe( 'world' );
						
							expect( a.data.length ).toBe( 4 );

							done();
						});
					});
				}).catch( (ex) => {
					console.log( ex.message );
					console.log( ex );
				});
			});
		});

		it('should update correctly - 1', function( done ){
			var ein = {
					id: 1,
					foo: 'bar'
				};

			httpMock.expect('/test/1').respond( ein );
			httpMock.expect('/test/update/1').respond( 'OK' );

			table.get(1).then(function( a ){
				var called = false;

				expect( a.getDatum() ).toEqual( ein );
			
				table.update(1,{foo:'bar2'}, {hook:function( res ){
					called = true;
					expect( res ).toBe( 'OK' );
				}})
				.then( function( d ){
					expect( called ).toBe( true );
					expect( a ).toBe( d );
					expect( a.getDatum().foo ).toBe( 'bar2' );

					done();
				});
			});
		});

		it('should update correctly - 2', function( done ){
			var ein = {
					id: 1,
					foo: 'bar'
				};

			httpMock.expect('/test/1').respond( ein );
			httpMock.expect('/test/update/1').respond( {foo:3} );
			httpMock.expect('/test/update/1').respond( {foo:30} );

			table.get(1).then(function( a ){
				expect( a.getDatum() ).toEqual( ein );
			
				table.update(1,{foo:'bar2'}).then( function( d ){
					expect( d ).toBe( a ); // returns back raw
					expect( a.getDatum().foo ).toBe( 3 );

					table.update(1,{foo:'bar3'}).then( function( d ){
						expect( d ).toBe( a ); // returns back raw
						expect( a.getDatum().foo ).toBe( 30 );
						
						done();
					});
				});
			});
		});

		describe('::insert', function(){
			it('should only use the returned object', function( done ){
				httpMock.expect('/test/create').respond({
					id: 3,
					foo: 'woot'
				});

				table.insert({hello:'world'})
				.then(function( d ){
					expect( d.$('foo') ).toBe( 'woot' );
					expect( d.$('hello') ).toBeUndefined();
				
					done();
				});
			});
		});

		describe('select', function(){
			it ('should work', function( done ){
				httpMock.expect('/test/all').respond([
					{ id: 1, type: 'dog' },
					{ id: 2, type: 'cat' },
					{ id: 3, type: 'dog' },
					{ id: 4, type: 'seal' },
					{ id: 5, type: 'goose' },
					{ id: 6, type: 'dog' }
				]);

				table.select({type:'dog'}).then(function( res ){
					expect( res.data.length ).toBe( 3 );

					done();
				});
			});

			it('should cache selectes', function( done ){
				var first,
					second;

				httpMock.expect('/test/all').respond([
					{ id: 1, type: 'dog' },
					{ id: 2, type: 'cat' },
					{ id: 3, type: 'dog' },
					{ id: 4, type: 'seal' },
					{ id: 5, type: 'goose' },
					{ id: 6, type: 'dog' }
				]);

				table.select({type:'dog'}).then(function( res ){
					expect( res.data.length ).toBe( 3 );
					first = res;
				});

				table.select({type:'dog'}).then(function( res ){
					expect( res.data.length ).toBe( 3 );

					second = res;
					expect( first ).toBe( second );

					first.disconnect();
					second.disconnect();

					table.select({type:'dog'}).then(function( res ){
						expect( second ).not.toBe( res );
						done();
					});
				});
			});

			it('should allow cache busting selectes', function( done ){
				httpMock.expect('/test/all').respond([
					{ id: 1, type: 'dog' },
					{ id: 2, type: 'cat' },
					{ id: 3, type: 'dog' },
					{ id: 4, type: 'seal' },
					{ id: 5, type: 'goose' },
					{ id: 6, type: 'dog' }
				]);

				httpMock.expect('/test/all').respond([
					{ id: 1, type: 'dog' },
					{ id: 2, type: 'cat' },
					{ id: 3, type: 'dog' },
					{ id: 4, type: 'seal' },
					{ id: 5, type: 'goose' },
					{ id: 6, type: 'dog' },
					{ id: 7, type: 'dog' }
				]);

				table.select({type:'dog'}).then(function( res ){
					expect( res.data.length ).toBe( 3 );

					return table.select({type:'dog'},{cached:false}).then(function( res ){
						expect( res.data.length ).toBe( 4 );

						done();
					});
				}).catch( (ex) => { 
					console.log( ex.message );
					console.log( ex );
				});
			});
		});
	});

	describe('table select', function(){
		var table;

		beforeEach(function(){
			table = new Table('test',{
				id: 'id',
				connector: new Feed({
					search: '/test/{{type}}'
				})
			});

			httpMock.enable();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
		});

		it('should allow cache busting', function( done ){
			httpMock.expect('/test/dog').respond([
				{ id: 1, type: 'dog' },
				{ id: 3, type: 'dog' },
				{ id: 6, type: 'dog' }
			]);

			httpMock.expect('/test/dog').respond([
				{ id: 1, type: 'dog' },
				{ id: 3, type: 'dog' },
				{ id: 6, type: 'dog' },
				{ id: 7, type: 'dog' }
			]);

			table.select({type:'dog'}).then(function( res ){
				expect( res.data.length ).toBe( 3 );

				return table.select({type:'dog'},{cached:false}).then(function( res ){
					expect( res.data.length ).toBe( 4 );

					done();
				});
			}).catch( (ex) => {
				console.log( ex.message );
				console.log( ex );
			});
		});
	});

	describe('::linker', function(){
		var table1,
			table2;

		describe('child-one', function(){
			beforeEach(function(){
				table1 = new Table('test1',{
					id: 'id'
				});
				table2 = new Table('test2',{
					id: 'foo',
					links: [{
						type: 'child-one', 
						table: 'test1',
						key: 'link',
						target: 'backref',
						auto: true
					}]
				});
				
				table1.set({
					id: 'ok',
					hello: 1,
					link: {
						foo: 'bar'
					}
				});

				table1.set({
					id: 'ok2',
					hello: 1,
					link: {
						foo: 'bar2'
					}
				});
			});

			it('should automatically populate child table', function(done){
				// data can be in second collection, but isn't linked yet
				expect( table1.collection.data.length )
				.toBe( 2 );

				expect( table2.collection.data.length )
				.toBe( 2 );

				expect( table1.collection.data[0].$links )
				.toBeUndefined();

				expect( table2.collection.data[0].$links )
				.toBeUndefined();

				table1.collection.data[0].link('test2')
				.then(() => {
					expect( table1.collection.data[0].$links.test2 )
					.toBeDefined();

					expect( table2.collection.data[0].$links.backref )
					.toBeDefined();

					done();
				});
			});
		});

		describe('child-many', function(){
			beforeEach(function(){
				table1 = new Table('test1',{
					id: 'id',
					connector: new Feed({
						update: '/test/update/{{id}}'
					})
				});
				table2 = new Table('test2',{
					id: 'foo',
					links: [{
						type: 'child-many', 
						table: 'test1',
						key: 'links',
						target: 'backref',
						auto: true
					}],
					synthetic: {
						insert: function( datum ){
							var base = table1.find(datum.backRef),
								links = base.$('links');

							links.push(datum);

							return table1.update(base,{
								links: links
							});
						}
					}
				});
				
				table1.set({
					id: 'ok',
					hello: 1,
					links: [{
						foo: 'bar'
					}]
				});

				table1.set({
					id: 'ok2',
					hello: 1,
					links: [{
						foo: 'bar2'
					},{
						foo: 'bar3'
					}]
				});
			});

			it('should automatically populate child table', function(done){
				// data can be in second collection, but isn't linked yet
				expect( table1.collection.data.length )
				.toBe( 2 );
				
				expect( table2.collection.data.length )
				.toBe( 3 );

				expect( table1.collection.data[0].$links )
				.toBeUndefined();

				expect( table2.collection.data[0].$links )
				.toBeUndefined();

				table1.collection.data[0].link('test2')
				.then(links => {
					expect(links).toBeDefined();
					
					expect( table1.collection.data[0].$links.test2 )
					.toBeDefined();

					expect( table2.collection.data[0].$links.backref )
					.toBeDefined();

					done();
				}).catch(ex => {
					console.log(ex.message);
					console.log(ex);
				});
			});

			it('should bind directly to the array', function(){
				expect( table1.collection.data.length )
				.toBe( 2 );

				expect( table2.collection.data.length )
				.toBe( 3 );

				table1.collection.data[0].getDatum().links.push({
					foo: 'bar1.1'
				});

				expect( table2.collection.data.length )
				.toBe( 4 );

				table1.collection.data[0].getDatum().links.shift();

				expect( table2.collection.data.length )
				.toBe( 3 );
			});

			describe('synthetic', function(){
				beforeEach(function(){
					httpMock.enable();
				});

				afterEach(function(){
					httpMock.verifyWasFulfilled();
				});

				it('should call update on parent', function(done){
					httpMock.expect('/test/update/ok').respond( null );

					table2.insert({backRef:'ok', foo: 'bar4'})
					.then( () => {
						expect( table2.collection.data.length )
						.toBe( 4 );

						done();
					});
				});
			});
		});
	
		describe('link-one', function(){
			var table,
				table2;

			beforeEach(function(){

				table2 = new Table('test2',{
					id: 'id',
					proxyFactory: function( datum, parent ){
						return new CacheProxy( datum, parent );
					},
					connector: new Feed({
						all: '/test2/all',
						read: '/test2/{{id}}',
						readMany: '/test2?id[]={{id}}',
						create: '/test2/create',
						update: '/test2/update/{{id}}'
					})
				});

				table = new Table('test1',{
					id: 'id',
					connector: new Feed({
						all: '/test/all',
						read: '/test/{{id}}',
						readMany: '/test?id[]={{id}}',
						create: '/test/create',
						update: '/test/update/{{id}}'
					}),
					links: [{
						type: 'link-one',
						table: 'test2',
						key: 'link',
						target: 'test2'
					}]
				});

				httpMock.enable();
			});

			afterEach(function(){
				httpMock.verifyWasFulfilled();
			});

			beforeEach(function(){
				httpMock.expect('/test/1234').respond({
					id: 1234,
					foo: 'bar',
					link: 1
				});

				httpMock.expect('/test2/1').respond({
					id: 1,
					type: 'test2'
				});
			});

			it('should link correctly', function( done ){
				table.get(1234).then(function( d ){
					expect( d.getDatum().foo ).toBe( 'bar' );

					expect( d.$links ).toBeUndefined();
					
					return d.link('test2')
					.then(function(links){
						expect(links).toBe(d.$links);

						expect(links.test2.$('type'))
						.toBe('test2');
						
						done();
					});
				}).catch( (ex) => {
					console.log( ex.message );
					console.log( ex );
				});
			});

			it('should work with link with no parameters', function( done ){
				table.get(1234).then(function( d ){
					expect(d.getDatum().foo).toBe( 'bar' );

					expect(d.$links).toBeUndefined();
					
					return d.link()
					.then(function(links){
						expect(links).toBe(d.$links);

						expect(links.test2.$('type'))
						.toBe('test2');
						
						done();
					});
				}).catch( (ex) => {
					console.log( ex.message );
					console.log( ex );
				});
			});
		});

		describe('link-many', function(){
			var table,
				table2;

			beforeEach(function(){

				table2 = new Table('test2',{
					id: 'id',
					proxyFactory: function( datum, parent ){
						return new CacheProxy( datum, parent );
					},
					connector: new Feed({
						all: '/test2/all',
						read: '/test2/{{id}}',
						readMany: '/test2?id[]={{id}}',
						create: '/test2/create',
						update: '/test2/update/{{id}}'
					})
				});

				table = new Table('test1',{
					id: 'id',
					connector: new Feed({
						all: '/test/all',
						read: '/test/{{id}}',
						readMany: '/test?id[]={{id}}',
						create: '/test/create',
						update: '/test/update/{{id}}'
					}),
					links: [{
						type: 'link-many',
						table: 'test2',
						key: 'link',
						target: 'test2'
					}]
				});

				httpMock.enable();
			});

			afterEach(function(){
				httpMock.verifyWasFulfilled();
			});

			beforeEach(function(){
				httpMock.expect('/test/1234').respond({
					id: 1234,
					foo: 'bar',
					link: [2,3]
				});

				httpMock.expect('/test2?id[]=2&id[]=3').respond([{
					id: 2,
					type: 'test2-2'
				},{
					id: 3,
					type: 'test2-3'
				}]);
			});

			it('should link correctly', function( done ){
				table.get(1234).then(function( d ){
					expect(d.getDatum().foo).toBe( 'bar' );
					expect(d.$links).toBeUndefined();
					
					return d.link('test2')
					.then(function(links){
						expect(links).toBe(d.$links);

						expect(links.test2.data[0].$('type'))
						.toBe('test2-2');
						
						done();
					});
				}).catch( (ex) => {
					console.log( ex.message );
					console.log( ex );
				});
			});

			it('should work with link without parameters', function( done ){
				table.get(1234).then(function( d ){
					expect( d.getDatum().foo ).toBe( 'bar' );
					expect( d.test2 ).toBeUndefined();
					
					return d.link()
					.then(function(links){
						expect(links).toBe(d.$links);

						expect(links.test2.data[0].$('type'))
						.toBe('test2-2');
						
						done();
					});
				}).catch( (ex) => {
					console.log( ex.message );
					console.log( ex );
				});
			});
		});
	});
	
	describe('CacheCollection', function(){
		var table;

		beforeEach(function(){
			table = new Table('test1',{
				id: 'id',
				collectionFactory: function(){
					return new CacheCollection();
				},
				connector: new Feed({
					all: '/test/all'
				})
			});

			httpMock.enable();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
		});

		it('should ',function( done ){
			httpMock.expect('/test/all').respond([{
				id: 1234,
				foo: 'bar',
				value2: 1,
				value3: [ 2, 3 ]
			}]);

			table.all().then(function( res ){
				expect( res instanceof CacheCollection ).toBe( true );

				done();
			});
		});

		it('should generate collections of the same type', function( done ){
			httpMock.expect('/test/all').respond([{
					id: 1,
					foo: 'eins',
					other: true
				},{
					id: 2,
					foo: 'zwei',
					other: false,
				},{
					id: 4,
					foo: 'drei',
					other: true
				},{
					id: 5,
					foo: 'fier',
					other: false
				},{
					id: 3,
					foo: 'drei',
					other: true
				}
			]);

			table.all().then(function( res ){
				var t = res.sorted( (a,b) => {
					return b.id - a.id;
				}).filter({other:true});

				expect( t.data.length ).toBe( 3 );
				expect( t instanceof CacheCollection ).toBe( true );
			
				done();
			}).catch( (ex) => {
				console.log( ex.message );
				console.log( ex );
			});
		});
	});

	// NOTE : normalization is to be done by a proxy class
});
