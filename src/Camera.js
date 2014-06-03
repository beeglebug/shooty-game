var Camera = function(width, height, world) {
	
	Rect.call(this, width, height);

	this.world = world;
	this.container = new PIXI.DisplayObjectContainer();	
	this.target = null;
	this.offset = new Vector2();

    this.shakeOffset = new Vector2();
	this.shaking = false;
    this.shakeMagnitude = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    
    this.rng = new RNG();
    
};

Camera.prototype = Object.create(Rect.prototype);

Camera.prototype.setTarget = function(target) {
	
	this.target = target;
	this.offset.set(
		( this.width / 2 ) - ( target.shape.width / 2 ),
		( this.height / 2 ) - ( target.shape.height / 2 )
	)

};

Camera.prototype.update = function(delta) {

    if ( this.shaking ) {

        this.shakeTimer += delta;

        // done?
        if(this.shakeTimer >= this.shakeDuration) {
         
            this.shaking = false;
            this.shakeOffset.zero();
            
        } else {
        
            // 0 is the start, 1 is done
            var progress = this.shakeTimer / this.shakeDuration;

            // non linear falloff of magnitude based on progress
            var magnitude = this.shakeMagnitude * (1 - (progress * progress));

            // Generate a new offset vector with random values and our magnitude
            this.shakeOffset.set(
                this.rng.randomBetween(-1,1),
                this.rng.randomBetween(-1,1)
            ).multiply(magnitude);
            
        }
        
    }
    
	this.position.set(
		Math.floor( this.target.position.x - this.offset.x + this.shakeOffset.x ),
		Math.floor( this.target.position.y - this.offset.y + this.shakeOffset.y )
	);
    
	this.world.position.x = -this.position.x;
	this.world.position.y = -this.position.y;
	
};


Camera.prototype.shake = function(magnitude, duration) {
  
    this.shaking = true;
    this.shakeMagnitude = magnitude;
    this.shakeDuration = duration;
    this.shakeTimer = 0;
    
};