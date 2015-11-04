/*
 *
 *
 */
var GFX = function(window, document) {
	'use strict';

	var
		// THREEjs camera
		_camera,
		// THREEjs scene
		_scene,
		// DOM render container - used to create everything in the frame
		_container,
		// THREEjs renderer
		_renderer,
		// Clock object for timers
		_clock,
		// THREEjs buffer loader for geometry
		_bufferLoader,
		// Saved resources for the quick callbacks
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
		// return the callback so it can be run after adding the listener
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

		//console.log("DOING THIS");

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
		_renderer.setSize( window.innerWidth, window.innerHeight );
		_renderer.setClearColor( 0x333333 );

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
		})(); // and run it

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


		// Loads a mesh
		loadMesh : function( meshID, callback ) {
			/*
			// TEST
			callback({
				three : {
					geometry: new THREE.BoxGeometry( 1, 1, 1 )
				}
			});
			return;
			*/

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

		// Loads a material
		loadMaterial : function( materialID, callback ) {
			// TEST
			callback({
				three : {
					material : new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
				}
			});
			return;

			if( _resources.materials[materialID]) {
				callback( _resources.materials[materialID] );
			}
			else {
				GetJSON('/gfx/material/'+materialID, {}, function(material) {

					var gl = _renderer.context,
						vertShader = gl.createShader(gl.VERTEX_SHADER),
						fragShader = gl.createShader(gl.FRAGMENT_SHADER),
						vertSource = atob(material.vertex),
						fragSource = atob(material.fragment);

					material.three = {};

					// Compile vertex shader
					/*gl.shaderSource(vertShader, vertSource );
					gl.compileShader(vertShader);
					var compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
					if( ! compiled ) {
						console.error("Vertex shader failed to compile");
						console.warn( gl.getShaderInfoLog(vertShader) );
						return false;
					}

					// Compile fragment shader
					gl.shaderSource(fragShader, fragSource );
					gl.compileShader(fragShader);
					var compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
					if( ! compiled ) {
						console.error("Fragment shader failed to compile");
						console.warn( gl.getShaderInfoLog(fragShader) );
						return false;
					}*/

					// Make THREEjs object out of the material
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

		// Loads a model
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


		// Loads a model, then adds it to the scene
		createModel : function( tag, position, callback ) {

			GFX.loadModel( tag, function( model ) {

				var sceneItem = new THREE.Mesh(
					model.mesh.three.geometry,
					model.material.three.material
				);

				console.log(model.mesh.three.geometry);

				_scene.add( sceneItem );

				callback(sceneItem);

			});

		} // function createModel

	};
}(window, document);
