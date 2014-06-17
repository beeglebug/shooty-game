var TiledImporter = function() {
    
    PIXI.EventTarget.call(this);
    
};

TiledImporter.prototype = Object.create(PIXI.EventTarget.prototype);

TiledImporter.prototype.load = function(url) {

    this.loader = new PIXI.JsonLoader(url);
    
    this.loader.addEventListener('loaded', function(evt) {
        
        var map = this.parse( evt.content.json );
        
        Game.mapCache[map.name] = map;
        
        this.dispatchEvent({
            type : 'complete',
            content : map
        });
        
    }.bind(this));
    
    this.loader.load();
    
};


TiledImporter.prototype.parse = function(json) {
    
    var map = {
    
        name : json.properties.name,
        tilesets : [],
        layers : {}
        
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
        
        if( data.properties ) {
            map.properties = data.properties;
            if(data.properties.collision) {
                
                var collidable = data.properties.collision.split(',');
                layer.setCollidable( collidable.map(function (x) { 
                    return parseInt(x); 
                }));
            }
        }
        
        map.layers[layer.name] = layer;
        
    });

    // set up pathfinding
    
    map.pathfindingGrid = new PF.Grid(json.width, json.height);
    
    var solid = map.layers.walls.getCollidable();
    
    solid.forEach(function(tile) {
       
        map.pathfindingGrid.setWalkableAt(tile.x, tile.y, false);
        
    });
    
    map.pathfinder = new PF.AStarFinder({
        allowDiagonal : true,
        dontCrossCorners : true
    });
    
    map.pathfind = function(from, to) {
     
        var path = this.pathfinder.findPath( from.x, from.y, to.x, to.y, this.pathfindingGrid );
        
        return PF.Util.compressPath(path);
        
    }
    
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