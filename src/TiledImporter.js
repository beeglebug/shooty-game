var TiledImporter = function() {
    
};


TiledImporter.prototype.parse = function(json) {
    
    var map = {
        
        tilesets : [],
        layers : []
        
    };
    
    var self = this;
    
    json.tilesets.forEach(function(data) {
       
        var tileset = new Tileset( data );
        
        map.tilesets.push(tileset);
        
    });
    
    json.layers.forEach(function(data) {
       
        var tileset = self.determineTileset(data, map.tilesets);
        
        var layer = new MapLayer( data, tileset, json.tilewidth, json.tileheight );
        layer.name = data.name;
        
        if( layer.properties ) {
            if(layer.properties.collision) {
                // add collision
            }
        }
        
        map.layers.push( layer );
        
    });

    return map;
    
};


TiledImporter.prototype.determineTileset = function(layer, tilesets) {
  
    // find largest tiler index
    var i, max = 0;
    
    for( i = 0; i < layer.data.length; i++) {
        if(layer.data[i] > max) { max = layer.data[i]; }
    }
    
    var tileset = tilesets[0];
    
    for( i = 0; i < tilesets.length; i++) {
        
        if(tilesets[i].ixOffset <= max) {
            // might be this one
            tileset = tilesets[i];
        } else {
            // gone over, stick with last one
            break;   
        }
        
    }
    
    return tileset;
    
};