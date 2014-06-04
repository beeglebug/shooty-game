// @todo tileset object again
// needs an offset

var Tileset = function( json ) {
    
    this.baseTexture = PIXI.TextureCache[ 'assets/' + json.image ];
    
    this.tileWidth = json.tilewidth;
    this.tileHeight = json.tileheight;   
    this.ixOffset = json.firstgid;
    
    this.textures = [];
    
    var texture, x, y;

    for ( y = 0; y < this.baseTexture.height; y += this.tileHeight ) {
		
		for ( x = 0; x < this.baseTexture.width; x += this.tileWidth ) {
        
			texture = new PIXI.Texture( this.baseTexture );

			texture.frame.width = this.tileWidth;
			texture.frame.height = this.tileHeight;
			texture.frame.x = x;
			texture.frame.y = y;

			this.textures.push(texture);
		}
	
	}
    
};


function makeSpriteSheet( baseTexture, width, height ) {

	var textures = [],
		texture, x, y;

    for ( y = 0; y < baseTexture.height; y += height ) {
		
		for ( x = 0; x < baseTexture.width; x += width ) {
        
			texture = new PIXI.Texture( baseTexture );

			texture.frame.width = width;
			texture.frame.height = height;
			texture.frame.x = x;
			texture.frame.y = y;

			textures.push(texture);
		}
	
	}
	
	return textures;
	
}