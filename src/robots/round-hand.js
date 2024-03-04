
//	Robot Round Hand
//	Virtual Robotics 1.0
//
//
//	class RoundHand extends Robot
//
//	new RoundHand( isLeft = true )
//
//	flexFinger( i, angle )
//	flexFingers( angle )
//	spreadFinger( i, angle )
//	spreadFingers( angle, includeThumb=false )


import {Robot} from "../robot.js";
import {RoundPalm, RoundFinger} from "../parts/round-hand.js";
import {MotorX, MotorY, MotorZ} from "../motor.js";


const PI = Math.PI;


class RoundHand extends Robot
{
	
	constructor( isLeft = true )
	{
		super( );

		this.isLeft = isLeft;

		this.palm = new RoundPalm( isLeft, '../assets/gltf/round-palm.glb' );
		this.palm.attachToSlot( this );

		for( var i=0; i<5; i++ )
			this.addFinger( i );
	} // RoundHand.constructor
	
	
	addFinger( slot )
	{
		var spread;
			
		if( slot == 0 )
			spread = new MotorY( 0, PI/2, 0, 0.25, 0.1 ).flip( !this.isLeft );
		else
			spread = new MotorX( -0.4, 0.4, 0, 0, 0 ).flip( this.isLeft );

		spread.name = ['Thumb','Index finger','Middle finger','Ring finger','Little finger'][slot];
				
		this.addChain( 
				spread.attachToSlot( this.palm, slot ),
				new MotorZ( PI/4, -PI/2, -PI/4, 0.2, 0.07 ).setName( '<small>&ndash; proximal</small>' ),
				new RoundFinger( '../assets/gltf/round-finger-8.glb', 0.8 ),
				new MotorZ( 0, -PI/2, -PI/4, 0.2, 0.07 ).setName( '<small>&ndash; middle</small>' ),
				new RoundFinger( '../assets/gltf/round-finger-5.glb', 0.5 ),
				new MotorZ( 0, -PI/2, -PI/4, 0.2, 0.07 ).setName( '<small>&ndash; distal</small>' ),
				new RoundFinger( '../assets/gltf/round-tip.glb', 0.5 ),
			);
			
		return spread;
	}		
	

	flexFinger( i, angle )
	{
		var motors = this.getMotors();
		
		motors[4*i+1].setAngle( -angle );
		motors[4*i+2].setAngle( -angle );
		motors[4*i+3].setAngle( -angle );
	}


	flexFingers( angle )
	{
		for( var i=0; i<5; i++ )
			this.flexFinger( i, angle );
	}
	
	
	spreadFinger( i, angle )
	{
		var motors = this.getMotors();
		
		motors[4*i].setAngle( -angle );
	}


	spreadFingers( angle, includeThumb=false )
	{
		if( includeThumb )
		{
			this.spreadFinger( 0, -3*angle );
		}
		
		this.spreadFinger( 1,  1.0*angle );
		this.spreadFinger( 2,  0.3*angle );
		this.spreadFinger( 3, -0.3*angle );
		this.spreadFinger( 4, -1.0*angle );
	}
	
} // class RoundHand

export { RoundHand };
