// causes a frame rate dip?
function flashSpriteWhite(sprite, length, callback) {
	
	sprite.filters = [whiteFilter];
	setTimeout(function(){
		sprite.filters = null;
        if(callback) { callback(); }
	}, length);
}

// creating the filters first seems to stop the frame rate dip
var whiteFilter = new PIXI.ColorMatrixFilter();
whiteFilter.matrix = [255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255];



function testzone() {
 
    if(rect.width < this.width) {
        this.lockX = true;
    }
    
    if(rect.height < this.height) {
        this.lockY = true;   
    }
    
    
    
    
}


PF.Grid.prototype.reset = function() {

    var x, y, xl, yl, node;
    
    for (y = 0, yl = this.nodes.length; y < yl; y++) {
        for (x = 0, xl = this.nodes[y].length; x < xl; x++) {
            node = this.nodes[y][x];
            delete(node.closed);
            delete(node.opened);
            delete(node.f);
            delete(node.g);
        }
    
    }

}



