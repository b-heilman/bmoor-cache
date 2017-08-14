var Feed = require('bmoor-comm').connect.Feed,
	Table = require('./Table.js'),
	Mockery = require('./Mockery.js');

describe('bmoor-cache::Mockery', function(){
	var table,
		mockery,
		testHook;

	beforeEach(function(){
		table = new Table('mock-test',{
			id: 'id',
			connector: new Feed({
				all: '/test/all',
				read: '/test/{{id}}',
				readMany: '/test?id[]={{id}}',
				create: '/test/create',
				update: '/test/update/{{id}}',
				delete: '/test/delete/{{id}}'
			})
		});
		mockery = new Mockery();

		mockery.add( 'mock-test', {
			all: [{
				id: 1,
				foo: 'bar'
			},{
				id: 2,
				foo: 'bar2'
			},{
				id: 3,
				foo: 'bar3'
			}],
			create: function( obj ){
				testHook( obj );
				obj.id = 20;

				return obj;
			},
			update: function( obj, args ){
				testHook( obj, args );
				return 'OK';
			},
			delete: function( obj, args ){
				testHook( obj, args );
				return 'OK'
			}
		});
	});

	afterEach(function(){
		mockery.disable( 'mock-test' );
	});

	it('should enable and tear down properly', function(){
		mockery.enable('mock-test');

		expect( table.connector.all.$settings.intercept ).toBeDefined();

		mockery.disable( 'junk' );

		expect( table.connector.all.$settings.intercept ).toBeDefined();

		mockery.disable( 'junk', 'mock-test' );

		expect( table.connector.all.$settings.intercept ).toBeUndefined();
	});

	it('should properly overload all request', function( done ){
		mockery.enable('mock-test');

		table.all().then(function( res ){
			expect( res.data.length ).toBe( 3 );
			expect( res.data[0].getDatum().foo ).toBe( 'bar' );

			done();
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex.stack );
		});
	});

	it('should properly overload get request', function( done ){
		mockery.enable('mock-test');

		table.get({id:3}).then(function( res ){
			expect( res.getDatum().foo ).toBe( 'bar3' );

			done();
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex );
		});
	});

	it('should properly overload get-many request', function( done ){
		mockery.enable('mock-test');

		table.getMany([{id:1},{id:2}]).then(function( res ){
			expect( res.length ).toBe( 2 );
			expect( res[1].getDatum().foo ).toBe( 'bar2' );

			done();
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex.stack );
		});
	});

	it('should properly overload insert request', function( done ){
		mockery.enable('mock-test');

		testHook = function( obj ){
			expect( obj.foo ).toBe( 'bar20' );
		};

		table.insert( {foo:'bar20'} ).then(function( res ){
			expect( res.getDatum().id ).toBe( 20 );
			expect( res.getDatum().foo ).toBe( 'bar20' );

			table.get( 20 ).then(function( res ){
				expect( res.getDatum().foo ).toBe( 'bar20' );

				done();
			});
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex.stack );
		});
	});

	it('should properly overload update request', function( done ){
		mockery.enable('mock-test');

		testHook = function( obj, args ){
			expect( obj.hello ).toBe( 'world' );
			expect( args.id ).toBe( 2 );
			expect( args.hello ).toBeUndefined();
		};

		table.update( {id:2}, {'hello':'world'} ).then(function( res ){
			expect( res ).toBe( 'OK' );

			return table.get( {id:2} ).then(function( res ){
				var datum = res.getDatum();

				expect( datum.id ).toBe( 2 );
				expect( datum.foo ).toBe( 'bar2' );
				expect( datum.hello ).toBe( 'world' );

				done();
			});
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex.stack );
		});
	});

	it('should properly overload delete request', function( done ){
		mockery.enable('mock-test');

		testHook = function( obj, args ){
			expect( obj ).toBe( null );
			expect( args.id ).toBe( 1 );
		};

		table.delete( {id:1} ).then(function( res ){
			expect( res ).toBe( 'OK' );

			return table.all().then(function( res ){
				
				expect( res.data.length ).toBe( 2 );

				done();
			});
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex.stack );
		});
	});
});
