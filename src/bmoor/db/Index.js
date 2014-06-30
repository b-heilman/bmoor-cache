bMoor.make( 'bmoor.db.Index', [function(){
	'use strict';
	var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

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

    var indexU = 0;
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

	            this.hashIt = function( obj ){
	                return t( obj, func );
	            };
			}else{
				if ( !bMoor.isFunction(fields.join) ){
					fields = [ fields ];
				}

				flds = fields.sort();
				dex = 'obj.'+fields.join('+"-"+obj.');
				this.hashIt = Function( 'obj', 'return '+dex+';' );
			}

			this.uniqueness = indexU++;
			this.fields = flds;
			this.name = flds.join( '-' );
			this.hash = {};

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
				return this.hash[ this.hashIt(obj) ];
			},
			insertUniqueIndex : function( obj ){
				var dex = this.hashIt(obj),
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
				var dex = this.hashIt(obj),
		            odex = this.register( obj, dex );

		        if ( odex ){
		            delete this.hash[ odex ];
		        }
			},
			findMultiIndex : function( obj ){
				var dex = this.hashIt( obj ),
					group = this.hash[ dex ];

				if ( !group ){ 
					group = this.hash[ dex ] = new bmoor.db.Collection(); 
				}

				return group;
			},
			insertMultiIndex : function( obj ){
				var dex = this.hashIt( obj ),
					odex = this.register( obj, dex ), 
					group = this.hash[ dex ]; 

				if ( odex !== dex ){
					if ( !group ){ 
						group = this.hash[ dex ] = new bmoor.db.Collection(); 
					}

					if ( odex ){
						this.hash[ odex ].remove( obj );
					}

					group.add( obj );
				}

				return odex === undefined;
			},
			removeMultiIndex : function( obj ){
				var group = this.hash[ this.hashIt(obj) ];

				if ( group ){
					group.remove( obj );
				}
			}
		}
	};
}]);