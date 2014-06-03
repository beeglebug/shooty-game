var Physics = {};

/**
 * keep rect1 inside rect2
 */
Physics.constrainRectRect = function( rect1, rect2 ) {

	var collision = false;
	
	// left
	if( rect1.position.x < rect2.position.x ) {
		collision = true;
		rect1.position.x = rect2.position.x;
	}
	
	// top
	if( rect1.position.y < rect2.position.y ) {
		collision = true;
		rect1.position.y = rect2.position.y;
	}
	
	// right
	if( rect1.position.x + rect1.width > rect2.position.x + rect2.width ) {
		collision = true;
		rect1.position.x = rect2.position.x + rect2.width - rect1.width;
	}
	
	// bottom
	if( rect1.position.y + rect1.height > rect2.position.y + rect2.height ) {
		collision = true;
		rect1.position.y = rect2.position.y + rect2.height - rect1.height;
	}
	
	if( collision ) {
		//rect1.emit('collision', rect1, rect2 );
		//rect2.emit('collision', rect1, rect2 );
	}
	
};


Physics.collideRects = function( entity, entities, event ) {

	var i, len, collision,
		response = new CollisionResponse();
	
	for ( i = 0, len = entities.length; i < len; i++ ) {
	
		collision = Collision.rectRect( entity.shape, entities[i].shape, response );

		if(collision) {

			// emit events
			entity.emit( event, entities[i], response );
			entities[i].emit( event, entity, response );

		}
		
	}
	
};









Physics.sortByDistanceTo = function(target) {

	return function(a, b) {
		
		var distanceA = a.shape.center.distanceTo(target);
		var distanceB = b.shape.center.distanceTo(target);
		
		return distanceA - distanceB;

	}

};
