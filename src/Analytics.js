var Analytics = {
    
    events : {}
    
};

Analytics.register = function(eventName, category, action) {
    
    // store the event
    this.events[eventName] = {
        name : eventName,
        category : category,
        action : action
    }
    
};

Analytics.track = function(type) {
    
    if( !this.events[type] ) { return; }
    
    var event = this.events[type];
    
    ga('send', 'event', event.category, event.action, event.name);
};



// register a few test events

Analytics.register('ENEMY_KILLED', 'gameplay', 'combat');
Analytics.register('ALL_ENEMIES_KILLED', 'gameplay', 'combat');