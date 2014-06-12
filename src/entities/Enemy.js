var Enemy = function( x, y ) {
  
    Entity.call(this);

    this.sprite = PIXI.Sprite.fromImage( 'assets/enemy.png' );
	this.sprite.anchor.set(0, 0.5);
    
    this.position.set( x, y )
	this.shape = new Rect(16, 16);
    
    this.health = 50;
    
    this.addEventListener( 'BULLET_COLLIDE_ENEMY', function( bullet, response ) {
        
        this.stun(100);
        
        this.position.add( bullet.velocity );
        
        this.health -= bullet.damage;
        
        if(this.health <= 0) {
        
            flashSpriteWhite( this.sprite, 100, function() {

                // die
                this.die();

            }.bind(this) );
        
        }
        
	});

    this.addEventListener( 'ENEMY_COLLIDE_WALL', function( wall, response ) {

        this.position.add( response.mtd );
        this.shape.position.set( this.position.x, this.position.y );
	
    });
    
};

Enemy.prototype = Object.create(Entity.prototype);


Enemy.prototype.stun = function(duration) {
  
    this.mobile = false;
    
    setTimeout(function(){
        this.mobile = true;
    }.bind(this), duration);
    
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