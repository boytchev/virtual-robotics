
//	Robot API
//	Virtual Robotics 1.0
//
//
//	class Robot extends THREE.Group
//
//	constructor( )
//
//	addChain( ...parts )
//	attachChain( ...parts )
//	addGUI( )
//
//	getParts( )
//	getMotors( )
//
//	getPosition( )
//	setPosition( position )
//	setPosition( x, y, z )
//
//	setRotation( x, y, z, order='XYZ' )
//
//	getAngle( index )
//	setAngle( index, angle )
//
//	getAngles( )
//	setAngles( ...angles )
//
//	getProperty( name )
//	setProperty( name, value )



import * as THREE from "../libs/three.module.min.js";
import * as lil from "../libs/lil-gui.module.min.js";
import {getScene} from "./scene.js";
import {Part} from "./part.js";
import {Sensor} from "./sensor.js";
import * as PHYSICS from "./physics.js";


	
	
class Robot extends THREE.Group
{
	constructor( )
	{
		super( );
		
		this.receiveShadow = true;
		this.castShadow = true;
		
		this.parts = null;
		this.motors = null;
		this.sensors = null;
		this.gui = null;
			
		getScene().add( this );
	}


	getPosition( )
	{
		return [this.position.x, this.position.y, this.position.z ];
	}


	setPosition( x, y, z )
	{
		var scene = getScene();
		
		if( x === undefined )
		{
			scene.remove( this );
		}
		else
		if( x instanceof Array )
		{
			this.setPosition( ...x );
		}
		else
		{
			this.position.set( x, y, z );
			if( this.parent !== scene ) scene.add( this );
		}
		
		return this;
	}


	setRotation( x, y, z, order='XYZ' )
	{
		this.rotation.set( x, y, z, order );
		
		return this;
	}


	addChain( ...parts )
	{
		for( var i=1; i<parts.length; i++ )
		{
			parts[i].attachToSlot( parts[i-1] );
		}
		
		return parts[parts.length-1];
	}


	attachChain( ...parts )
	{
		return this.addChain( this, ...parts );
	}
	
	
	#prepare( )
	{
		if( this.parts === null )
		{
			this.parts = [];
			this.motors = [];
			this.sensors = [];
			
			this.traverse( x => {
				if( x instanceof Part )
				{
					this.parts.push( x );
				}
				if( x instanceof Sensor )
				{
					this.sensors.push( x );
				}
				if( x.axis != null )
				{
					this.motors.push( x );
				}
			} );
		}
	}
	
	
	getParts( )
	{
		this.#prepare( );
		
		return this.parts;
	}
	
	
	getMotors( )
	{
		this.#prepare( );
		
		return this.motors;
	}
	
	
	getSensors( )
	{
		this.#prepare( );
		
		return this.sensors;
	}
	
	
	setAngles( ...angles )
	{
		this.#prepare( );
		
		var n = Math.min( this.motors.length, angles.length );
		
		for( var i=0; i<n; i++ )
			this.motors[i].setAngle( angles[i] );
	}
	
	
	getAngles( )
	{
		this.#prepare( );
		
		var angles = [];
		
		for( var motor of this.motors )
			angles.push( motor.getAngle() );
		
		return angles;
	}
	
	
	setAngle( index, angle )
	{
		this.#prepare( );

		if( typeof this.motors[index] === 'undefined' )
			return;
		
		if( Number.isNaN(angle) )
			return;
		this.motors[index].setAngle( angle );
	}


	getAngle( index )
	{
		this.#prepare( );
		
		if( typeof this.motors[index] === 'undefined' )
			return 0;
		
		return this.motors[index].getAngle( );
	}
	
	
	addGUI( title = 'Robot' )
	{
		if( this.gui ) return;
		
		this.#prepare( );
		this.gui = new lil.GUI( {title: title} );
		
		var that = this,
			data = { get: gesture };

		for( let i in this.motors )
		{
			data[i] = Math.round( THREE.MathUtils.mapLinear( this.motors[i].getAngle(), this.motors[i].min, this.motors[i].max, 0, 100 ) );
			
			this.gui.add( data, i ).min(0).max(100).step(1).name( this.motors[i].name || `Motor ${i}` ).onChange( ()=>update(i) );
		}

		this.gui.add( data, 'get' ).name( 'Get gesture' );
		
		function update( i )
		{
			that.setAngle( i, THREE.MathUtils.mapLinear( data[i], 0, 100, that.motors[i].min, that.motors[i].max ) );
		}
		
		function gesture( )
		{
			var gesture = 'robot.setAngles(' + that.getAngles( ).map( x => Math.round(100*x)/100 ).join( ',' ) + ');';
			
			prompt( 'Code to recreate this gesture:', gesture );
		}
	} // Robot.addGUI
	
	
	setProperty( name, value )
	{
		this.#prepare( );
		
		for( var part of this.parts )
			part.setProperty( name, value );
	}
	
	
	getProperty( name )
	{
		this.#prepare( );
		if( this.parts[0] )
			return this.parts[0].getProperty( name );
		else
			return undefined;
	}

	
	setScale( scale )
	{
		this.#prepare( );
		
		// scale Three.js
		this.scale.x *= scale;
		this.scale.y *= scale;
		this.scale.z *= scale;
		
		// scale Cannon ES
		for( var part of this.parts )
		{
			if( part.physics )
				PHYSICS.rescale( part.physics, scale );
		}
	}
	
	
	
} // class Robot


export { Robot };