/**
 * A line, represented by start and end points
 * @constructor
 * @param  {Vector2} start the start of the line
 * @param  {Vector2} end the end of the line
 */
var Line = function(start, end) {

	this.start = start || new Vector2();
	this.end = end || new Vector2();
	this.bounds;
};

/**
 * get the length of lines
 * @return {Number} the length
 */
Line.prototype.length = function() {

	return this.end._subtract(this.start).magnitude();

};

Line.prototype.set = function(start, end) {
	this.start = start;
	this.end = end;
};

Line.prototype.setStart = function(start) {
	this.start = start;
};

Line.prototype.setEnd = function(end) {
	this.end = end;
};

/**
 */
Line.prototype.invert = function() {

	var temp = this.end;

	this.end = this.start;
	this.start = temp;

	return this;
};

/**
 * get a random point along the line
 * @return {Vector2} the point
 */
Line.prototype.randomPoint = function() {

	var len = Util.random();
	var offset = this.end._subtract(this.start);

	return this.start._add(offset._multiply(len));

};

/**
 * get the center of the line
 * @return {Vector2} the center
 */
Line.prototype.getCenter = function() {

	var offset = this.end._subtract(this.start);

	return this.start._add(offset._divide(2));

};

Line.prototype.getBounds = function() {

	// only make when first requested
	if(!this.bounds) {
		this.bounds = new Rect();
	}

	if(this.start.x < this.end.x) {
		this.bounds.position.x = this.start.x;
		this.bounds.width = this.end.x - this.start.x;
	} else {
		this.bounds.position.x = this.end.x;
		this.bounds.width = this.start.x - this.end.x;
	}

	if(this.start.y < this.end.y) {
		this.bounds.position.y = this.start.y;
		this.bounds.height = this.end.y - this.start.y;
	} else {
		this.bounds.position.y = this.end.y;
		this.bounds.height = this.start.y - this.end.y;
	}

	return this.bounds;
};

/**
 * get the normal of the line
 * @return {Vector2} the normal
 */
Line.prototype.getNormal = function() {

	return this.end._subtract(this.start).perp().normalize();

};

Line.prototype.toString = function() {

	return this.start.toString() + '->' + this.end.toString();

};

// Bresenham's algorithm
Line.prototype.rasterize = function() {

	var x0 = this.start.x;
	var y0 = this.start.y;
	var x1 = this.end.x;
	var y1 = this.end.y;

	var dx = Math.abs(x1 - x0);
	var dy = Math.abs(y1 - y0);

	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;

	var err = dx - dy;
	var e2;
	var ret = [];

	//@TODO: potential infinite loop, avoid!
	while(true) {

		ret.push( new Vector2(x0, y0) );

		if ((x0 == x1) && (y0 == y1)) { break; }

		e2 = 2 * err;

		if(e2 > -dy) {
			err -= dy;
			x0 += sx;
		}

		if(e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}

	return ret;
};
