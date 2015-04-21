
/**
 * NEW AI TESTS
 */


function aaaiii(entity) {

    // choose highest priority target
    // for now will just get the player every time
    // if i add multiple factions it may get expanded
    // @todo expand
    var range = 150;
    var possibleTargets = getTargetsInRange(entity, range);

    if(possibleTargets.length > 0) {
    
        var target = possibleTargets[0];
    
        for( var i = 1; i < possibleTargets.length; i++) {
            // compare to current target and decide if more important
        }
    
        // go towards target
        var direction = target.position._subtract(entity.position).normalise();
    
        entity.velocity.set( direction.x, direction.y );
    }
    
};

function getTargetsInRange(entity, range) {

    // @todo get all possible targets properly
    var possible = [player];
    
    var targets = [];
    
    for( var i = 0; i < possible.length; i++)
    {    
        if( entity.position.distanceTo( possible[i].position ) < range ) {
            
            // now test for line of sight
            var clear = checkLineOfSight(entity.position, player.position);
            
            if(clear) {
                targets.push( possible[i] );
            }
        }
    }
    
    return targets;
};

function checkLineOfSight(from, to)
{ 
    var ray = new Line();

    ray.start.set(from);
    ray.end.set(to);

    toTile(ray.start);
    toTile(ray.end);

    var path = ray.rasterize();

    for( var i = 0; i < path.length; i++) {
        
        if(Game.map.getCollidable( path[i].x, path[i].y ) ) {
            // something blocking line of sight
            return false;
        }
        
    }
    
    return true;
}


function toTile(pos) {
    
    var tilesize = 16;
    
    pos.x = Math.floor(pos.x / tilesize);
	pos.y = Math.floor(pos.y / tilesize);
}
















