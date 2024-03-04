
//
//	Virtual Robotics 1.0
//	GLTF part
//
//	class GLTFPart( filename, length=0, callback=undefined )
//
//	recolor( fromColor, toColor, eps=0.01 )
//


import * as THREE from "../../libs/three.module.min.js";
import { GLTFLoader } from "../../libs/loaders/GLTFLoader.js";
import { Part} from "../part.js";
import { OPTION_TOUCH_COLOR } from "../global.js";


var loader = new GLTFLoader();

const GEOMETRY = new THREE.BoxGeometry( 1, 1, 1 );

const MATERIAL = new THREE.MeshPhysicalMaterial({
				color: 'white',
				
				clearcoat: 1.0,
				clearcoatRoughness: 0.0,
				
				metalness: 0.0,
				roughness: 0.0,
	
				specularIntensity: 1,
				specularColor: 'crimson',
				
				emissive: OPTION_TOUCH_COLOR,
				emissiveIntensity: 0,
				
				vertexColors: true,

			});
			
// const MATERIAL = new THREE.MeshBasicMaterial({
				// color: 'green',
				// emissive: OPTION_TOUCH_COLOR,
				// emissiveIntensity: 0,
				// wireframe: true,
				// transparent: true,
				// opacity: 0.1,
				// depthTest: false,
			// });



class GLTFPart extends Part
{
	constructor ( filename, length=0, callback=undefined )
	{
		super( );

		this.mainMesh = new THREE.Mesh( GEOMETRY, MATERIAL.clone() );
		this.mainMesh.castShadow = true;
		this.mainMesh.receiveShadow = true;

		loader.load( filename, gltf => {
			this.mainMesh.geometry = gltf.scene.children[0].geometry;
			this.mainMesh.scale.copy( gltf.scene.children[0].scale );
			if( callback ) callback();
		} );
		
		// create main mesh
		this.mainMesh.position.y = length/2;
		
		var overMesh = new THREE.Group();
		overMesh.add( this.mainMesh );
		this.add( overMesh );
	} // GLTFPart.constructor


	recolor( fromColor, toColor, eps=0.01 )
	{
		var col = this.mainMesh.geometry.getAttribute( 'color' );
	
		if( !col ) return;
		
		for( var i=0; i<col.count; i++ )
		{
			var r = col.getX( i ),
				g = col.getY( i ),
				b = col.getZ( i );
			
			if( Math.abs(r-fromColor[0]) < eps )
			if( Math.abs(g-fromColor[1]) < eps )
			if( Math.abs(b-fromColor[2]) < eps )
			{
				col.setXYZ( i, ...toColor );
			}
		}
		
		col.needsUpdate = true;
	}
	
} // GLTFPart



export { GLTFPart };