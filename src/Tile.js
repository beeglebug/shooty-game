var PIXI = require('pixi.js');
var Rect = require('js-game-lib').Rect;
var Sprite = PIXI.Sprite;

/**
 * a map tile
 */
var Tile = function( type, texture, x, y) {

	this.type = type;
	
	this.sprite = new Sprite( texture );
	this.sprite.position.x = x * this.sprite.width;
	this.sprite.position.y = y * this.sprite.height;
	
    this.x = x;
    this.y = y;
    
	this.shape = new Rect( this.sprite.width, this.sprite.height, this.sprite.position.x, this.sprite.position.y);
	
    this.collidable = false;
};

module.exports = Tile;