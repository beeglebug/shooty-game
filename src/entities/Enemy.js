var Enemy = function( x, y ) {
  
    Entity.call(this);

    this.sprite = PIXI.Sprite.fromImage( 'assets/enemy.png' );
	this.sprite.anchor.set(0, 0.5);
    
    this.position.set( x, y )
	this.shape = new Rect(16, 8);
    
    this.on( 'BULLET_COLLIDE_ENEMY', function( bullet, response ) {
        
        // @todo stun for a second
        this.mobile = false;
        
        this.position.add( bullet.velocity );
	
        camera.shake(3,200);
        
        flashSpriteWhite( this.sprite, 100, function() {

            // die
            this.die();
            
        }.bind(this) );
        
	});

    this.on( 'ENEMY_COLLIDE_WALL', function( wall, response ) {

        this.position.add( response.mtd );
        this.shape.position.set( this.position.x, this.position.y );
	
    });
    
};

Enemy.prototype = Object.create(Entity.prototype);


Enemy.prototype.doAI = function() {
     
    AI.behaviours.moveTowardsTarget.call(this, player);
    //AI.behaviours.stayAtDistanceFromTarget.call(this, player, 50);
        
};


// @todo possibly move to Entity?
Enemy.prototype.die = function() {
 
    // @todo set group somewhere
    this.group = enemies;
    
    this.group.remove(this);
        
    if(this.sprite.parent) {
        this.sprite.parent.removeChild( this.sprite );
    }
    
}