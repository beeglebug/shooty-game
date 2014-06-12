
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
    
        // run away from target
        // var direction = entity.position._subtract(target.position).normalise();
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
            targets.push( possible[i] );
        }
    }
    
    return targets;
};


















