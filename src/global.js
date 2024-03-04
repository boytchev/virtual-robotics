
import * as THREE from "../libs/three.module.min.js";


var currentTime = 0;

var scene = new THREE.Scene( );

var options = new URL( window.location.href );

const OPTION_TOUCH_COLOR = options.searchParams.get( 'touch-color' ) || 'black';
const OPTION_DEBUG_PHYSICS = options.searchParams.has( 'debug-physics' ) || false;
const OPTION_SHOW_SLOTS = options.searchParams.has( 'show-slots' ) || false;


function setCurrentTime( t )
{
	currentTime = t;
}

export { currentTime, setCurrentTime, scene, OPTION_TOUCH_COLOR, OPTION_DEBUG_PHYSICS, OPTION_SHOW_SLOTS };