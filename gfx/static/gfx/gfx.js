
var GFX = function(window, document) {
	'use strict';
	
	var _camera,
		_scene,
		_container,
		_renderer,
		_clock,
		_bufferLoader,
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
	// Get JSON object
	//
	function GetJSON( url, dataOrCallback, callback ) {
		
		console.log(url);
		
		// If there's no "callback", then the dataOrCallback must be the callback
		//
		if( callback === undefined ){
			callback = dataOrCallback;
			dataOrCallback = {};
		}
		$.ajax({
			url: url,
			data: dataOrCallback,
			success: callback,
			failure: function(error) {
				console.log(url+': request failed\n'+error);
			},
			dataType: 'json'
		});
		//$.get(url, dataOrCallback, callback, 'json');
	}	
	
	//
	// Include THREEJS and then make everything work
	//
	require('extern/threejs/three.min.js', function(){
	
	
		//
		// Initialization
		//
		_camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		_camera.position.z = 4;
		
		_renderer = new THREE.WebGLRenderer();
		
		_container = document.getElementById('render_container');
		_container.appendChild( _renderer.domElement );
		
		_scene = new THREE.Scene();
		
		_clock = new THREE.Clock();
		
		_bufferLoader = new THREE.BufferGeometryLoader();
		
		
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
		
		
		loadMesh : function( meshID, callback ) {
			
			if( _resources.meshes[meshID]) {
				callback( _resources.meshes[meshID] );
			}
			else {
				GetJSON('/gfx/mesh/'+meshID, function(mesh) {
					mesh.three = {};
					
					//
					// Make a THREEjs object out of the mesh
					mesh.three.geometry = _bufferLoader.parse(mesh);
					
					//
					// Add it to the list and call the callback
					//
					_resources.meshes[meshID] = mesh;
					callback( _resources.meshes[meshID] );
				});
			}
		},
		
		loadMaterial : function( materialID, callback ) {
		
			if( _resources.materials[materialID]) {
				callback( _resources.materials[materialID] );
			}
			else {		
				GetJSON('/gfx/material/'+materialID, {}, function(material) {
					
					material.three = {};
					
					var gl = _renderer.context;
					var shader = gl.createShader(gl.FRAGMENT_SHADER);
					gl.shaderSource(shader, atob(material.vertex));
					gl.compileShader(shader);
					var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
					console.log('Shader compiled successfully: ' + compiled);
					console.log(gl.getShaderInfoLog(shader));
					
					//
					// Make THREEjs object out of the material
					// and compile the shaders
					material.three.material = new THREE.ShaderMaterial( {
						/*uniforms: {
							time: { type: "f", value: 1.0 },
							resolution: { type: "v2", value: new THREE.Vector2() }
						},*/
						attributes: {
							position: { type: 'v3', value: [] }
						},
						vertexShader: atob(material.vertex),
						fragmentShader: atob(material.fragment)
					});
					
					//
					// Add it to the list and call the callabck
					//
					_resources.materials[materialID] = material;
					callback( _resources.materials[materialID] );
				});
			}
		},
		
				
		loadModel : function( modelTag, callback ) {
		
			var	storedModel;
			
			for( var m=0, len=_resources.models.length; m < len; m++) {
				if ( ! _resources.models[m] ) { 
					continue;
				}
				
				if( _resources.models[m].tag == modelTag ) {
					storedModel = _resources.models[m];
					break;
				}
			}
			
			if( storedModel ) {
				callback( storedModel );
			}
			else {
				GetJSON('/gfx/models/search', { "tag": modelTag }, function(model) {
					
					GFX.loadMesh(model.mesh_id, function(mesh){
						
						GFX.loadMaterial(model.material_id, function(material){
							
							// Set the loaded material and mesh
							//
							model.material = material;
							model.mesh = mesh;
					
							// Add it to the list of resources
							//
							_resources.models[model.id] = model;
							
							// Call the callback
							//
							callback( model );
							
						});
						
					});
					
				}); // GetModel
				
			} // else
			
		}, // function loadModel
		
		
		
		
		
		createModel : function( tag, position, callback ) {
			
			GFX.loadModel( tag, function( model ) {
				
				var sceneItem = new THREE.Mesh(
					model.mesh.three.geometry,
					model.material.three.material
				);
				
				_scene.add( sceneItem );
				
				callback(sceneItem);
			
			});
		
		} // function createModel
		
	};
}(window, document);

