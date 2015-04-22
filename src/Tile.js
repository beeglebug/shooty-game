var PIXI = require('pixi.js');
var Rect = require('js-game-lib').Rect;
var Sprite = PIXI.Sprite;

/**
 * a map tile
 */
var Tile = function( type, texture, x, y, width, height) {

	this.type = type;

	this.sprite = new Sprite( texture );
	this.sprite.x = x * width;
	this.sprite.y = y * height;

    this.x = x;
    this.y = y;

	//this.shape = new Rect( width, height, x * width, y * height);

    this.collidable = false;
};

module.exports = Tile;