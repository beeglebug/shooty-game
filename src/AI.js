

var AiManager = function() {

    this.counter = 0;
    this.interval = 1000;
    
};


AiManager.prototype.update = function(delta) {
    
    this.counter += delta;
    
    while(this.counter > this.interval) {
     
        this.counter -= this.interval;
        
        think();
        
    }
    
};



function think() {
    
    var threat = getThreat();
    
    if(threat) {
 
        if( shouldAttack(threat) ) {
         
            attack(threat);
            
        } else {
         
            // will keep going until the threat is no longer present
            flee(threat);
            
        }
        
    } else {
        
        wander();
        
    }

}


// look for local threats, if more than one, get most pressing
function getThreat() {
 
    var threats = getThreats();
    
    if(threats.length == 1) {
    
        return threats[0];
    
    } else if(threats.length > 1) {
        
        var highest = threats[0];
        
        // find the highest
        for(var i = 1; i < threats.length; i++) {
         
            if( threatLevel(threats[i]) > threatLevel(highest) ) {
                
                highest = threats[i];
            
            }
        
        }
        
        return highest;
        
    }
    
    return false;
    
}

// just ranks player top for now
function threatLevel(target) {
 
    if(target == player) {
     
        return 2;
        
    }
    
    return 1;
    
}



function wander() {
 
    var target = somewhereRandom();
    
    this.setTarget(target);
    
}

function flee(target) {
 
    var direction = opposite(target);
    
    this.velocity = direction.normalise();
    
}

function shouldAttack(target) {
 
    // dont bother if I have been too badly hurt
    // warning is set to 0 for stupid enemies
    if(this.health < this.healthWarningLevel) {
     
        return false;
        
    }
    
    return true;
    
}

function attack(target) {
    
    var range = rangeTo(target);
    
    if(range > this.weapon.range) {
    
        moveTowards(target);
        
    } else {
     
        // do whatever the weapon does (bullet etc)
        weapon.attack(target);
        
    }
    
}

