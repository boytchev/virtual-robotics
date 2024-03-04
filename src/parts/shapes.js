
//
//	Shapes for Virtual robotics
//
//	class Ball( radius=1.0, color='dimgray' )
//  class Box ( sizex=1.0, sizey=1.0, sizez=1.0, color='dimgray' )
//  class Label ( text='', sizex=1.0, sizey=1/4, color='white' )
//  class Graph ( sizex=1.0, sizey=1/4, color='white' )


import * as THREE from "../../libs/three.module.min.js";
import { Part } from "../part.js";
import { getScene } from "../scene.js";
import * as PHYSICS from "../physics.js";
import { OPTION_TOUCH_COLOR } from "../global.js";



//

class Ball extends Part
{
	constructor ( radius=1.0, color='dimgray' )
	{
		super( );
		
		this.mainMesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( radius, 10 ),
			new THREE.MeshLambertMaterial( {
					color: color,
					emissive: OPTION_TOUCH_COLOR,
					emissiveIntensity: 0,
				} )
		);
		this.mainMesh.receiveShadow = true;
		this.mainMesh.castShadow = true;

		this.add( this.mainMesh );
		
		// physics
		this.physics = PHYSICS.ball( radius );
		this.physics.threejs = this;
		
		PHYSICS.bodies.push( this );
		getScene().add( this );

	} // Ball.constructor
	
} // Ball


class Box extends Part
{
	constructor ( sizex=1.0, sizey=1.0, sizez=1.0, color='dimgray' )
	{
		super( );
		
		this.mainMesh = new THREE.Mesh(
			new THREE.BoxGeometry( sizex, sizey, sizez ),
			new THREE.MeshLambertMaterial( {
				color: color,
				emissive: OPTION_TOUCH_COLOR,
				emissiveIntensity: 0,
			} )
		);
		this.mainMesh.receiveShadow = true;
		this.mainMesh.castShadow = true;
		
		this.add( this.mainMesh );
		
		
		// physics
		this.physics = PHYSICS.box( sizex, sizey, sizez );
		this.physics.threejs = this;

		PHYSICS.bodies.push( this );
		getScene().add( this );

	} // Box.constructor
	
} // Box


class Label extends Part
{
	constructor ( text='', sizex=1.0, sizey=1/4, color='white' )
	{
		super( );
		
		this.canvas = document.createElement( 'CANVAS' );
		this.context = this.canvas.getContext( '2d' );
		
		this.canvas.width = 512;
		this.canvas.height = this.canvas.width/4;

		var texture = new THREE.CanvasTexture( this.canvas );
			texture.anisotropy = getScene().renderer.capabilities.getMaxAnisotropy( );
			
		this.mainMesh = new THREE.Mesh(
			new THREE.PlaneGeometry( sizex, sizey ),
			new THREE.MeshLambertMaterial( {
				color: color,
				side: THREE.DoubleSide,
				map: texture,
			} )
		);
		this.mainMesh.receiveShadow = true;
		this.mainMesh.castShadow = true;
		
		this.setText( text );
		
		this.add( this.mainMesh );
		
		getScene().add( this );

	} // Label.constructor
	
	setText( text, x=10, y=10, font='bold 48px Arial' )
	{
		this.context.fillStyle = 'white';
		this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
		
		this.context.strokeStyle = 'black';
		this.context.strokeRect( 0, 0, this.canvas.width, this.canvas.height );

		this.context.fillStyle = 'black';
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
		
		this.mainMesh.material.map.needsUpdate = true;
	}
	
	addText( text, x=10, y=10, font='bold 48px Arial' )
	{
		this.context.fillStyle = 'black';
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
		
		this.mainMesh.material.map.needsUpdate = true;
	}
	
} // Label



class Graph extends Part
{
	constructor ( text, sizex=1.0, sizey=1/2, color='white' )
	{
		super( );
		
		this.canvas = document.createElement( 'CANVAS' );
		this.context = this.canvas.getContext( '2d' );
		
		this.canvas.width = 1024;
		this.canvas.height = THREE.MathUtils.floorPowerOfTwo( 1024 * sizey/sizex );

		this.text = text;
		this.gridX = 10;
		this.gridY = 5;
		this.axisX = null;
		this.axisY = null;
		this.graphs = [];
		
		var texture = new THREE.CanvasTexture( this.canvas );
			texture.anisotropy = getScene().renderer.capabilities.getMaxAnisotropy( );
			
		this.mainMesh = new THREE.Mesh(
			new THREE.PlaneGeometry( sizex, sizey ),
			//new THREE.MeshLambertMaterial( {
			new THREE.MeshBasicMaterial( {
				color: color,
				side: THREE.DoubleSide,
				map: texture,
			} )
		);
		this.mainMesh.receiveShadow = true;
		this.mainMesh.castShadow = true;
		
		this.#redraw( );
		
		this.add( this.mainMesh );
		
		getScene().add( this );

	} // Graph.constructor
	
	setGrid( gridX, gridY, axisX, axisY )
	{
		this.gridX = gridX;
		this.gridY = gridY;
		this.axisX = axisX;
		this.axisY = axisY;
		this.#redraw( );
	}
	
	setText( text )
	{
		this.text = text;
		this.#redraw( );
	}
	
	setGraph( index, data, color='RoyalBlue', minX=-this.axisX, maxX=this.gridX-this.axisX, minY=-this.axisY, maxY=this.gridY-this.axisY )
	{
		// data = [{x:...,y:...}, ...]
		this.graphs[index] = {data: data, color: color, minX: minX, maxX: maxX, minY: minY, maxY: maxY}
		this.#redraw( );
	} // Graph.setGraph
	
	addData( index, x, y )
	{
		if( this.graphs[index] === undefined ) return;
		
		// record the new data
		this.graphs[index].data.push( {x:x, y:y} );
		
		// shift the graph window to the right
		var dX = x - this.graphs[index].maxX;
		if( dX > 0 )
		{
			this.graphs[index].minX += dX;
			this.graphs[index].maxX += dX;
			
			// remove extra data
			while( (this.graphs[index].data.length > 2) &&
			       (this.graphs[index].data[1].x < this.graphs[index].minX) ) 
			  this.graphs[index].data.shift();
		}
		
		this.#redraw( );
	} // Graph.addData
	
	#redraw( )
	{
		// clear
		this.context.fillStyle = 'white';
		this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
		
		// label
		this.context.fillStyle = 'black';
		this.context.font = '40px Arial';
		this.context.fillText( this.text, 10, 45 );

		// grid
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 1;
		this.context.beginPath( );
		for( var i=1; i<this.gridX; i++ )
		{
			var x = Math.round( this.canvas.width * i/this.gridX );
			
			this.context.moveTo( x, 60 );
			this.context.lineTo( x, this.canvas.height );
		}
		for( var i=1; i<this.gridY+1; i++ )
		{
			var y = this.canvas.height - Math.round( (this.canvas.height-60) * i/this.gridY );
			
			this.context.moveTo( 0, y );
			this.context.lineTo( this.canvas.width, y );
		}
		this.context.stroke( );

		// axes
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 3;
		this.context.beginPath( );
		if( this.axisX )
		{
			var x = Math.round( this.canvas.width * this.axisX/this.gridX );
			
			this.context.moveTo( x, 60 );
			this.context.lineTo( x, this.canvas.height );
		}
		if( this.axisY )
		{
			var y = this.canvas.height - Math.round( (this.canvas.height-60) * this.axisY/this.gridY );
			
			this.context.moveTo( 0, y );
			this.context.lineTo( this.canvas.width, y );
		}
		this.context.stroke( );
			
		// graphs
		for( var graph of this.graphs )
		{
			if( graph.data.length == 0 ) continue;

			this.context.strokeStyle = graph.color;
			this.context.lineWidth = 5;
			this.context.beginPath( );
			for( var i=0; i<graph.data.length; i++ )
			{
				var x = THREE.MathUtils.mapLinear( graph.data[i].x, graph.minX, graph.maxX, 0, this.canvas.width ),
					y = THREE.MathUtils.mapLinear( graph.data[i].y, graph.minY, graph.maxY, this.canvas.height, 60 );

				if( i==0 )
					this.context.moveTo( x, y );
				else
					this.context.lineTo( x, y );
			}
			this.context.stroke( );
		}


		// frame
		this.context.strokeStyle = 'black';
		this.context.strokeRect( 0, 0, this.canvas.width, this.canvas.height );


		this.mainMesh.material.map.needsUpdate = true;
	} // Graph.#redraw
	
} // Graph


export { Ball, Box, Label, Graph };