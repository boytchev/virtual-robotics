
//	Textures
//	Virtual Robotics 1.0
//
//	sensorTexture
//	laserDotTexture
//

import * as THREE from "../libs/three.module.min.js";


var canvas, ctx;




//
// texture for sensors
//
//	X   X
//    X   X
//	X   X
//    X   X
//

canvas = document.createElement( 'CANVAS' );
canvas.width = 4;
canvas.height = 4;

ctx = canvas.getContext( '2d' );
ctx.fillStyle = 'white';
ctx.fillRect( 0, 0, 4, 4 );
ctx.fillStyle = 'black';
ctx.fillRect( 1, 1, 1, 1 );
ctx.fillRect( 3, 3, 1, 1 );

var sensorTexture = new THREE.CanvasTexture( canvas );
	sensorTexture.wrapS = THREE.RepeatWrapping;
	sensorTexture.wrapT = THREE.RepeatWrapping;
	sensorTexture.anisotropy = 2;
	sensorTexture.repeat.set( 32, 8 );
		
		
//
// texture for laser dots
//
//	  XXX
//  XXXXXXX
//	XXXXXXX
//    XXX
//

canvas = document.createElement( 'CANVAS' );
canvas.width = 64;
canvas.height = 64;

ctx = canvas.getContext( '2d' );
ctx.fillStyle = 'white';
ctx.arc( 31, 31, 30, 0, 2*Math.PI );
ctx.fill( );

var laserDotTexture = new THREE.CanvasTexture( canvas );
	laserDotTexture.anisotropy = 2;
		
		
		
export { sensorTexture, laserDotTexture };