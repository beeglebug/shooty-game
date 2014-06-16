var Entity = function() {
	
	EventEmitter.call(this);
    
    this.position = new Vector2();
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
    
    this.minVelocity = new Vector2(-2, -2);
    this.maxVelocity = new Vector2(2, 2);
    
    this.mobile = true;
    
};

Entity.prototype = Object.create(EventEmitter.prototype);


Entity.prototype.update = function() {

    if(this.mobile) {
        
        this.velocity.add(this.acceleration);
        
        this.velocity.clamp( this.minVelocity, this.maxVelocity );
        
        this.position.add( this.velocity );
        
        this.velocity.multiply( this.getFriction() );
        
        this.updateShape();
        
    }    
};


Entity.prototype.getFriction = function() {
    return 0.8;
};

Entity.prototype.updateShape = function() {

    if(!this.shape) { return; }
    
    this.shape.position.set( this.position.x, this.position.y );
    
};






// sync shape and sprite
Entity.prototype._beforeRender = function() {

	this.sprite.position.set(
		this.shape.position.x,
		this.shape.position.y
	);
	
};