bMoor.make( 'bmoor.cache.Collection', 
	[
	function(){
		'use strict';
		
		return {
			parent : Array,
			construct : function( arr ){
				var t = [],
					i, c;

				if ( arr ){
					for( i = 0, c = arr.length; i < c; i++ ){
						t.push( arr[i] );
					}
				}

				t.remove = this.remove;
				t.add = this.add;

				return t;
			},
			properties : {
				remove : function( obj ){
					bMoor.array.remove( this, obj );
				},
				add   : function( obj ){
					this.push( obj );
				}
			}
		};
	}]
);