var PIXI = require('pixi.js');
var Texture = PIXI.Texture;

var Tileset = function( json ) {

    var url = 'assets/' + json.image;

    var loader = new PIXI.ImageLoader(url);

    loader.on('loaded', function(){

        var texture, x, y;

        for ( y = 0; y < this.baseTexture.height; y += this.tileHeight ) {

            for ( x = 0; x < this.baseTexture.width; x += this.tileWidth ) {

                texture = new Texture( this.baseTexture );

                texture.frame.width = this.tileWidth;
                texture.frame.height = this.tileHeight;
                texture.frame.x = x;
                texture.frame.y = y;

                this.textures.push(texture);
            }

        }

    }.bind(this));

    this.baseTexture = loader.texture;

    this.tileWidth = json.tilewidth;
    this.tileHeight = json.tileheight;
    this.ixOffset = json.firstgid;

    this.textures = [];

    loader.load();
};

module.exports = Tileset;