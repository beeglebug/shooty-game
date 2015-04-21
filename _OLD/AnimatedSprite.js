var AnimatedSprite = function( spritesheet ) {
    
    this.spritesheet = spritesheet;
    this.frameNumber = 0;
    this.timer = 0;
    this.animations = {};
    this.fps = 10;
    
    // use first frame for now
    PIXI.Sprite.call( this, this.spritesheet[this.frameNumber] );

    AnimationManager.register(this);
    
};

AnimatedSprite.prototype = Object.create(PIXI.Sprite.prototype);

AnimatedSprite.prototype.addAnimation = function( name, frames ) {

    this.animations[ name ] = frames;

};


AnimatedSprite.prototype.update = function(delta) {

    if(!this.playing) { return; }
    
    this.timer += delta;
    
    while( this.timer > 1000 / this.fps ) {
        
        this.frameNumber += 1;
        
        if(this.frameNumber >= this.currentAnimation.length) {
            if(this.loop) {
                this.frameNumber = 0;
            } else {
                if(this.callback) {
                    this.callback();
                }
                this.frameNumber = this.currentAnimation.length - 1;
                this.playing = false;
            }
        }
        
        this.frame = this.spritesheet[ this.currentAnimation[this.frameNumber] ];
    
        this.setTexture(this.frame);
        
        this.timer -= 1000 / this.fps;
        
    }
    
};


AnimatedSprite.prototype.play = function(animation, fps) {
  
    this.loop = true;
    this._playAnimation( animation, fps );
    
};


AnimatedSprite.prototype.playOnce = function(animation, fps, callback) {
  
    this.callback = callback;
    this.loop = false;
    this._playAnimation( animation, fps );
    
};

AnimatedSprite.prototype._playAnimation = function( animation, fps ) {

    if(fps) { this.fps = fps; }
    
    this.currentAnimation = this.animations[animation];    
    this.frameNumber = 0;
    this.playing = true;
    
    this.frame = this.spritesheet[ this.currentAnimation[this.frameNumber] ];
    this.setTexture(this.frame);
    
};









var AnimationManager = {
 
    sprites : [],
    
    register : function(sprite) {
    
        this.sprites.push(sprite);
    
    },
    
    update : function(delta) {
     
        this.sprites.forEach(function(sprite) {
           
            sprite.update(delta);
            
        });
        
    }
    
}













