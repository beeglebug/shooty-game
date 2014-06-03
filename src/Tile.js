/**
 * a map tile
 */
var Tile = function( type, texture, x, y) {
	
	EventEmitter.call(this);
	
	this.type = type;
	
	this.sprite = new PIXI.Sprite( texture );
	this.sprite.position.x = x;
	this.sprite.position.y = y;
	
	this.shape = new Rect( this.sprite.width, this.sprite.height );
	this.shape.position.set( x, y );
	
};

Tile.prototype = Object.create(EventEmitter.prototype);