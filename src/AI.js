var AI = {
    
    behaviours : {
     
        moveTowardsTarget : function(target) {
         
            this.velocity.set(
                target.position.x - this.position.x,
                target.position.y - this.position.y
            ).normalize();
            
        },
        
        stayAtDistanceFromTarget : function(target, distance) {
         
            var dx = Math.abs(target.position.x - this.position.x);
            var dy = Math.abs(target.position.y - this.position.y);
                    
            if ( dx * dy > distance * distance ) {
            
                this.velocity.set(
                    target.position.x - this.position.x,
                    target.position.y - this.position.y
                ).normalize();
                
            } else {
                
                this.velocity.zero();
                
            }
            
        }
                
    }
    
    
}