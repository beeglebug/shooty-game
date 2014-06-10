var Enemy = function( x, y ) {
  
    Entity.call(this);

    this.sprite = PIXI.Sprite.fromImage( 'assets/pod.png' );
	this.sprite.anchor.set(0, 0.5);
    
    this.position.set( x, y )
	this.shape = new Rect(16, 8);
    
    this.addEventListener( 'BULLET_COLLIDE_ENEMY', function( bullet, response ) {
        
        // @todo stun for a second
        this.mobile = false;
        
        this.position.add( bullet.velocity );
        
        flashSpriteWhite( this.sprite, 100, function() {

            // die
            this.die();
            
        }.bind(this) );
        
	});

    this.addEventListener( 'ENEMY_COLLIDE_WALL', function( wall, response ) {

        this.position.add( response.mtd );
        this.shape.position.set( this.position.x, this.position.y );
	
    });
    
};

Enemy.prototype = Object.create(Entity.prototype);





// @todo possibly move to Entity?
Enemy.prototype.die = function() {
 
    // @todo set group somewhere
    this.group = enemies;
    
    this.group.remove(this);
        
    if(this.sprite.parent) {
        this.sprite.parent.removeChild( this.sprite );
    }
    
}