
//	Sensor API
//	Virtual Robotics 1.0
//
//	class Sensor extends Part
//	constructor( visible=true, laser )
//
//	senseDistance( maxDistance = Infinity )
//	senseTouch( )
//	sensePosition( )
//	senseDirection( )
//	senseCollision( )
//	senseObjects( )
//	senseObject( otherObject )
//	senseProperty( otherObject )



import * as THREE from "../libs/three.module.min.js";
import { currentTime, scene } from "./global.js";
import { Part } from "./part.js";
import { Laser } from "./laser.js";
import { sensorTexture } from "./textures.js";




var GEOMETRY = new THREE.SphereGeometry( 1, 32, 8, 0, 2*Math.PI, 0, Math.PI/2 ),
	MATERIAL = new THREE.MeshLambertMaterial( {color: 'lightgray', map: sensorTexture} );

// shared position, velocity, acceleration, direction and raycaster
var pos = new THREE.Vector3(),
	vel = new THREE.Vector3(),
	acc = new THREE.Vector3(),
	dir = new THREE.Vector3();
	
var raycaster = new THREE.Raycaster();
	raycaster.params = {
			Mesh: {},
			Line: { threshold: 0 },
			LOD: {},
			Points: { threshold: 0 },
			Sprite: {}
		};

// dummy vectors, can be reused at any time for any purpose
var v = new THREE.Vector3(),
	u = new THREE.Vector3();

// a list of sensors tracking velocity and acceleration
var motionTrackingSensors = [];


// class for sensors

class Sensor extends Part
{
	constructor( visible=true, laserColor )
	{
		super( );

		// motion tracking; motion tracking properties are defined in #motionTracking()
		this.motionTracked = false;
		
		if( visible )
		{
			var pad = new THREE.Mesh( GEOMETRY, MATERIAL );
				pad.scale.set( 0.1, 0.05, 0.1 );
				pad.name = 'Sensor.Pad';
			
			this.add( pad );
		}
		
		if( laserColor === true )
			laserColor = 'crimson';

		if( laserColor )
		{
			this.laser = new Laser( laserColor );
			scene.add( this.laser );
		}
	}

	getWorldDirectionY( target )
	{
		this.updateWorldMatrix( true, true );
		var e = this.matrixWorld.elements;
		return target.set( e[4], e[5], e[6] ).normalize();
	}

	
	senseDirection( )
	{
		this.getWorldDirectionY( v );
		return [v.x, v.y, v.z];
	}
	
	
	senseDistance( maxDistance = Infinity )
	{
		raycaster.near = 0.05;
		raycaster.far = maxDistance;
		
		this.getWorldPosition( pos );
		this.getWorldDirectionY( dir );
		
		raycaster.set( pos, dir );
		
		var intersect = raycaster.intersectObject( scene, true );
		if( intersect.length > 0 )
		{
			if( this.laser )
			{
				// set the end point of laser
				this.laser.visible = true;
				this.laser.set( pos, intersect[0].point );
			}
			return intersect[0].distance;
		}
		else
		{
			if( this.laser )
			{
				// set "infinite" end point of laser
				this.laser.visible = false;
//				v.set( 0, 0, 0 );
//				this.laser.set( pos, this.localToWorld(v) );
			}
			return Infinity;
		}
	}
	
	senseTouch( )
	{
		raycaster.near = 0;
		raycaster.far = 0.05;

		this.getWorldPosition( pos );
		this.getWorldDirectionY( dir );
		
		raycaster.set( pos, dir );
		
		if( this.laser )
		{
			// set the end point of laser
			// the shift in X is to eliminate the chance
			// of the raycaster to hit the laser
			u.set( 0.01, raycaster.near, 0 );
			v.set( 0.01, raycaster.far, 0 );
			this.laser.set( this.localToWorld(u), this.localToWorld(v) );
		}

		var intersect = raycaster.intersectObject( scene, true );
		
		if( intersect.length > 0 )
		{
//			console.log( intersect );
			return 1 - intersect[0].distance/(raycaster.far-raycaster.near);
		}
		else
			return 0;
	}
	
	sensePosition( )
	{
		this.getWorldPosition( pos );
		return [pos.x, pos.y, pos.z];
	}
	
	senseCollision( )
	{
		for( var object=this.parent; object; object=object.parent )
			if( object.collisions )
				return object.collisions.length > 0;
		
		return false;
	}
	
	senseObjects( )
	{
		for( var object=this.parent; object; object=object.parent )
			if( object.collisions )
				return object.collisions;
		
		return [];
	}
	
	senseObject( otherObject )
	{
		for( var object=this.parent; object; object=object.parent )
			if( object.collisions )
				return object.collisions.indexOf( otherObject ) >= 0;

		return false;
	}
	
	#motionTracking( )
	{
		if( this.motionTracked ) return;
		
		this.motionTracked = true;
		this.time = currentTime;
		this.pos = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this.acceleration = new THREE.Vector3();
		this.accelerationMagnitude = 0;

		motionTrackingSensors.push( this );
	}
	
	senseSpeed( )
	{
		this.#motionTracking( );
		return this.velocity.length( );
	}
	
	senseVelocity( )
	{
		this.#motionTracking( );
		return [this.velocity.x, this.velocity.y, this.velocity.z];
	}
	
	senseAccelerationMagnitude( )
	{
		this.#motionTracking( );
		return this.accelerationMagnitude;
	}
	
	senseAcceleration( )
	{
		this.#motionTracking( );
		return [this.acceleration.x, this.acceleration.y, this.acceleration.z];
	}
	
	motionTracking( time )
	{
		// get sensor's dTime
		var dTime = time - this.time;
		
		// get new position, velocity and acceleration
		this.getWorldPosition( pos );
		vel.subVectors( pos, this.pos ).divideScalar( dTime );
		acc.subVectors( vel, this.velocity ).divideScalar( dTime );
		
		this.accelerationMagnitude = vel.length() - this.velocity.length();
		
		// update sensor's motion properties
		this.time = time;
		this.pos.copy( pos );
		this.velocity.copy( vel );
		this.acceleration.copy( acc );
	}

	
	senseProperty( name, maxDistance = Infinity )
	{
		raycaster.near = 0.05;
		raycaster.far = maxDistance;
		
		this.getWorldPosition( pos );
		this.getWorldDirectionY( dir );
		
		raycaster.set( pos, dir );
		
		var intersect = raycaster.intersectObject( scene, true );
		if( intersect.length > 0 )
		{			
			if( this.laser )
			{
				// set the end point of laser
				this.laser.visible = true;
				this.laser.set( pos, intersect[0].point );
			}
			
			for( var object = intersect[0].object; object; object = object.parent )
				if( object.properties )
				if( name in object.properties )
					return object.properties[name];
				
			return 0;
		}
		else
		{
			if( this.laser )
			{
				// set "infinite" end point of laser
				this.laser.visible = false;
//				v.set( 0, 0, 0 );
//				this.laser.set( pos, this.localToWorld(v) );
			}
			return 0;
		}
	}

} // class Sensor


function motionTracking( time, dTime )
{
	for( var sensor of motionTrackingSensors )
		sensor.motionTracking( time, dTime );
}


export { Sensor, motionTracking };