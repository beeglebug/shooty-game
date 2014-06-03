/**
 * event emitter
 * @constructor
 */
var EventEmitter = function() {

	this._listeners = {};

};

/**
 * register a listener
 * @param  {[type]}   event    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
EventEmitter.prototype.on = function(event, callback) {

	if( !this._listeners[event] ) {

		this._listeners[event] = [];

	}

	this._listeners[event].push({
		fn : callback
	});

	return this;

};

/**
 * register a listener which only fires once
 * @param  {[type]}   event    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
EventEmitter.prototype.once = function(event, callback) {

	if( !this._listeners[event] ) {

		this._listeners[event] = [];

	}

	this._listeners[event].push({
		fn : callback,
		once : true
	});

	return this;

};

/**
 * remove a single callback for a specific event
 * @param  {String} event the event type
 * @param  {Function} callback the callback to remove
 * @return {Boolean} true if a listener was removed
 */
EventEmitter.prototype.removeListener = function(event, callback) {

	if(!this._listeners[event]) { return false; }

	this._listeners[event].forEach(function(listener, ix, listeners) {

		if(listener.fn == callback) {

			listeners.splice(ix, 1);

		}

	});

	return true;

};

/**
 * remove all event listeners, or only those for a specific event
 * @param  {String} [event] the type of event to remove
 * @return {Boolean} false if nothing was deleted, otherwise true
 */
EventEmitter.prototype.removeAllListeners = function(event) {

	if(event) {

		if(!this._listeners[event]) { return false; }

		this._listeners[event] = [];

	} else {

		this._listeners = {};

	}

	return true;

};

/**
 * fire any listeners registered for the event
 * @param  {String} event
 */
EventEmitter.prototype.emit = function(event) {

	if(!this._listeners[event]) { return false; }

	var args = Array.prototype.slice.call(arguments, 1);

	this._listeners[event].forEach(function(listener) {

		listener.fn.apply(this, args);

		if(listener.once) {

			this.remove(event, listener.fn);

		}

	}, this);

	return true;

};
