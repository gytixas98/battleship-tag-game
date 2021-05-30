var otherPlayers = {};

var playerID;
var player;
let water;

var playingNowTeam;


function loadGame() {




	
	// load the environment
	loadEnvironment();

	// load the player
	initMainPlayer();

	listenToOtherPlayers();

	window.onunload = function() {
		fbDatabase.child( "Players/" + playerID ).remove();
	};

	window.onbeforeunload = function() {
		fbDatabase.child( "Players/" + playerID ).remove();
	};
}

function listenToPlayer( playerData ) {
	if ( playerData.val() ) {
		otherPlayers[playerData.key].setOrientation( playerData.val().orientation.position, playerData.val().orientation.rotation );
	}
}

function listenToOtherPlayers() {
	// when a player is added, do something
	fbDatabase.child( "Players" ).on( "child_added", function( playerData ) {
		if ( playerData.val() ) {
			if ( playerID != playerData.key && !otherPlayers[playerData.key] ) {
				otherPlayers[playerData.key] = new Player( playerData.key );
				otherPlayers[playerData.key].init();
				fbDatabase.child( "Players/" + playerData.key ).on( "value", listenToPlayer );
			}
		}
	});

	// when a player is removed, do something

	fbDatabase.child( "Players" ).on( "child_removed", function( playerData ) {
		if ( playerData.val() ) {
			fbDatabase.child( "Players/" + playerData.key ).off( "value", listenToPlayer );
			scene.remove( otherPlayers[playerData.key].mesh );
			delete otherPlayers[playerData.key];
		}
	});
}



function initMainPlayer() {

	fbDatabase.child( "Players/" + playerID ).set({
		isOnline: true,
		isSubmarine: false,
		orientation: {
			position: {x: 0, y:0, z:0},
			rotation: {x: 0, y:0, z:0}
		}
	});




	// Creating a GUI and a subfolder.
	var gui = new dat.GUI();
	var ChangeTeam = {
		
		move: "WASD", // some simple explanations
		look: "mouse click with drag",
		Be_Submarine: function(){
			// let player know he is submarine now
			alert('You became a submarine!');
			//add a function to change models
			fbDatabase.child( "Players/" + playerID ).update({
				//isOnline: true,
				isSubmarine: true
			});

		}

	};

	gui.add(ChangeTeam, 'Be_Submarine');
	gui.add(ChangeTeam, "move");
	gui.add(ChangeTeam, "look");

	player = new Player( playerID );
	player.isMainPlayer = true;
	player.init();


}


function loadEnvironment() {

	// FLOOR with water textures
	var floorMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "assets/img/water_texture.jpg" ), side: THREE.DoubleSide });
	var floorGeometry = new THREE.PlaneGeometry(10000, 10000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);


	scene.add(new THREE.AmbientLight(0xffffff));

	// Add light
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(-600, 300, 600);
	directionalLight.castShadow = true;
	scene.add(directionalLight);


	const listener = new THREE.AudioListener();
	camera.add( listener );

	// create a global audio source
	const sound = new THREE.Audio( listener );

	// load a sound and set it as the Audio object's buffer
	const audioLoader = new THREE.AudioLoader();
	audioLoader.load( "assets/sound/sound_waves.mp3", function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop( true );
		sound.setVolume( 0.3 );
		sound.play();
	});




}
