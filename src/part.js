
//	Part API
//	Virtual Robotics 1.0
//
//
//	class Part extends THREE.Group
//
//	constructor( )
//
//	getAngle( )
//	setAngle( x )




import * as THREE from "../libs/three.module.min.js";
import { ConvexGeometry } from "../libs/geometries/ConvexGeometry.js";
import { Slot } from "./slot.js";
import { scene, OPTION_DEBUG_PHYSICS } from "./global.js";


// base class for robot parts

class Part extends THREE.Group
{
	constructor( )
	{
		super( );

		this.receiveShadow = true;
		this.castShadow = true;
		
		this.slots = [];
		this.properties = {};

		// physics
		this.physics = null;
		this.collisions = [];
		
		scene.add( this );
	}

	addSlot( x, y, z )
	{
		var slot = new Slot( x, y, z );
		
		this.slots.push( slot );
		this.add( slot );
		
		return slot;
	}
	
	attachToSlot( parent, slot=0 )
	{
		// attachToSlot( Part, Slot )
		if( slot instanceof Slot )
		{
			parent.add( slot );
			slot.add( this );
			return this;
		}
		
		// attachToSlot( Part, index )
		if( parent.slots )
		if( parent.slots[slot] )
		{
			parent.slots[slot].add( this );
			return this;
		}
		
		// attachToSlot( Part )
		// attachToSlot( Scene )
		parent.add( this );
		return this;
	}

	setPosition( x, y, z )
	{
		if( x instanceof Array )
		{
			this.setPosition( ...x );
		}
		else
		{
			this.position.set( x, y, z );
		}
	}

	setRotation( x, y, z, order='XYZ' )
	{
		this.rotation.set( x, y, z, order );
	}
	
	beginContact( otherObject )
	{
		this.collisions.push( otherObject );

		if( this.mainMesh )
			this.mainMesh.material.emissiveIntensity = 1;

//		console.log( 'contact', this.constructor.name, 'with', otherObject.constructor.name );
	}

	endContact( otherObject )
	{
		this.collisions = this.collisions.filter( object => object!==otherObject );

		if( this.mainMesh && (this.collisions.length==0)  )
			this.mainMesh.material.emissiveIntensity = 0;

//		console.log( 'no contact', this.constructor.name, 'with', otherObject.constructor.name );
	}
	
	debugConvex( vertices, faces )
	{
		if( !OPTION_DEBUG_PHYSICS ) return;

		var points = [];

		for( var f of faces )
		for( var i=0; i<f.length; i++ )
		{
			var v = vertices[f[i]];
			points.push( v.x, v.y, v.z );
			
			v = vertices[f[(i+1)%f.length]];
			points.push( v.x, v.y, v.z );
		}

		var geometry = new THREE.BufferGeometry( ),
			material = new THREE.LineBasicMaterial({ color: 'crimson' });
			
		geometry.setAttribute( 'position', new THREE.BufferAttribute( 
			new Float32Array(points),3 ) );
		
		var lines = new THREE.LineSegments( geometry, material );
			lines.position.copy( this.mainMesh.position );

		this.add( lines );
	}
/*	
	setLabel( text, width=200, height=20, font='12px Arial', bottom=5 )
	{
		if( !this.mainMesh )
			return;
		
		if( !this.canvas )
		{
			this.canvas = document.createElement( 'CANVAS' );
			this.context = this.canvas.getContext( '2d' );
		}
		
		this.canvas.width = width;
		this.canvas.height = height;

		this.context.fillStyle = 'white';
		this.context.fillRect( 0, 0, width, height );
		this.context.fillStyle = 'black';
		this.context.font = '12px Arial';
		this.context.fillText( text, 10, height - bottom );

		if( this.mainMesh.material.map )
			this.mainMesh.material.map.dispose( );
		
		this.mainMesh.material.map = new THREE.CanvasTexture( this.canvas );
	}
*/	
	setProperty( name, value )
	{
		this.properties[name] = value;
	}
	
	getProperty( name )
	{
		return this.properties[name];
	}
	
}

export { Part };