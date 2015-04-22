var PIXI = require('pixi.js');
var Texture = PIXI.Texture;
var EventEmitter = require('events').EventEmitter;
var util = require('util')

var Tileset = function( json ) {

    EventEmitter.call(this);

    var url = 'assets/' + json.image;

    var loader = new PIXI.ImageLoader(url);

    loader.on('loaded', function(){

        var texture, x, y, i = 0;

        // reset frames now we have the image loaded
        for ( y = 0; y < json.imageheight; y += json.tileheight ) {

            for ( x = 0; x < json.imagewidth; x += json.tilewidth ) {

                texture = this.textures[i++];
                texture.frame.width = json.tilewidth;
                texture.frame.height = json.tileheight;
                texture.frame.x = x;
                texture.frame.y = y;
                // force UV update
                texture.setFrame(texture.frame);
            }

        }


        this.emit('loaded');

    }.bind(this));

    this.baseTexture = loader.texture;
    this.ixOffset = json.firstgid;
    this.textures = [];

    var texture, x, y;

    // create textures (invalid until image loaded)
    for ( y = 0; y < json.imageheight; y += json.tileheight ) {

        for ( x = 0; x < json.imagewidth; x += json.tilewidth ) {

            texture = new Texture( this.baseTexture );

            this.textures.push(texture);
        }

    }

    loader.load();
};

util.inherits(Tileset, EventEmitter);

module.exports = Tileset;