bMoor.make( 'bmoor.cache.IndexTracker',
	[
	function(){
		'use strict';
		
		return {
			construct : function(){
				this.indexes = {};
			},
			properties : {
				register : function( index ){
					var i, c;

					if ( bMoor.isString(index) ){
						if ( this.indexes[index] === undefined ){
							this.indexes[index] = [];
						}
					}else if ( bMoor.isArrayLike(index) ){
						for( i = 0, c = index.length; i < c; i++ ){
							this.register( index[i] );
						}
					}
				},
				mark : function( index, value ){
					var key;

					if ( bMoor.isString(index) ){
						if ( value === undefined || value === true ){ // i can't imagine it wouldn't be 1 if bool
							this.indexes[index] = true;
						}else if ( bMoor.isObject(this.indexes[index]) ){
							this.indexes[index][value] = true;
						}
					}else if ( bMoor.isObject(index) ){
						for( key in index ){ // assume simple object
							this.mark( key, index[key] );
						}
					}
				},
				needs : function( index, value ){
					var key;

					if ( bMoor.isString(index) ){
						return ( this.indexes[index] !== true && !this.indexes[index][value] );
					}else if ( bMoor.isObject(index) ){
						for( key in index ){ // assume simple object
							if ( !this.needs(key,index[key]) ){
								return false;
							}
						}

						return true;
					}
				}
			}
		};
	}]
);