var Bullet = function( position, target, speed ) {
  
    Entity.call(this);
    
    this.sprite = PIXI.Sprite.fromImage( 'assets/bullet.png' );
	this.sprite.anchor.set(0.5, 0.5);
    
    this.position.set( position.x, position.y );
    
    this.shape = new Rect( 4, 4 );
    
    // @todo dont waste an object
    this.velocity = target._subtract( position )
	                           .normalize()
	                           .multiply( speed );
	
	this.sprite.rotation = this.velocity.toRadians();
	
    this.on('BULLET_COLLIDE_ENEMY', function( enemy, response ) {
    
        this.die();

    });
        
};

Bullet.prototype = Object.create(Entity.prototype);
    
Bullet.prototype.die = function() {
 
    // @todo set group somewhere
    this.group = bullets;
    
    this.group.remove(this);
        
    if(this.sprite.parent) {
        this.sprite.parent.removeChild( this.sprite );
    }
    
}