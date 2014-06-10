/**
 * A rectangle.
 * @constructor
 * @param {Number} [width=1] The starting width of the rectangle.
 * @param {Number} [height=1] The starting height of the rectangle.
 * @param {Vector2} [position=[0,0]] The starting position of the rectangle.
 * @example var shape = new Rect(3,3);
 */
var Rect = function( width, height, position ) {

	/** The width of the rectangle. */
	this.width = 1;

	/** The height of the rectangle. */
	this.height = 1;

	/** The position of the rectangle. */
	this.position = null;

	this._center = null;
	
	if( height === undefined ) { height = width; }

	if(width) { this.width = parseFloat(width); }

	if(height) { this.height = parseFloat(height); }

	this.position = new Vector2();

	if(position) {
		this.position.set(position);
	}
};

/**
 * @return {Rect} An exact copy of this Rect.
 */
Rect.prototype.copy = function() {

	return new Rect(this.width, this.height, this.position.copy());

};

/**
 * Alter this Rect so that it becomes an exact copy of the passed Rect.
 * @param {Rect} rect A Rect to copy from.
 * @return {Rect} Itself. Useful for chaining.
 */
Rect.prototype.set = function(rect) {

	if(!rect || !(rect instanceof Rect)) { return this; }

	this.width = rect.width;
	this.height = rect.height;
	this.position.set(rect.position);

	return this;

};

/**
 * @return {Vector2} The center of the rectangle.
 */
Object.defineProperty( Rect.prototype, 'center', {
	
	get : function() {

		// only make the vector the first time it is asked for, then cache for future requests
		if ( !this._center ) {
			this._center = new Vector2();
		}
		
		this._center.x = this.position.x + this.width / 2;
		this._center.y = this.position.y + this.height / 2;

		return this._center;

	}

});

/**
 * Move the Rect so that it's center is at the specified point.
 * @param {Vector2} pos The new center for the Rect.
 * @return {Rect} Itself. Useful for chaining.
 */
Rect.prototype.setCenter = function(pos) {

	this.position.x = pos.x - this.width / 2;
	this.position.y = pos.y - this.height / 2;

	return this;

};


/**
 *
 */
Rect.prototype.scale = function(scale) {

	this.width *= scale;
	this.height *= scale;

	return this;

};

/**
 * Expand the Rect so that it has a new width and height, but the same center.
 * @param {Number} scale A factor to multiply the width and height by.
 * @return {Rect} Itself. Useful for chaining.
 */
Rect.prototype.scaleCenter = function(scale) {

	// get it first to expand from center
	var center = this.center;

	this.scale(scale);

	this.setCenter(center);

	return this;

};


/**
 * a random point inside the Rect
 * @return {Vector2} a random point inside in the Rect
 */
Rect.prototype.randomPoint = function() {

	return this.position._add(new Vector2(
		Util.random() * this.width,
		Util.random() * this.height
	));

};

Rect.prototype.toString = function() {

	return this.width + 'x' + this.height + '@' + this.position.toString();

};

/**
 * constrain this rect inside another
 */
Rect.prototype.clip = function(rect) {

	// left edge
	if(this.position.x < rect.position.x) {
		this.width += this.position.x - rect.position.x;
		this.position.x = rect.position.x;
	}

	// right edge
	if(this.position.x + this.width >= rect.position.x + rect.width) {
		this.width = rect.position.x + rect.width - this.position.x;
	}

	// top edge
	if(this.position.y < rect.position.y) {
		this.height += this.position.y - rect.position.y;
		this.position.y = rect.position.y;
	}

	// bottom edge
	if(this.position.y + this.height >= rect.position.y + rect.height) {
		this.height = rect.position.y + rect.height - this.position.y;
	}

	return this;
};

/**
 * return an array of lines
 * representing the edges of the rectangle edges
 * @return {Array} an array of lines
 */
Rect.prototype.getEdges = function() {

	var v = this.getVertices();

	return [
		new Line(v[0], v[1]),
		new Line(v[1], v[2]),
		new Line(v[2], v[3]),
		new Line(v[3], v[0])
	];

};

// get vertices in clockwise order from top left
Rect.prototype.getVertices = function() {

	var vertices = [
		this.position.copy(),
		this.position.copy(),
		this.position.copy(),
		this.position.copy()
	];

	vertices[1].x += this.width;
	vertices[2].x += this.width;
	vertices[2].y += this.height;
	vertices[3].y += this.height;

	return vertices;
};

Rect.fromArray = function(arr) {

	var pos = new Vector2();

	if(arr.length >= 4) {

		pos.x = parseInt(arr[2]);
		pos.y = parseInt(arr[3]);

	}

	return new Rect(
		parseInt(arr[0]),
		parseInt(arr[1]),
		pos
	);

};