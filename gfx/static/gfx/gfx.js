
var GFX = function(window, document) {
	'use strict';
	
	var _camera,
		_scene,
		_container,
		_renderer,
		_clock,
		_binaryLoader,
		_resources = {
			models:[],
			meshes:[],
			materials:[]
		};
	
	
	//
	// Function for adding window listeners
	//
	function AddEventListener(eventID, callback) {
		window.addEventListener( eventID, callback, false );
		return callback;
	}
	
	
	//
	// Rendering
	//
	function Render() {
		// Render
		var time = Date.now() * 0.0005,
			delta = _clock.getDelta();
		
		_renderer.render( _scene, _camera );
		
		requestAnimationFrame( Render );
	}
	
	
	
	
	//
	// Include THREEJS and then make everything work
	//
	require('extern/threejs/three.min.js', function(){
	
	
		//
		// Initialization
		//
		_camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		_camera.position.z = 100;
		
		_renderer = new THREE.WebGLRenderer();
		
		_container = document.getElementById('render_container');
		_container.appendChild( _renderer.domElement );
		
		_scene = new THREE.Scene();
		
		_clock = new THREE.Clock();
		
		//_binaryLoader = new THREE.BinaryLoader(false);
		
		
		//
		// Add the window listener and run it
		//
		AddEventListener('resize', function() {
			_camera.aspect = window.innerWidth / window.innerHeight;
			_camera.updateProjectionMatrix();
			_renderer.setSize( window.innerWidth, window.innerHeight );
		})();
		
		
		
		//
		// And render
		//
		Render();
	
	});
	
	
	
	return {
		
		//
		// Returns the camera
		//
		getCamera : function() {
			return _camera;
		},
		
		loadModel : function( modelTag, callback ) {
		
			for( var m=0, len=_resources.models.length; m < len; m++) {
				if( _resources.models[m].tag == modelTag ) {
					return callback( _resources.models[m] );
				}
			}
			
			$.get('/gfx/models/search', { "tag": modelTag }, function(model) {
				
				// Now that we have the model, there might be a context,
				// material, and a mesh
				_resources.models.push( model );
				
				callback( model );
				
			});
		},
		
	};
}(window, document);

