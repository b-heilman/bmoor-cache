describe('bmoor.cache.Table', function(){
	var primary,
		table;

	beforeEach(function(){
		primary = {id : 1, name : 'one', group : 'one', status : 'open'};
		table = new bmoor.cache.Table({
			key : 'id',
			indexs : {
				'findOne' : 'group',
				'findTwo' : ['group','status']
			}
		});

		table.set( primary );
		table.set( {id : 2, name : 'two', group : 'two', status : 'open'} );
		table.set( {id : 3, name : 'three', group : 'two', status : 'closed'} );
		table.set( {id : 3, name : 'four', group : ['two','three'], status : 'closed'} );
	});

	it( 'should allow you to search through primary indexs', function(){
		expect( table.find(1) ).toBe( primary );
	});

	it( 'should allow you to search through single indexs', function(){
		expect( table.findOne('two').length ).toBe( 3 );
	});
	
	it( 'should allow you to search through multi indexs', function(){
		expect( table.findTwo('two','closed').length ).toBe( 2 );
	});
});