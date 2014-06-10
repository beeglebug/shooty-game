// causes a frame rate dip?
function flashSpriteWhite(sprite, length, callback) {
	
	sprite.filters = [whiteFilter];
	setTimeout(function(){
		sprite.filters = null;
        callback();
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


function aaaiii(entity) {

    // choose highest priority target
    // for now will just get the player every time
    // if i add multiple factions it may get expanded
    // @todo expand
    var possibleTargets = getTargetsInRange(entity);

    if(possibleTargets.length > 0) {
    
        var target = possibleTargets[0];
    
        for( var i = 1; i < possibleTargets.length; i++) {
            // compare to current target and decide if more important
        }
    
        setTarget(entity, target);
    }
    
};

function getTargetsInRange(entity) {

    // @todo get all possible targets properly
    var possible = [player];
    
    var targets = [];
    
    var detectionRange = 20;
    
    for( var i = 0; i < possible.length; i++)
    {    
        if( entity.position.distanceTo( possible[i].position ) < detectionRange ) {
            targets.push( possible[i] );
        }
    }
    
    return targets;
};

function setTarget(entity, target) {
    
    console.log(target);
}
