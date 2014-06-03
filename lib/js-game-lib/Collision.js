/**
 * @namespace
 * Assorted collision functions
 * covers collisions between points, lines, circles, rects, polygons
 * plus assorted helpers for halfspaces, circlesegments, closestPointTo etc
 * @todo make every one handle collision response objects
 * @todo add polygon to collide function
 */
var Collision = {

	/**
	 * spare vectors for use in functions to reduce instantiation overhead
	 */
	_v1 :  new Vector2(),
	_v2 :  new Vector2(),
	_v3 :  new Vector2(),
	
	/**
	 * calculate collision between two points
	 */
	pointPoint : function(point1, point2) {
		return point1.equals(point2);
	},

	/**
	 * calculate collision between a point and a line
	 * @param  {[type]} point [description]
	 * @param  {[type]} line  [description]
	 * @return {[type]}       [description]
	 */
	pointLine : function(point, line) {
		//@todo
	},

	/**
	 * calculate collision between a point and a Circle
	 * @param  {[type]} point  [description]
	 * @param  {[type]} circle [description]
	 * @return {[type]}        [description]
	 */
	pointCircle : function(point, circle) {

		var dx = Math.abs(circle.position.x - point.x),
			dy = Math.abs(circle.position.y - point.y);

		return (dx * dx) + (dy * dy) < (circle.radius * circle.radius);

	},

	/**
	 * calculate collisions between a point and a Rect
	 * @param  {[type]} point [description]
	 * @param  {[type]} rect  [description]
	 * @return {[type]}       [description]
	 */
	pointRect : function(point, rect) {

		if(!point || !rect) { return false; }

		return  point.x >= rect.position.x &&
				point.x <= rect.position.x + rect.width &&
				point.y >= rect.position.y &&
				point.y <= rect.position.y + rect.height;
	},

	/**
	 * check collision between a point and a polygon
	 * @param  {[type]} point   [description]
	 * @param  {[type]} polygon [description]
	 * @return {[type]}         [description]
	 */
	pointPolygon : function(point, polygon) {

		// quick test of bounding box
		if(!this.pointRect(point, polygon.bounds)) { return false; }

		// get a reference point definitely outside the polygon
		var outside = polygon.bounds.position._subtract(new Vector2(1,1));
		var ray = new Line(point, outside);

		var intersections = 0,
			edges = polygon.getEdges();

		for (var i = 0, len = edges.length; i < len; i++) {

			if (this.lineLine(ray, edges[i])) {

				intersections++;

			}
		}

		return (intersections % 2);

	},

	/**
	 * check collision between a point and a polygon
	 * only works on convex polygons
	 * @param  {[type]} point   [description]
	 * @param  {[type]} polygon [description]
	 * @return {[type]}         [description]
	 */
	pointPolygonConvex : function(point, polygon) {

		var edges = polygon.getEdges();

		for (var i = 0, len = edges.length; i < len; i++) {

			// drop out as soon as it is outside
			if (!this.pointHalfspace(point, edges[i])) {

				return false;

			}
		}

		return true;

	},

	/**
	 * check collision between two lines
	 * @param  {[type]} line1 [description]
	 * @param  {[type]} line2 [description]
	 * @return {[type]}       [description]
	 */
	lineLine : function( line1, line2 ) {

		// http://paulbourke.net/geometry/lineline2d/

		var f = ((line2.end.y - line2.start.y)*(line1.end.x - line1.start.x) - (line2.end.x - line2.start.x)*(line1.end.y - line1.start.y));
	    if(f == 0) { return false; }

	    f = 1 / f;
	    var fab = ((line2.end.x - line2.start.x)*(line1.start.y - line2.start.y) - (line2.end.y - line2.start.y)*(line1.start.x - line2.start.x)) * f ;
	    if(fab <= 0 || fab >= 1) { return false; }

	    var fcd = ((line1.end.x - line1.start.x)*(line1.start.y - line2.start.y) - (line1.end.y - line1.start.y)*(line1.start.x - line2.start.x)) * f ;
	    if(fcd <= 0 || fcd >= 1){ return false; }

	    // point of intersection
	    // return new Vector2(line1.start.x + fab * (line1.end.x-line1.start.x), line1.start.y + fab * (line1.end.y - line1.start.y) );

	    return true;
	},

	/**
	 * Check collision between a line and a circle
	 * @param line
	 * @param circle
	 * @return {Boolean}
	 */
	lineCircle : function( line, circle ) {

		var point = this.closestPointLine(circle.position, line);
		var distance = point.distanceTo(circle.position);

		if(distance <= circle.radius) {

			var response = new CollisionResponse(
				point,
				circle.position._subtract(point).normalize(),
				circle.radius - distance
			);

			return response;

		}

		return false;
	},

	/**
	 * Check collision between a line and a rectangle
	 * @param  {[type]} line [description]
	 * @param  {[type]} rect [description]
	 * @return {[type]}      [description]
	 */
	lineRect : function(line, rect) {

		// quick bounds check
		if(!this.rectRect(line.getBounds(), rect)) { return false; }

		// check all vertices are on same side of line
		var vertices = rect.getVertices();
		var r1 = this.pointHalfspace(vertices[0], line);
		var r2 = this.pointHalfspace(vertices[1], line);
		var r3 = this.pointHalfspace(vertices[2], line);
		var r4 = this.pointHalfspace(vertices[3], line);

		// all on one side (directly on the line is ok)
		if(
			(r1 == 1 || r1 == 0) &&
			(r2 == 1 || r2 == 0) &&
			(r3 == 1 || r3 == 0) &&
			(r4 == 1 || r4 == 0)
		) { return false; }

		// all on the other side (directly on the line is ok)
		if(
			(r1 == -1 || r1 == 0) &&
			(r2 == -1 || r2 == 0) &&
			(r3 == -1 || r3 == 0) &&
			(r4 == -1 || r4 == 0)
		) { return false; }

		return true;
	},

	linePolygon : function(line, polygon) {

	},

	/**
	 * Check collision between two Rects
	 * @param  {[type]} r1 [description]
	 * @param  {[type]} r2 [description]
	 * @return {[type]}    [description]
	 */
	rectRect : function ( rect1, rect2, response ) {

		// work out the half widths and half heights
		var hw1 = rect1.width / 2;
		var hw2 = rect2.width / 2;
		var hh1 = rect1.height / 2;
		var hh2 = rect2.height / 2;

		// calculate the centers of the two rects
		var c1 = rect1.center;
		var c2 = rect2.center;

		// the distances between the two centers
		var distance = c1._subtract(c2).abs();

		// the total widths and heights
		var totalWidth = hw1 + hw2;
		var totalHeight = hh1 + hh2;

		if(totalWidth <= distance.x) { return false; }
		if(totalHeight <= distance.y) { return false; }

		if(response) {
		
			response.clear();
			
			var v = this._v3.zero();
			var x = totalWidth - distance.x;
			var y = totalHeight - distance.y;

			// calculate the response normal
			if(Math.abs(x) < Math.abs(y)) {

				if(c1.x - c2.x < 0) { v.x = -x; }
				else { v.x = x; }

			} else {

				if(c1.y - c2.y < 0) { v.y = -y; }
				else { v.y = y; }

			}

			//@TODO: calculate properly
			response.point.set(0,0);
			response.normal.set(v.x, v.y).normalize();
			response.depth = v.magnitude();
			
		}
		
		return true;

	},

	rectPolygon : function(rect, polygon) {
		//@todo
	},

	/**
	 * Check collision between two Circles
	 * @param  {[type]} c1       [description]
	 * @param  {[type]} c2       [description]
	 * @param  {[type]} response [description]
	 * @return {[type]}          [description]
	 */
	circleCircle : function (c1, c2) {

		var dx = Math.abs(c1.position.x - c2.position.x);
		var dy = Math.abs(c1.position.y - c2.position.y);
		var dr = c1.radius + c2.radius;

		if(((dx * dx) + (dy * dy)) < (dr * dr)) {

			var near = this.closestPointCircle( c1.position, c2 );
			var distance = c1.position._subtract(c2.position);
			var normal = distance._normalize();
			var depth = (c1.radius + c2.radius) - distance.magnitude();
			var mtd = normal._multiply(depth);

			return new CollisionResponse(near, normal, depth);

		}

		return false;
	},

	/**
	 * Check collision between a Circle and a Rect
	 * @param  {[type]} circle   [description]
	 * @param  {[type]} rect     [description]
	 * @param  {[type]} response [description]
	 * @return {[type]}          [description]
	 */
	circleRect : function ( circle, rect, response ) {

		var near = this.closestPointRect( circle.position, rect );

		if ( this.pointCircle( near, circle ) ) {

			if(response) {
				var distance = circle.position.distanceTo( near );
				response.point = near;
				response.normal = circle.position._subtract(near).normalize();
				response.depth = circle.radius - distance;
			}

			return true;

		}

		return false;
	},

	circleCircleSegment : function( circle, circleSegment) {

		// exclude anything that fails a quick circle-to-circle test
		if( !this.circleCircle(circle, circleSegment) ) { return false; }

		// test for collision between the circle and the two outer lines of the segment
		if( Collision.lineCircle(circleSegment.edge1, circle) ) { return true; }
		if( Collision.lineCircle(circleSegment.edge2, circle) ) { return true; }

		// point-to-halfspace tests using the center of the circle and the two outer lines
		return this.pointHalfspace(circle.position, circleSegment.edge1) >= 0 && this.pointHalfspace(circle.position, circleSegment.edge2) < 0;
	},

	circlePolygon : function(circle, polygon) {
		//@todo
	},

	polygonPolygon : function(polygon1, polygon2) {
		//@todo
	},

	/**
	 * find the closest point on a line to a reference point
	 * @param {Vector2} point a point in space
	 * @param {Line} line a line
	 * @return {Vector2} the closest point on the line to the point
	 */
	closestPointLine : function( point, line ) {

		var v1 = line.end._subtract(line.start);
		var v2 = line.start._subtract(point);
		var v3 = line.start._subtract(line.end);
		var v4 = line.end._subtract(point);

		var dot1 = v2.dot(v1);
		var dot2 = v1.dot(v1);
		var dot3 = v4.dot(v3);
		var dot4 = v3.dot(v3);

		var t1 = -1 * dot1/dot2;
		var t2 = -1 * dot3/dot4;

		// beyond the bounds of the line, so the end points are the closest
		if( t1 < 0 ) { return line.start.copy(); }
		if( t2 < 0 ) { return line.end.copy(); }

		// actual point on line
		return new Vector2(line.start.x + v1.x * t1, line.start.y + v1.y * t1);

	},

	/**
	 * Determine the closest point on a circle to a reference point
	 * @param {Vector2} point a point in space
	 * @param {Circle} circle a circle
	 * @return {Vector2} the closest point on the circle to the point
	 */
	closestPointCircle : function( point , circle ) {

		var v = point._subtract(circle.position);
		v.setMagnitude(circle.radius);

		return circle.position._add(v);

	},

	/**
	 * Determine the closest point on a rect to another point
	 * @param  {[type]} point [description]
	 * @param  {[type]} rect  [description]
	 * @return {[type]}       [description]
	 */
	closestPointRect : function( point, rect) {

		var closest = point.copy();

		if( point.x < rect.position.x ) {

			closest.x = rect.position.x;

		} else if ( point.x > rect.position.x + rect.width ) {

			closest.x = rect.position.x + rect.width;

		}

		if( point.y < rect.position.y ) {

			closest.y = rect.position.y;

		} else if ( point.y > rect.position.y + rect.height ) {

			closest.y = rect.position.y + rect.height;

		}

		return closest;
	},

	/**
	 * check which side of an infinite line the point is on
	 * @param {Vector2} point A Vector2 representing a point in 2d space
	 * @param {Line} line a line representing a halfspace
	 * @return
	 */
	pointHalfspace : function(point, line) {

		var end = line.end._subtract(line.start),
			start = point._subtract(line.start),
			normal = end._perp(),
			dot = start.dot(normal);

			if(dot == 0) { return 0; }
			if(dot > 0) { return 1; }
			return -1;
	},


	/**
	 * general purpose collision resolution wrapper
	 * at the moment, handles rects and circles
	 * @TODO: extend to other shapes
	 * @param  {[type]} shape1
	 * @param  {[type]} shape2
	 * @return {[type]}
	 */
	resolve : function(shape1, shape2) {

		if(shape1 instanceof Vector2) {

			if(shape2 instanceof Vector2) {

				return this.pointPoint(shape1, shape2);

			} else if(shape2 instanceof Line) {

				return this.pointLine(shape1, shape2);

			} else if(shape2 instanceof Rect) {

				return this.pointRect(shape1, shape2);

			} else if(shape2 instanceof Circle) {

				return this.pointCircle(shape1, shape2);

			}

		} else if(shape1 instanceof Line) {

			if(shape2 instanceof Vector2) {

				return this.pointLine(shape2, shape1);

			} else if(shape2 instanceof Line) {

				return this.lineLine(shape1, shape2);

			} else if(shape2 instanceof Rect) {

				return this.lineRect(shape1, shape2);

			} else if(shape2 instanceof Circle) {

				return this.lineCircle(shape1, shape2);

			}

		} else if(shape1 instanceof Rect) {

			if(shape2 instanceof Vector2) {

				return this.pointRect(shape2, shape1);

			} else if(shape2 instanceof Line) {

				return this.lineRect(shape2, shape1);

			} else if(shape2 instanceof Rect) {

				return this.rectRect(shape1, shape2);

			} else if(shape2 instanceof Circle) {

				return this.rectCircle(shape1, shape2);

			}

		} else if(shape1 instanceof Circle) {

			if(shape2 instanceof Vector2) {

				return this.pointCircle(shape2, shape1);

			} else if(shape2 instanceof Line) {

				return this.lineCircle(shape2, shape1);

			} else if(shape2 instanceof Rect) {

				return this.rectCircle(shape2, shape1);

			} else if(shape2 instanceof Circle) {

				return this.circleCircle(shape1, shape2);

			}


		}

	}

};
