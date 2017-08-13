var Feed = require('bmoor-comm').connect.Feed,
	Table = require('./Table.js'),
	Mockery = require('./Mockery.js');

describe('bmoor-cache::Mockery', function(){
	var table,
		mockery;

	beforeEach(function(){
		table = new Table('mock-test',{
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
			}]
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

	it('should properly overload all request', function(){
		mockery.enable('mock-test');

		table.all().then(function( res ){
			expect( res.data.length ).toBe( 3 );
			expect( res.data[0].getDatum().foo ).toBe( 'bar' );
		});
	});

	it('should properly overload get request', function(){
		mockery.enable('mock-test');

		table.get({id:3}).then(function( res ){
			expect( res.getDatum().foo ).toBe( 'bar3' );
		});
	});

	it('should properly overload get-many request', function(){
		mockery.enable('mock-test');

		table.getMany([{id:1},{id:2}]).then(function( res ){
			expect( res.data.length ).toBe( 2 );
			expect( res.data[1].getDatum().foo ).toBe( 'bar2' );
		});
	});
});