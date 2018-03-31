var Feed = require('bmoor-comm').connect.Feed,
	Table = require('../Table.js'),
	Wrapper = require('./Wrapper.js');

describe('bmoor-cache/mockery::Wrapper', function(){
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
		mockery = new Wrapper( table, {
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
				return 'OK';
			}
		});
	});

	afterEach(function(){
		mockery.disable();
	});

	it('should enable and tear down properly', function(){
		mockery.enable();

		expect( table.connector.all.$settings.intercept ).toBeDefined();

		mockery.disable();

		expect( table.connector.all.$settings.intercept ).toBeUndefined();
	});

	it('should properly overload all request', function( done ){
		mockery.enable();

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
		mockery.enable();

		table.get({id:3}).then(function( res ){
			expect( res.getDatum().foo ).toBe( 'bar3' );

			done();
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex );
		});
	});

	it('should properly overload get-many request', function( done ){
		mockery.enable();

		table.getMany([{id:1},{id:2}]).then(function( res ){
			expect( res.data.length ).toBe( 2 );
			expect( res.data[1].getDatum().foo ).toBe( 'bar2' );

			done();
		}).catch(function( ex ){
			console.log( ex.message );
			console.log( ex.stack );
		});
	});

	it('should properly overload insert request', function( done ){
		mockery.enable();

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
		var called = false;

		mockery.enable();

		testHook = function( obj, args ){
			expect( obj.hello ).toBe( 'world' );
			expect( args.id ).toBe( 2 );
			expect( args.hello ).toBeUndefined();
		};

		table.update( {id:2}, {'hello':'world'}, {
			hook: function( res ){
				called = true;
				expect( res ).toBe( 'OK' );
			}
		})
		.then(function( res ){
			var was = table.find(2);

			expect( res ).toBe( was );

			return table.get( {id:2} ).then(function( gotten ){
				var datum = gotten.getDatum();
				
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
		mockery.enable();

		testHook = function( obj, args ){
			expect( obj ).toEqual( {id:1,foo:'bar'} );
			expect( args ).toEqual( {id:1,foo:'bar'} );
		};

		let was,
			called = false;

		table.delete( {id:1}, {
			hook: function( res ){
				called = true;
				was = table.find(1);

				expect( res ).toBe( 'OK' );
			}
		}).then(function( res ){
			expect( called ).toBe( true );
			expect( was ).toBe( res );

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
