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




