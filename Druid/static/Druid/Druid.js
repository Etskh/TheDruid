document.body.onload = function() {
	
	ES6Compat = function( String, Boolean, Number, Function) {
		check = "isString";
		if ( !(check in String.prototype) ) {
			String.prototype.isString = function() { return true; }
			String.prototype.isNumber = function() { return false; }
			String.prototype.isFunction = function() { return false; }
			String.prototype.isBoolean = function() { return false; }
		}
		if ( !(check in Number.prototype) ) {
			Number.prototype.isString = function() { return false; }
			Number.prototype.isNumber = function() { return true; }
			Number.prototype.isFunction = function() { return false; }	
			Number.prototype.isBoolean = function() { return false; }
		}
		if ( !(check in Function.prototype) ) {
			Function.prototype.isString = function() { return false; }
			Function.prototype.isNumber = function() { return false; }
			Function.prototype.isFunction = function() { return true; }
			Function.prototype.isBoolean = function() { return false; }
		}
		if ( !(check in Boolean.prototype) ) {
			Boolean.prototype.isString = function() { return false; }
			Boolean.prototype.isNumber = function() { return false; }
			Boolean.prototype.isFunction = function() { return false; }
			Boolean.prototype.isBoolean = function() { return true; }
		}
		console.log("ES6 compatibility enabled");
	}
	ES6Compat(String,Number,Boolean,Function);
	
	window.require = function( url, stringOrCallback, callback ) {
		
		// If the second argument is not a string,
		// then it is a callback
		//
		if( stringOrCallback && !stringOrCallback.isString() ) {
			callback = stringOrCallback;
		}
		
		var scriptBlock = document.getElementById("scripts");
		var script = document.createElement("script");
		script.src = 'static/'+url;
	
		// Handle Script loading
		var done = false;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function(){
			if ( !done && (
					!this.readyState ||
					this.readyState == "loaded" || this.readyState == "complete")
				) {
				done = true;
             	
             	// If they sent a callback (which they should have)
             	//
				if (callback) {

					// If stringOrCallback is a string, then let's grab the value
					// of what it's asking for - and send it to the callback
					//
					var stringVal = undefined;
					if ( stringOrCallback.isString() ){
						stringVal = window[stringOrCallback];
						if( stringVal === undefined ) {
							console.error(stringOrCallback+" is not in the global space");
							return false;
						}
					}
				
					callback(stringVal);
				}

				// Handle memory leak in IE - stupid IE
				script.onload = script.onreadystatechange = null;
			}
		};

		scriptBlock.appendChild(script);
	};
	
	
	
	require('gfx/gfx.js', 'GFX', function( gfx ) {
		camera = gfx.getCamera();
		
		gfx.createModel('Endless-Fields', [0,0,0], function(sceneItem) {
			console.log(sceneItem);
		});
		
	});
	
	
}