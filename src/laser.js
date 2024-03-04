
//	Laser API
//	Virtual Robotics 1.0
//
//	class Laser( color ) extends THREE.Group
//
//	set( start, end )


import * as THREE from "../libs/three.module.min.js";
import { laserDotTexture } from "./textures.js";


class Laser extends THREE.Group
{
	constructor( color )
	{
		super( );
		
		var laserPointer = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints([new THREE.Vector3,new THREE.Vector3]),
			new THREE.LineBasicMaterial( {
					color: color,
					transparent: true,
					opacity: 0.5,
				} )
		);
		laserPointer.name = 'Laser.Pointer';
		this.attrPos = laserPointer.geometry.getAttribute( 'position' );

		var laserPoint = new THREE.Points(
			laserPointer.geometry,
			new THREE.PointsMaterial( {
					color: color,
					size: 8,
					sizeAttenuation: false,
					transparent: true,
					map: laserDotTexture
				} )
		);
		laserPoint.name = 'Laser.Point';

		this.add( laserPointer, laserPoint );

		this.frustumCulled = false;
		laserPointer.frustumCulled = false;
		laserPoint.frustumCulled = false;
		
		this.visible = false;
	}

	set( start, end )
	{
		this.visible = true;
		this.attrPos.setXYZ( 0, start.x, start.y, start.z );
		this.attrPos.setXYZ( 1, end.x, end.y, end.z );
		this.attrPos.needsUpdate = true;
	}
}


export { Laser };