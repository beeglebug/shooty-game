var Group = function( memberClass, preallocate ) {
    
    this._members = [];

//    this._pool = [];
//    this._memberClass = memberClass || null;
//    
//    if(memberClass && preallocate) {
//        while(preallocate--) {
//            this._pool.push( new this._memberClass() );
//        }
//    }
};

// bubble up length property
Object.defineProperty( Group.prototype, 'length', {
    
    get : function() {
  
        return this._members.length;
    
    }
        
});

Group.prototype.call = function( method ) {
 
    for(var i = 0; i < this._members.length; i++) {

        this._members[i][method]();
        
    }
    
};

Group.prototype.all = function() {
  
    return this._members;
    
};


//Group.prototype.create = function() {
//
//    var instance;
//    
//    if(this._pool.length) {
//        
//        instance = this._pool.pop();
//        
//    } else {
//     
//        instance = new this._memberClass();
//        
//    }    
//    
//    this.add( instance );
//    
//    return instance;
//
//};
//
//
//Group.prototype.release = function(obj) {
//
//    this.remove(obj);
//    
//    this._pool.push(obj);
//    
//};


Group.prototype.add = function(item) {

    this._members.push(item);

    item.group = this;
    
};
    
    
Group.prototype.remove = function(item) {
    
    var ix = this._members.indexOf(item);

    if (ix < 0) { return false; }
    
    this._members.splice(ix, 1);

    item.group = null;
    
    return true;

};


Group.prototype.forEach = function(fn) {

    return this._members.forEach(fn);
    
};
