var Bullet = function( position, target, speed ) {
  
    Entity.call(this);
    
    this.sprite = PIXI.Sprite.fromImage( 'assets/bullet.png' );
	this.sprite.anchor.set(0.5, 0.5);
    
    this.position.set( position.x, position.y );
    
    this.shape = new Rect( 4, 4 );
    
    this.damage = 10;
    
    // @todo dont waste an object
    this.velocity = target._subtract( position )
	                           .normalize()
	                           .multiply( speed );
	
	this.sprite.rotation = this.velocity.toRadians();
	
    this.addEventListener('BULLET_COLLIDE_ENEMY', function( enemy, response ) {
    
        this.die();

        var pop = new AnimatedSprite( makeSpriteSheet( PIXI.TextureCache['assets/bullet-hit.png'], 16, 16) );
        pop.addAnimation( 'pop', [0,1,2,3] );
        pop.anchor.set(0.5,0.5)
    
        entityLayer.addChild(pop);
        
        pop.position.set(this.position.x, this.position.y);
        
        pop.visible = true;
        
        pop.playOnce('pop', 24, function() {
            pop.visible = false;
            entityLayer.removeChild(pop);
        });
        
    });
    
    this.addEventListener('BULLET_COLLIDE_WALL', function( enemy, response ) {
    
        this.die();

        var pop = new AnimatedSprite( makeSpriteSheet( PIXI.TextureCache['assets/bullet-hit.png'], 16, 16) );
        pop.addAnimation( 'pop', [0,1,2,3] );
        pop.anchor.set(0.5,0.5)
    
        entityLayer.addChild(pop);
        
        pop.position.set(this.position.x, this.position.y);
        
        pop.visible = true;
        
        pop.playOnce('pop', 24, function() {
            pop.visible = false;
            entityLayer.removeChild(pop);
        });
        
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