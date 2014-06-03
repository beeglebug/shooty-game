
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