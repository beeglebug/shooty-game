var Entity = function() {
	
	EventEmitter.call(this);
    
    this.position = new Vector2();
    this.velocity = new Vector2();
    
    this.mobile = true;
    
};

Entity.prototype = Object.create(EventEmitter.prototype);




Entity.prototype.update = function() {

    if(this.mobile) {
    
	   this.position.add( this.velocity );

        if(this.shape) {
     
            this.shape.position.set( this.position.x, this.position.y );
        
        }
        
    }
    
};






// sync shape and sprite
Entity.prototype._beforeRender = function() {

	this.sprite.position.set(
		this.shape.position.x ,
		this.shape.position.y
	);
	
};