var AnimatedSprite = function( spritesheet ) {
    
    this.spritesheet = spritesheet;
    this.frameNumber = 0;
    this.timer = 0;
    this.animations = {};
    this.fps = 10;
    
    // use first frame for now
    PIXI.Sprite.call( this, this.spritesheet[this.frameNumber] );

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
  
    this._playAnimation( animation, fps, true );
    
};


AnimatedSprite.prototype.playOnce = function(animation, fps) {
  
    this._playAnimation( animation, fps, false );
    
};

AnimatedSprite.prototype._playAnimation = function( animation, fps, loop ) {

    if(fps) { this.fps = fps; }
    
    this.currentAnimation = this.animations[animation];    
    this.frameNumber = 0;
    this.loop = loop;
    this.playing = true;
    
    this.frame = this.spritesheet[ this.currentAnimation[this.frameNumber] ];
    this.setTexture(this.frame);
    
};

