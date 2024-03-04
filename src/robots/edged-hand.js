
//	Robot Edged Hand
//	Virtual Robotics 1.0
//
//
//	class EdgedHand extends Robot
//
//	new EdgedHand( isLeft = true )
//
//	flexFinger( i, angle )
//	flexFingers( angle )
//	spreadFinger( i, angle )
//	spreadFingers( angle, includeThumb=false )


import {Robot} from "../robot.js";
import {EdgedPalm, EdgedFinger, EdgedTip} from "../parts/edged-hand.js";
import {MotorX,MotorZ} from "../motor.js";


const PI = Math.PI;


class EdgedHand extends Robot
{
	
	constructor( isLeft = true )
	{
		super( );

		this.isLeft = isLeft;

		this.palm = new EdgedPalm( isLeft );
		this.palm.attachToSlot( this );

		for( var i=0; i<5; i++ )
			this.addFinger( i );
	} // EdgedHand.constructor
	
	
	addFinger( slot )
	{
		var size = [1, 1, 1.1, 1, 0.8][slot],
			span = slot==0? 1 : 0.4;
		
		this.addChain(
				new MotorX( -span, span, 0, 0.3, 0.1 ).flip( this.isLeft ).attachToSlot( this.palm, slot ),
				new MotorZ( 0, -PI/2, -PI/4, 0.3, 0.1 ),
				new EdgedFinger( size ),
				new MotorZ( 0, -PI/2, -PI/4, 0.3, 0.1 ),
				new EdgedFinger( 0.5 ),
				new MotorZ( 0, -PI/2, -PI/4, 0.3, 0.1 ),
				new EdgedTip( 0.5 )
			);
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
			this.spreadFinger( 0, -1+3*angle );
		}
		
		this.spreadFinger( 1,  1.0*angle );
		this.spreadFinger( 2,  0.3*angle );
		this.spreadFinger( 3, -0.3*angle );
		this.spreadFinger( 4, -1.0*angle );
	}
	
} // class EdgedHand

export { EdgedHand };
