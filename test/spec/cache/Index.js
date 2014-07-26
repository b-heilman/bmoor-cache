describe( 'bmoor.cache.Index', function(){
	describe( 'unique indexes', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new bmoor.cache.Index( 'woot', true );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };

			index.insert( v1 );
			index.insert( v2 );
			index.insert( v3 );
		});

		it( 'should only allow one instance', function(){
			expect( index.find(v1).status ).toBe( 1 );
			expect( index.find({woot:'zwei'}).status ).toBe( 2 );
		});
	});

	describe( 'unique complex indexes', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new bmoor.cache.Index( ['woot','status'], true );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };

			index.insert( v1 );
			index.insert( v2 );
			index.insert( v3 );
		});

		it( 'should only allow one instance', function(){
			expect( index.find(v1).status ).toBe( 1 );
			expect( index.find({woot:'zwei',status:2}).status ).toBe( 2 );
		});
	});

	describe( 'complex indexes', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new bmoor.cache.Index( 'woot' );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };

			index.insert( v1 );
			index.insert( v2 );
			index.insert( v3 );
		});

		it( 'should only allow one instance', function(){
			expect( index.find(v1).length ).toBe( 2 );
			expect( index.find({woot:'zwei'})[0].status ).toBe( 2 );
			expect( index.find({woot:'dupe'}).length ).toBe( 0 );
		});
	});

	describe( 'stacked indexes', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new bmoor.cache.Index( ['woot','status'] );
			v1 = { woot : 'eins', status : [1,2,3] };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };

			index.insert( v1 );
			index.insert( v2 );
			index.insert( v3 );
		});

		it( 'should only allow one instance', function(){
			expect( index.find({woot:'eins',status:3}).length ).toBe( 2 );
			expect( index.find({woot:'zwei',status:2}).length ).toBe( 1 );
			expect( index.find({woot:'dupe',status:0}).length ).toBe( 0 );
		});
	});
});