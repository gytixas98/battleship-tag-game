var container, scene, camera, renderer;

let mesh, imageLoader;

var controls;


init();
animate();

function init() {
	// Setup
	container = document.getElementById( 'canvas' );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer( { alpha: true} );
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;

	clock = new THREE.Clock();

	imageLoader = new THREE.TextureLoader();


	//create sky box
	var geometry = new THREE.CubeGeometry( 490, 490, 490 );
	var cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "assets/img/px.jpg" ), side: THREE.DoubleSide }), //front side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/img/nx.jpg' ), side: THREE.DoubleSide }), //back side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/img/py.jpg' ), side: THREE.DoubleSide }), //up side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/img/ny.jpg' ), side: THREE.DoubleSide }), //down side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/img/pz.jpg' ), side: THREE.DoubleSide }), //right side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/img/nz.jpg' ), side: THREE.DoubleSide }) //left side
	];



	var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
	var skyCube = new THREE.Mesh( geometry, cubeMaterial );
	scene.add( skyCube );





	firebase.auth().onAuthStateChanged(function( user ) {
		if ( user ) {
			// User is signed in

			console.log( "Player is signed in " );
			playerID = user.uid;

			fbDatabase.child( "Players/" + playerID + "/isOnline" ).once( "value" ).then( function( isOnline ) {

				if ( isOnline.val() === null || isOnline.val() === false ) {
					loadGame();
				} else {
					alert( "Only one instance doable for one browser" );
				}
			});


		} else {
			// User is signed out
			console.log( "Player is signed out " );

			firebase.auth().signInAnonymously().catch(function(error) {
				console.log( error.code + ": " + error.message );
			})
		}
	});



	

	// Events
	window.addEventListener( "resize", onWindowResize, false );

	container.appendChild( renderer.domElement );
	document.body.appendChild( container );
}

function animate() {
	requestAnimationFrame( animate, mesh );

	if ( controls ) {
		controls.update();
	}

	
	render();
}

function render() {

	renderer.clear();
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	
}
