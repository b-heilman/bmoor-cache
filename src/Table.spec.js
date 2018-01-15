describe('bmoor-cache::Table', function(){

	var Feed = require('bmoor-comm').connect.Feed,
		Proxy = require('bmoor-data').object.Proxy,
		Table = require('./Table.js'),
		httpMock = new (require('bmoor-comm').testing.Requestor)();

	describe('manaul mode', function(){
		var table;

		beforeEach(function(){
			table = new Table('test',{
				id: 'foo.bar',
				proxy: Proxy
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
				}),
				proxy: Proxy
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
				
				table.get({id:1234}).then( function( d ){
					expect( d.getDatum().foo ).toBe( 'bar' );
					
					done();
				}).catch( (ex) => {
					console.log( ex.message );
					console.log( ex );
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
			}).catch( ex => {console.log( ex.message); console.log( ex );} );
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

						return table.insert({hello:'world'}).then(function( d ){
							expect( d.getDatum().foo ).toBe( 'woot' );
							expect( d.getDatum().hello ).toBe( 'world' );
						
							expect( a.data.length ).toBe( 4 );

							done();
						});
					});
				}).catch( (ex) => {
					console.log( ex.fileName, ex.lineNumber );
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
				expect( a.getDatum() ).toEqual( ein );
			
				table.update(1,{foo:'bar2'}).then( function( d ){
					expect( d ).toBe( 'OK' );
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
					expect( d.foo ).toBe( 3 ); // returns back raw
					expect( a.getDatum().foo ).toBe( 3 );

					table.update(1,{foo:'bar3'}).then( function( d ){
						expect( d.foo ).toBe( 30 ); // returns back raw
						expect( a.getDatum().foo ).toBe( 30 );
						
						done();
					});
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
					console.log( ex.fileName, ex.lineNumber );
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
				}),
				proxy: Proxy
			});

			httpMock.enable();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
		});

		it('should allow cache busting', function( done ){
			var first,
				second;

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
				console.log( ex.fileName, ex.lineNumber );
				console.log( ex.message );
				console.log( ex );
			});
		});
	});

	describe('table joining', function(){
		var table,
			table2,
			table3,
			table4;

		beforeEach(function(){
			table = new Table('test1',{
				id: 'id',
				connector: new Feed({
					all: '/test/all',
					read: '/test/{{id}}',
					readMany: '/test?id[]={{id}}',
					create: '/test/create',
					update: '/test/update/{{id}}'
				}),
				joins: {
					'test2': 'value2',
					'test3': 'value3',
					'test4': {
						type: 'twoway',
						field: 'id'
					}
				}
			});

			table2 = new Table('test2',{
				id: 'id',
				connector: new Feed({
					all: '/test2/all',
					read: '/test2/{{id}}',
					readMany: '/test2?id[]={{id}}',
					create: '/test2/create',
					update: '/test2/update/{{id}}'
				})
			});

			table3 = new Table('test3',{
				id: 'id',
				connector: new Feed({
					all: '/test3/all',
					read: '/test3/{{id}}',
					readMany: '/test3?id[]={{id}}',
					create: '/test3/create',
					update: '/test3/update/{{id}}'
				})
			});

			table4 = new Table('test4',{
				id: 'id',
				connector: new Feed({
					query: {
						'foreignId': '/test4/{{foreignId}}'
					}
				}),
				joins: {
					'test1': 'foreignId'
				}
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
				value2: 1,
				value3: [ 2, 3 ]
			});

			httpMock.expect('/test2/1').respond({
				id: 1,
				type: 'test2'
			});

			httpMock.expect('/test3?id[]=2&id[]=3').respond([{
				id: 2,
				type: 'test3'
			},{
				id: 3,
				type: 'test3'
			}]);

			httpMock.expect('/test4/1234').respond([{
				id: 20,
				foreignId: 1234,
				type: 'test4'
			},{
				id: 30,
				foreignId: 1234,
				type: 'test4'
			},{
				id: 40,
				foreignId: 1234,
				type: 'test4'
			}]);
		});

		it('should cache a read request', function( done ){
			table.get(1234).then(function( d ){
				expect( d.getDatum().foo ).toBe( 'bar' );
				
				return Promise.all([
					table.get({id:1234}).then( function( d ){
						expect( d.getDatum().foo ).toBe( 'bar' );
					}),
					d.join('test2').then(function( d ){
						expect( d.getDatum().type ).toBe( 'test2' );
					}),
					d.join('test3').then(function( d ){
						expect( d.data.length ).toBe( 2 );
						expect( d.data[0].getDatum().type ).toBe( 'test3' );
					}),
					d.join('test4').then(function( d ){
						expect( d.data.length ).toBe( 3 );
						expect( d.data[0].getDatum().type ).toBe( 'test4' );
					})
				]).then(function(){
					done();
				});
			}).catch( (ex) => {
				console.log( ex.fileName, ex.lineNumber );
				console.log( ex.message );
				console.log( ex.stack );
			});
		});

		it('should work with inflate', function( done ){
			table.get(1234).then(function( d ){
				expect( d.getDatum().foo ).toBe( 'bar' );
				
				return d.inflate()
				.then(function( res ){
					expect( res['test2'].getDatum().type ).toBe( 'test2' );
					expect( res['test3'].data.length ).toBe( 2 );
					expect( res['test3'].data[0].getDatum().type ).toBe( 'test3' );
					expect( res['test4'].data.length ).toBe( 3 );
					expect( res['test4'].data[0].getDatum().type ).toBe( 'test4' );
				}).then(function(){
					done();
				});
			}).catch( (ex) => {
				console.log( ex.fileName, ex.lineNumber );
				console.log( ex.message );
				console.log( ex );
			});
		});
	});
	
	describe('table normalization', function(){
		var table;

		beforeEach(function(){
			table = new Table('normalize',{
				id: 'id',
				connector: new Feed({
					all: '/test/all'
				}),
				normalize: function( obj ){
					if ( obj.id ){
						obj.id = parseInt(obj.id)
					}

					if ( obj.other ){
						obj.other = parseInt(obj.other);
					}
				}
			});

			httpMock.enable();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
		});

		it('should use the same normalize method from proxy', function( done ){
			httpMock.expect('/test/all').respond([{
				id: 1,
				value: 'v-1',
				other: '1'
			},{
				id: '2',
				value: 'v-2',
				other: 1
			},{
				id: 3,
				value: 'v-3',
				other: '2'
			},{
				id: 4,
				value: 'v-4',
				other: '2'
			}]);

			table.select({other:1})
			.then(function( res ){
				expect( res.data.map(( d ) => d.getDatum().value) )
				.toEqual(['v-1','v-2']);

				table.select({other:2})
				.then(function( res ){
					expect( res.data.map(( d ) => d.getDatum().value) )
					.toEqual(['v-3','v-4']);

					done();
				});
			});
		});
	});
});
