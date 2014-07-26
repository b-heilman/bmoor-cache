bMoor.make( 'bmoor.cache.Table',
	['bmoor.cache.Collection','bmoor.cache.IndexTracker','bmoor.cache.Index',
	function( Collection, IndexTracker, Index ){
		'use strict';
		
		function createFind( obj, funcName, vars, index ){
			if ( bMoor.isString(vars) ){
				vars = [ vars ];
			}

			obj[ funcName ] = function(){
	            var i, c,
	                s = {};

	            if ( bMoor.isObject(arguments[0]) ){
	                s = arguments[0];
	            }else{
	                for( i = 0, c = vars.length; i < c; i++ ){
	                    s[ vars[i] ] = arguments[i];
	                }
	            }

	            return index.find( s );
	        };
		}

		return {
			construct : function Table( settings ){
				var key,
					index;

				this.model = settings.model || function( obj ){ return obj; };
				this.collection = new Collection();
				this.indexed = new IndexTracker();
				this.indexs = {};

				if ( settings.key ){
					this.primary = new Index( settings.key, true );

					this.indexed.register( settings.key );
					createFind( this, 'find', settings.key, this.primary );
				}

				if ( settings.indexs ){
					for( key in settings.indexs ){
						index = new Index( settings.indexs[key] );

						this.indexs[ index.name ] = index;

						this.indexed.register( settings.indexs[key] );
						createFind( this, key, settings.indexs[key], index );
					}
				}
			},
			properties : {
				set : function( data ){
					var key;

					if ( this.model ){
						data = new this.model( data );
					}
					
					if ( this.primary.insert(data) ){
						this.collection.add( data );
					}

					for( key in this.indexs ){
						this.indexs[ key ].insert( data );
					}

					return data;
				},
				select : function( parameters ){
					var dex = Index.makeName( Object.keys(parameters) );

					if ( this.primary.name === dex ){
						return this.primary.find( parameters );
					}else if ( this.indexs[dex] ){
						return this.indexs[dex].find( parameters );
					}else{
						console.log('I have no idea what to do -- something about collection');
					}
				},
				getTracker : function(){
					return this.indexed;
				}
			}
		};
	}]
);
