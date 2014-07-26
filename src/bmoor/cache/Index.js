bMoor.make( 'bmoor.cache.Index', 
	['bmoor.cache.Collection', 
	function( Collection ){
		'use strict';

		var indexU = 0,
			FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
	    	FN_ARG_SPLIT = /,/,
	    	FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
	    	STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	    function annotate(fn) {
	        var $inject,
	            fnText,
	            argDecl;

	        if ( bMoor.isFunction(fn) ) {
	            $inject = [];

	            fnText = fn.toString().replace(STRIP_COMMENTS, '');
	            argDecl = fnText.match(FN_ARGS);
	            bMoor.forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
	                arg.replace(FN_ARG, function(all, underscore, name){
	                    $inject.push(name);
	                });
	            });
	        }else if ( bMoor.isInjectable(fn) ){
	            return fn.slice( 0, -1 );
	        }

	        return $inject;
	    }

	    function objectFilter( filters ){
	    	var fs = filters.slice(0);

	    	return function( obj ){
	    		var t = {},
	    			k,
	    			i, c;

	    		for( i = 0, c = fs.length; i < c; i++ ){
	    			k = fs[ i ];
	    			t[ k ] = obj[ k ];
	    		}

	    		return t;
	    	}
	    }

	    function blowOut( search ){
	    	var t = [{}];

	    	bMoor.each(search, function( value, key ){
	    		var i, c,
	    			j, k,
	    			v,
	    			clone;

	    		if ( bMoor.isArrayLike(value) ){
	    			for( i = 0, c = t.length; i < c; i++ ){
	    				v = t.shift();

	    				for( j = 0, k = value.length; j < k; j++ ){
	    					clone = bMoor.object.mask( v );

	    					clone[ key ] = value[j];

	    					t.push( clone );
	    				}
	    			}
	    		}else{
	    			for( i = 0, c = t.length; i < c; i++ ){
	    				t[ i ][ key ] = value;
	    			}
	    		}
	    	});

	    	return t;
	    }

		return {
			construct : function makeIndex( fields, unique ){
				var t,
					dex,
					func,
					flds;

				if ( bMoor.isInjectable(fields) ){
					flds = annotate( fields ).sort();
					dex = 'func( obj.' + flds.join( ', obj.' ) + ' )';
		            func = fields[ fields.length-1 ];
		            t = new Function( 'obj', 'func', 'return '+dex+';' );
				}else{
					if ( !bMoor.isFunction(fields.join) ){
						fields = [ fields ];
					}

					flds = fields.sort();
					dex = 'obj.'+fields.join('+"-"+obj.');
					this.filter = objectFilter( fields );
					t = new Function( 'obj', 'return '+dex+';' );
				}

				this.filter = objectFilter( flds );
				this.hashIt = function( obj ){
	            	var i, c,
	            		res;

	            	res = blowOut( this.filter(obj) );

	            	for( i = 0, c = res.length; i < c; i++ ){
	            		res[ i ] = t( res[i], func );
	            	}

	                return res;
	            };

				this.uniqueness = indexU++;
				this.fields = flds;
				this.name = flds.join( '-' );
				this.hash = {};

				// load the correct find, insert, and remove algorithms
				if ( unique ){
					this.find = this.findUniqueIndex;
					this.insert = this.insertUniqueIndex;
					this.remove = this.removeUniqueIndex;
				}else{
					this.find = this.findMultiIndex;
					this.insert = this.insertMultiIndex;
					this.remove = this.removeMultiIndex;
				}
			},
			statics : {
				makeName : function( arr ){
					return arr.sort().join( '-' );
				}
			},
			properties : {
				// TODO : this should be a class constant
				register : function( obj, dex ){
					var odex;

					if ( !obj.$dbIndex ){
						obj.$dbIndex = {};
					}

					odex = obj.$dbIndex[ this.uniqueness ];
					obj.$dbIndex[ this.uniqueness ] = dex;

					return odex;
				},
				findUniqueIndex : function( obj ){
					return this.hash[ this.hashIt(obj)[0] ];
				},
				insertUniqueIndex : function( obj ){
					var dex = this.hashIt(obj)[0],
			            odex = this.register( obj, dex );

			        if ( odex !== dex ){
			            if ( !this.hash[dex] ){
			                if ( odex ){
			                    delete this.hash[ odex ];
			                }

			                this.hash[ dex ] = obj;
			            }else{
			                // collision detected
			                return false;
			            }
			        }

			        return odex === undefined;
				},
				removeUniqueIndex : function( obj ){
					var dex = this.hashIt(obj)[0],
			            odex = this.register( obj, dex );

			        if ( odex ){
			            delete this.hash[ odex ];
			        }
				},
				findMultiIndex : function( obj ){
					var dex = this.hashIt( obj )[0],
						group = this.hash[ dex ];

					if ( !group ){ 
						group = this.hash[ dex ] = new Collection(); 
					}

					return group;
				},
				insertMultiIndex : function( obj ){
					var i, c,
						d,
						dex = this.hashIt( obj ),
						odex = this.register( obj, dex ),
						group;

					if ( odex ){
						for( i = 0, c = odex.length; i < c; i++ ){
							this.hash[ odex[i] ].remove( obj );
						}
					}

					for( i = 0, c = dex.length; i < c; i++ ){
						d = dex[ i ];
						group = this.hash[ d ];

						if ( !group ){ 
							group = this.hash[ d ] = new Collection(); 
						}

						group.add( obj );
					}

					return odex === undefined;
				},
				removeMultiIndex : function( obj ){
					var group = this.hash[ this.hashIt(obj)[0] ];

					if ( group ){
						group.remove( obj );
					}
				}
			}
		};
	}]
);