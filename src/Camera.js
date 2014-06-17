var Camera = function(width, height, world) {
	
	Rect.call(this, width, height);

	this.world = world;
	this.container = new PIXI.DisplayObjectContainer();	
    
    // for positioning
	this.target = null;

    this.focalPoint = new Vector2();
    this.offset = new Vector2();

    // shake variables
    this.shakeOffset = new Vector2();
	this.shaking = false;
    this.shakeMagnitude = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    
    // for shaking randomly
    this.rng = new RNG();
    
};

Camera.prototype = Object.create(Rect.prototype);


/**
 * center on an object
 */
Camera.prototype.setTarget = function(target) {
	
	this.target = target;
    
    this.focalPoint.set( this.target.position.x, this.target.position.y );
    
	this.offset.set(
		( this.width / 2 ) - ( target.shape.width / 2 ),
		( this.height / 2 ) - ( target.shape.height / 2 )
	)

};


/**
 * lock the camera to this rect
 */
Camera.prototype.setBounds = function(rect) {
    
    this.bounds = rect;
    
};


/**
 * calculate the camera position this frame
 */
Camera.prototype.update = function(delta) {

    // handle camera shake
    if ( this.shaking ) {

        this.shakeTimer += delta;

        // finished shaking
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
    
    /*
    var target = this.target.position._add( this.target.velocity._multiply(20) );

    if( this.focalPoint.near( target ) ) {

        this.focalPoint.set(target.x, target.y);
        
    } else {

        var diff = target._subtract(this.focalPoint);
        diff.normalise().multiply(2);
        this.focalPoint.add(diff);
        
    }
    */
    
    var cursor = input.mouse.worldPosition;
    var diff = cursor._subtract(player.position).divide(5);
    
    this.focalPoint.set(
        this.target.position.x + diff.x,
        this.target.position.y + diff.y
    );
    
    
	this.position.set(
		this.focalPoint.x * Game.scale - this.offset.x,
		this.focalPoint.y * Game.scale - this.offset.y
	);
    
    
    if(this.bounds) {
        // keep inside a rect
        //Physics.constrainRectRect(this, this.bounds);
    }

    // add the shake last so it will still shake even if locked
    this.position.add( this.shakeOffset );
    
    // translate world (to simulate camera)
	this.world.position.x = -this.position.x;
	this.world.position.y = -this.position.y;
	
};


/**
 * trigger a camera shake
 */
Camera.prototype.shake = function(magnitude, duration) {
  
    this.shaking = true;
    this.shakeMagnitude = magnitude;
    this.shakeDuration = duration;
    this.shakeTimer = 0;
    
};