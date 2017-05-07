describe('bmoor-cache::Table', function(){

	var Feed = require('bmoor-comm').connect.Feed,
		Proxy = require('bmoor-data').object.Proxy,
		Table = require('./Table.js'),
		httpMock = new (require('bmoor-comm').testing.Requestor)();

	function basicChecks( env, getValue ){
		it('should cache a read request', function( done ){
			env.mock.expect('/test/1234').respond({
				id: 1234,
				foo: 'bar'
			});

			env.table.get(1234).then(function( d ){
				expect( getValue(d).foo ).toBe( 'bar' );
				
				jasmine.clock().tick(50);

				env.table.get({id:1234}).then( function( d ){
					expect( getValue(d).foo ).toBe( 'bar' );
					
					done();
				});
			});
		});

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

			env.mock.expect('/test/all').respond( all );

			env.table.all().then(function( a ){
				expect( getValue(a.data[0]) ).toEqual( all[0] );
				expect( getValue(a.data[1]) ).toEqual( all[1] );
				expect( a.data.length ).toEqual( all.length );

				env.table.all().then(function( b ){
					expect( a ).toEqual( b );

					jasmine.clock().tick(50);

					env.table.get({id:1234}).then( function( d ){
						expect( getValue(d).foo ).toBe( 'bar' );

						done();
					});
				});
			});
		});

		it('should cache a all request, and call read on miss', function( done ){
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

			env.mock.expect('/test/all').respond( all );
			env.mock.expect('/test/1').respond( ein );

			env.table.all().then(function( a ){
				expect( getValue(a.data[0]) ).toEqual( all[0] );
				expect( getValue(a.data[1]) ).toEqual( all[1] );
				expect( a.data.length ).toBe( all.length );

				jasmine.clock().tick(50);

				env.table.get({id:1}).then( function( d ){
					expect( getValue(d) ).toBe( ein );

					done();
				});
			});
		});

		it('should update correctly - 1', function( done ){
			var ein = {
					id: 1,
					foo: 'bar'
				};

			env.mock.expect('/test/1').respond( ein );
			env.mock.expect('/test/update/1').respond( 'OK' );

			env.table.get(1).then(function( a ){
				expect( getValue(a) ).toEqual( ein );
			
				jasmine.clock().tick(50);

				env.table.update(1,{foo:'bar2'}).then( function( d ){
					expect( d ).toBe( 'OK' );
					expect( getValue(a).foo ).toBe( 'bar2' );

					done();
				});
			});
		});

		it('should update correctly - 2', function( done ){
			var ein = {
					id: 1,
					foo: 'bar'
				};

			env.mock.expect('/test/1').respond( ein );
			env.mock.expect('/test/update/1').respond( {foo:3} );
			env.mock.expect('/test/update/1').respond( {foo:30} );

			env.table.get(1).then(function( a ){
				expect( getValue(a) ).toEqual( ein );
			
				jasmine.clock().tick(50);
				
				env.table.update(1,{foo:'bar2'}).then( function( d ){
					expect( d.foo ).toBe( 3 ); // returns back raw
					expect( getValue(a).foo ).toBe( 3 );
				});

				env.table.update(1,{foo:'bar2'},true).then( function( d ){
					expect( d.foo ).toBe( 30 ); // returns back raw
					expect( getValue(a).foo ).toBe( 3 );
					
					done();
				});
			});
		});

		describe('select', function(){
			it ('should work', function( done ){
				env.mock.expect('/test/all').respond([
					{ id: 1, type: 'dog' },
					{ id: 2, type: 'cat' },
					{ id: 3, type: 'dog' },
					{ id: 4, type: 'seal' },
					{ id: 5, type: 'goose' },
					{ id: 6, type: 'dog' }
				]);

				env.table.select({type:'dog'}).then(function( res ){
					expect( res.data.length ).toBe( 3 );

					done();
				});
			});
		});
	}

	describe('basic structure', function(){
		var table,
			env = {
				mock: httpMock
			},
			http = new Feed(
				{
					all: '/test/all',
					read: '/test/{{id}}',
					create: '/test/create',
					update: '/test/update/{{id}}'
				}
			);

		beforeEach(function(){
			env.table = new Table('test',{
				id: 'id',
				connector: http,
				merge: function( to, from ){
					to.foo = from.foo;
				}
			});
			httpMock.enable();
			jasmine.clock().install();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
			jasmine.clock().uninstall();
		});

		basicChecks( env, function( obj ){
			return obj;
		});
	});

	describe('with proxy', function(){
		var table,
			env = {
				mock: httpMock
			},
			http = new Feed(
				{
					all: '/test/all',
					read: '/test/{{id}}',
					create: '/test/create',
					update: '/test/update/{{id}}'
				}
			);

		beforeEach(function(){
			env.table = new Table('test',{
				id: 'id',
				connector: http,
				proxy: Proxy
			});

			httpMock.enable();
			jasmine.clock().install();
		});

		afterEach(function(){
			httpMock.verifyWasFulfilled();
			jasmine.clock().uninstall();
		});

		basicChecks( env, function( proxy ){
			return proxy.getDatum();
		});
	});
});
