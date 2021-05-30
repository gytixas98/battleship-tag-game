var Player = function (playerID) {
	this.playerID = playerID;
	this.isMainPlayer = false;
	this.mesh;
	var submarine ;
	let battleship;


	var cube_geometry = new THREE.CubeGeometry(1, 1, 1);
	cube_geometry.castShadow = true;
	var cube_material = new THREE.MeshBasicMaterial({
		color: 0x7777ff,
		wireframe: true,
		

		
	});

	teamListener();
	function teamListener() {
		fbDatabase.child("Players/" + playerID + "/isSubmarine").on("value" ,(snapshot) => {
					
			
			playingNowTeam = snapshot.val();
			console.log("Player is submarine", playingNowTeam);



		})
	}

	


	var loader = new THREE.GLTFLoader(loadingManager);
	var loader2 = new THREE.GLTFLoader();

    //loader.load('../assets/models/battleship(dazytas).glb', handle_load);
	loader2.load('assets/models/submarine(solo).glb', handle_load2);


	//var battleship, submarineMesh;

    function handle_load(gltf) {

		// Cube vardas mesho kurio reikia
        //console.log(gltf);
        battleship = gltf.scene;
		//submarine = gltf.scene;
		battleship.children.find((child) => child.name === "Cube");
		battleship.scale.set(battleship.scale.x * 1, battleship.scale.y * 1, battleship.scale.z * 1)
		battleship.position.set(0, 0, -10);
		scene.add(battleship);
		console.log(' done loading battleship', battleship);



		//console.log("battleship");
        //console.log(battleship.children[0]);
        //battleship.children[0].material = new THREE.MeshBasicMaterial();
		//submarine.children[1].material = new THREE.MeshLambertMaterial();
		//scene.add( battleship,  );
        //battleship.position.z = -10;
		//submarine.position.z = -10;
		
		

    }

	loader.load(
		// resource URL
		'assets/models/battleship(dazytas).glb',
		// called when the resource is loaded
		function ( glb ) {

			battleship = glb.scene;
			console.log("battleship mesh", battleship)
			//scene.add( battleship ); // šitą atvaizduoja scenoje
	
			// gltf.animations; // Array<THREE.AnimationClip>
			// gltf.scene; // THREE.Group
			// gltf.scenes; // Array<THREE.Group>
			// gltf.cameras; // Array<THREE.Camera>
			// gltf.asset; // Object
	
			// let battleship = scene.getObjectByName("battleship");
			// //Tikrinimas:
			// if (typeof battleship!== 'undefined') {
			// 	scene.add(battleship);
			// }
			scene.add(battleship);
		},
		// called while loading is progressing
		function ( xhr ) {
	
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% battleship loaded');
	
		},
		// called when loading has errors
		function ( error ) {
	
			console.log( 'An error happened' );
	
		}
	);
	
	// const loadingManager = new THREE.LoadingManager( function () {

	// 	scene.add( battleship );

	// } );

	var loadingManager = null;
	var RESOURCES_LOADED = false;


	loadingManager = new THREE.LoadingManager();
	
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
	};


	// manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	// 	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

	// };

	// manager.onLoad = function ( ) {

	// 	console.log( 'Loading complete!');

	// };


	// manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	// 	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

	// };
	

	// manager.onError = function ( url ) {

	// 	console.log( 'There was an error loading ' + url );

	// };

	// const loader = new THREE.OBJLoader( manager );
	// loader.load( 'file.obj', function ( object ) {

	// 	//

	// } );



	

	function handle_load2(gltf) {
		// Sphere mesh name yra 
        //console.log(gltf);
        submarine = gltf.scene;
		//submarine = gltf.scene;
		console.log("submarine", submarine);
        //console.log(submarine.children[0]);
		// submarine.children[0].material = new THREE.MeshLambertMaterial();
		 scene.add( submarine  );
		 submarine.position.x = 10;
		 submarine.position.z = -1;
		// submarine.position.y = -4;
		 submarine.rotation.y = 0;
		 scope.mesh = new THREE.Mesh(submarine);

		// var submarineMesh = gltf.scene.children.find((child) => child.name === "Sphere");
		// submarineMesh.scale.set(submarineMesh.scale.x * 1, submarineMesh.scale.x * 1, submarineMesh.scale.x * 1)
		// submarineMesh.position.set(10, -1, 0);
		// scene.add(submarineMesh);
		// console.log('submarineMesh');
		// console.log(submarineMesh);
		

    }


	var scope = this;

	this.init = function () {

		if (typeof battleship!== 'undefined' || typeof cube_geometry!== 'undefined') {
			if (playingNowTeam === false){

				scope.mesh = new THREE.Mesh(battleship);

	
			} 
			
			else {
	
				scope.mesh = new THREE.Mesh(submarine);
				
	
			} 

		}
		


		
		

	
		
		console.log(' done loading player mesh', scope.mesh)

		
		scene.add(scope.mesh);

		if (scope.isMainPlayer) {
			// Give player control of this mesh
			controls = new THREE.PlayerControls(camera, scope.mesh);
			controls.init();
		}



	};

	this.setOrientation = function (position, rotation) {
		if (scope.mesh) {
			scope.mesh.position.copy(position);
			scope.mesh.rotation.x = rotation.x;
			scope.mesh.rotation.y = rotation.y;
			scope.mesh.rotation.z = rotation.z;

		}
	};
};