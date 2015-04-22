var Rect = require('js-game-lib').Rect;
var PIXI = require('pixi.js');
var Tile = require('./Tile');


/**
 * a single tile map layer
 * @todo extend sprite instead of being seperate
 */
var MapLayer = function(json, tileset, tileWidth, tileHeight) {

	this.data = json.data;
	this.width = json.width;
	this.height = this.data.length / this.width;
	this.tileset = tileset;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    
	this._collidables = [];
	
	// a rectangle encompassing the map layer
	this.shape = new Rect(
		this.width * this.tileWidth,
		this.height * this.tileHeight
	);
	
	// the container for the tile sprites is never attached to the stage so we control when it renders
	this.container = new PIXI.DisplayObjectContainer();
	
	this.tiles = [];
	
	// the render texture which the layer is drawn to
	this.texture = new PIXI.RenderTexture( this.width * this.tileWidth, this.height * this.tileHeight );
	
	// the sprite which is attached to the map
	this.sprite = new PIXI.Sprite( this.texture );

	this.generateTiles();
	
	this.render();
	
};


/**
 * generate the map tiles
 */
MapLayer.prototype.generateTiles = function() {
	
	var x, y, i, type, tile;

    var offset = this.tileset.ixOffset;
    
	for ( y = 0; y < this.height; y++ ) {
		
		for ( x = 0; x < this.width; x++ ) {

			i = x + (y * this.width);
			type = this.data[i];
			
			// 0 tile is a gap
			if ( type == 0 ) {
                
                tile = null;
            
            } else {
            
                tile = new Tile(
                    type,
                    this.tileset.textures[ type - offset ],
                    x,
                    y
                );
			
                this.container.addChild( tile.sprite );
            
            }
            
			this.tiles.push(tile);
			
		}
		
	}
	
};


/**
 * render the current state
 */
MapLayer.prototype.render = function() {

	this.texture.render( this.container );
	
};


/**
 * resets the collidables array and fills it with
 * rects for all sprites which match one of the passed types
 */
MapLayer.prototype.setCollidable = function(collidable) {
	
	var i, len, tile;
	
	this._collidables = [];

	for ( i = 0, len = this.tiles.length; i < len; i++ ) {

		tile = this.tiles[i];
		
        // null tiles
        if(!tile) { continue; }
        
		if ( collidable.indexOf( tile.type ) < 0 ) { continue; }
	
        tile.collidable = true;
        
		this._collidables.push( tile );
		
	}

};

MapLayer.prototype.getCollidable = function() {
	
	return this._collidables;
	
};

module.exports = MapLayer;