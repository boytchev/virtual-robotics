
//
//	Virtual Robotics 1.0
//	Edged Hand parts
//
//	class EdgedFinger( length=1.0, width=0.3, thickness=0.3 )
//	class EdgedTip( length=1.0, width=0.3, thickness=0.3 )
//	class EdgedPalm( left, length=1.4, width=1.4, thickness=0.3 )
//


import * as THREE from "../../libs/three.module.min.js";
import { ConvexGeometry } from "../../libs/geometries/ConvexGeometry.js";
import { Part} from "../part.js";
import { getScene } from "../scene.js";
import * as PHYSICS from "../physics.js";
import { OPTION_TOUCH_COLOR } from "../global.js";


// default materials 
const MATERIAL = new THREE.MeshLambertMaterial({
				color: 'White',
				polygonOffset: true,
				polygonOffsetUnits: 1,
				polygonOffsetFactor: 1,
				
				emissive: OPTION_TOUCH_COLOR,
				emissiveIntensity: 0,


				// transparent: true,
				// opacity: 0,
				// depthTest: false,
			});

const EDGE_MATERIAL = new THREE.LineBasicMaterial({
					color: 'Black',
					transparent: true,
					opacity: 0.3,
				});



//

function extrudeShape( shape, width )
{
	// shape is array of 2D coordinates
	// convert it to array of 3D vectors
	var vertices = [];
	for( var i=0; i<shape.length; i+=2 )
	{
		vertices.push( new THREE.Vector3( shape[i], shape[i+1], width/2 ) );
		vertices.push( new THREE.Vector3( shape[i], shape[i+1], -width/2 ) );
	}

	// build the 3D shape
	var image = new THREE.Mesh(new ConvexGeometry( vertices ), MATERIAL.clone() ); 
		image.receiveShadow = true;
		image.castShadow = true;
		
	// add edges (for visual effect)
	image.add( new THREE.LineSegments(
				new THREE.EdgesGeometry( image.geometry ),
				EDGE_MATERIAL
			) );
			
	return image;
}





class EdgedFinger extends Part
{
	constructor ( length=1.0, width=0.3, thickness=0.3 )
	{
		super( );
		
		// profile shape (2D)
		var L = length,
			T = thickness/2,
			I = Math.min( length, thickness ) / 8,
			W = width,
			E = 0.003;
			
		var shape = [
				-T,   I -L/2,
				-T+I, E -L/2,
				 0,   E -L/2,
				 T,   T -L/2,
				 T,   L-T-E -L/2,
				 0,   L-E -L/2,
				-T+I, L-E -L/2,
				-T,   L-I  -L/2];
		
		// create main mesh
		this.mainMesh = extrudeShape(shape,width);
		this.mainMesh.position.y = length/2;
		var overMesh = new THREE.Group();
		overMesh.add( this.mainMesh );
		this.add( overMesh );
		
		this.addSlot( 0, length, 0 );
		
		// 3D convex shape
		var vertices = [
							[ -T,   I -L/2,      W/2 ],
							[ -T+I, E -L/2,      W/2 ],
							[  0,   E -L/2,      W/2 ],
							[  T,   T -L/2,  	 W/2 ],
							[  T,   L-T-E -L/2,  W/2 ],
							[  0,   L-E -L/2,    W/2 ],
							[ -T+I, L-E -L/2,    W/2 ],
							[ -T,   L-I -L/2,    W/2 ],

							[ -T,   I -L/2,     -W/2 ],
							[ -T+I, E -L/2,     -W/2 ],
							[  0,   E -L/2,     -W/2 ],
							[  T,   T -L/2,  	-W/2 ],
							[  T,   L-T-E -L/2, -W/2 ],
							[  0,   L-E -L/2,   -W/2 ],
							[ -T+I, L-E -L/2,   -W/2 ],
							[ -T,   L-I -L/2,   -W/2 ]
						];
						
		var faces = [
						[0,1,2,3,4,5,6,7],
						[15,14,13,12,11,10,9,8],
						[0,8,9,1],
						[1,9,10,2],
						[2,10,11,3],
						[3,11,12,4],
						[4,12,13,5],
						[5,13,14,6],
						[6,14,15,7],
						[7,15,8,0]
					];
		
		// physics
		this.physics = PHYSICS.convex( vertices, faces );
		this.physics.threejs = this;
		this.debugConvex( vertices, faces );

		
		PHYSICS.bodies.push( this );

	} // EdgedFinger.constructor

	
} // EdgedFinger



class EdgedTip extends Part
{
	constructor ( length=1.0, width=0.3, thickness=0.3 )
	{
		super( );
		
		// profile shape (2D)
		var L = length,
			T = thickness/2,
			I = Math.min( length, thickness ) / 8,
			W = width,
			E = 0.003;
			
		var shape = [
				-T,   I -L/2,
				-T+I, E -L/2,
				 0,   E -L/2,
				 T,   T -L/2,
				 T,   L-I-E -L/2,
				 T-I, L-E -L/2,
				-T+I, L-E -L/2,
				-T,   L-I -L/2 ];
		
		// create main mesh
		this.mainMesh = extrudeShape(shape,width);
		this.mainMesh.position.y = length/2;
		var overMesh = new THREE.Group();
		overMesh.add( this.mainMesh );
		this.add( overMesh );

		this.addSlot( 0, length, 0 );

		// 3D convex shape
		var vertices = [
							[ -T,   I -L/2,      W/2 ],
							[ -T+I, E -L/2,      W/2 ],
							[  0,   E -L/2,      W/2 ],
							[  T,   T -L/2,      W/2 ],
							[  T,   L-I-E -L/2,  W/2 ],
							[  T-I, L-E -L/2,    W/2 ],
							[ -T+I, L-E -L/2,    W/2 ],
							[ -T,   L-I -L/2,    W/2 ],
						
							[ -T,   I -L/2,     -W/2 ],
							[ -T+I, E -L/2,     -W/2 ],
							[  0,   E -L/2,     -W/2 ],
							[  T,   T -L/2,     -W/2 ],
							[  T,   L-I-E -L/2, -W/2 ],
							[  T-I, L-E -L/2,   -W/2 ],
							[ -T+I, L-E -L/2,   -W/2 ],
							[ -T,   L-I -L/2,   -W/2 ],
						];
						
		var faces = [
						[0,1,2,3,4,5,6,7],
						[15,14,13,12,11,10,9,8],
						[0,8,9,1],
						[1,9,10,2],
						[2,10,11,3],
						[3,11,12,4],
						[4,12,13,5],
						[5,13,14,6],
						[6,14,15,7],
						[7,15,8,0]
					];
		
		
		// physics
		this.physics = PHYSICS.convex( vertices, faces );
		this.physics.threejs = this;
		this.debugConvex( vertices, faces );
		
		PHYSICS.bodies.push( this );

	} // EdgedTip.constructor
	
} // EdgedTip



class EdgedPalm extends Part
{
	constructor ( left, length=1.4, width=1.4, thickness=0.3 )
	{
		super( );
		
		// profile shape (2D)
		var L = length,
			W = width/2,
			I = width/8,
			T = thickness,
			S = left?1:-1;
			
		var shape = [
				-S*W+S*I,   0,		// 0
				 S*W-2*S*I, 0,		// 1
				 S*W,     2*I,		// 2
				 S*W,       L,		// 3
				-S*W,       L,		// 4
				-S*W,     L/2,		// 5
			];
		
		// create main mesh
		this.mainMesh = extrudeShape(shape,thickness);
		this.add( this.mainMesh );
		
		var that = this;
		function addSlot( pointA, pointB, k )
		{
			var xA = shape[2*pointA],
				xB = shape[2*pointB],
				yA = shape[2*pointA+1],
				yB = shape[2*pointB+1];
				
			var slot = that.addSlot( xA*(1-k) + k*xB, yA*(1-k) + k*yB, 0 );
				slot.setRotation( 0, Math.PI/2, (1+S)*Math.PI/2+Math.atan2( yB-yA, xB-xA ), 'ZXY' );
		}
		
		addSlot( 2, 3, 1/4 ); // slot 0
		addSlot( 3, 4, 1/8 ); // slot 1  
		addSlot( 3, 4, 3/8 ); // slot 2
		addSlot( 3, 4, 5/8 ); // slot 3
		addSlot( 3, 4, 7/8 ); // slot 4
		
		// 3D convex shape
		var vertices = [
							[ -S*W+S*I,		0,	 T/2 ],
							[  S*W-2*S*I,	0,	 T/2 ],
							[  S*W,    	  2*I,	 T/2 ],
							[  S*W,      	L,	 T/2 ],
							[ -S*W,      	L,	 T/2 ],
							[ -S*W,    	  L/2,	 T/2 ],

							[ -S*W+S*I,		0,	-T/2 ],
							[  S*W-2*S*I,	0,	-T/2 ],
							[  S*W,  	  2*I,	-T/2 ],
							[  S*W,      	L,	-T/2 ],
							[ -S*W,      	L,	-T/2 ],
							[ -S*W,  	  L/2,	-T/2 ],
						];

		function face( ...vertices )
		{
			if( S > 0 )
				return vertices;
			else
				return vertices.toReversed();
		}
		
		var faces = [
						face(0,1,2,3,4,5),
						face(11,10,9,8,7,6),
						face(0,6,7,1),
						face(1,7,8,2),
						face(2,8,9,3),
						face(3,9,10,4),
						face(4,10,11,5),
						face(5,11,6,0),
					];
		
		// physics
		this.physics = PHYSICS.convex( vertices, faces );
		this.physics.threejs = this;
		this.debugConvex( vertices, faces );
		
		PHYSICS.bodies.push( this );

	} // EdgedPalm.constructor
	
} // EdgedPalm



export { EdgedFinger, EdgedTip, EdgedPalm };