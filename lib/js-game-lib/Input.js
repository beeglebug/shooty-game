/**
 * Input
 * @constructor
 */
var Input = function() {

	this.down = {};
	this.released = {};
	this.mouse = {};
	this.listeners = {};
	this.onKeyDownCallback = null;
	this.onMouseMoveCallback = null;
	this.onMouseDownCallback = null;
};

/**
 * bind keyboard events to the given DOM element
 * @param  {HTMLElement} target the element to bind events to
 * @return {boolean} true if the events were bound to the element
 */
Input.prototype.bindKeyboard = function(target) {

	if(!target) { return false; }

	var scope = this;

	target.addEventListener('keydown', function(e) { return scope.keyDownHandler(e); }, false);
	target.addEventListener('keypress', function(e) { return scope.keyPressHandler(e); }, false);
	target.addEventListener('keyup', function(e) { return scope.keyUpHandler(e); }, false);

	return true;

};

/**
 * bind mouse events to the given dom element
 * @param  {HTMLElement} target the element to bind events to
 * @return {boolean} true if the events were bound to the element
 */
Input.prototype.bindMouse = function(target) {

	if(!target) { return false; }

	this.target = target;

	var rect = target.getBoundingClientRect();

	this.mouseTargetOffset = new Vector2(rect.left, rect.top);
	this.mouse.position = new Vector2();

	var scope = this;

	target.addEventListener('mouseup', function(e) { return scope.mouseUpHandler(e); }, false);
	target.addEventListener('mousedown', function(e) { return scope.mouseDownHandler(e); }, false);
	target.addEventListener('mousemove', function(e) { return scope.mouseMoveHandler(e); }, false);
	target.addEventListener('mousewheel', function(e) { return scope.mouseWheelHandler(e); }, false);
	target.addEventListener('mouseover', function(e) { scope.mouse.over = true; return false; }, false);
	target.addEventListener('mouseout', function(e) { scope.mouse.over = false; return false; }, false);
	target.addEventListener('touchstart', function(e) { scope.mouseMoveHandler(e); }, false);
	target.addEventListener('contextmenu', function(e) { e.preventDefault(); e.stopPropagation(); return false; }, false);

};

Input.prototype.keyDownHandler = function(e) {

	var code = e.keyCode;

	this.down[code] = true;

	// generic key handler
	this.fire(this.listeners[Input.KEY_DOWN], e, code);

	// specific key
	this.fire(this.listeners[code], e, Input.KEY_DOWN);

	return false;

};

Input.prototype.keyPressHandler = function(e) {

	var code = e.keyCode;

	// generic key handler
	this.fire(this.listeners[Input.KEY_PRESS], e, code);

	// specific key
	this.fire(this.listeners[code], e, Input.KEY_PRESS);

	return false;

};

Input.prototype.keyUpHandler = function(e) {

	var code = e.keyCode;

	delete this.down[code];

	// generic key handler
	this.fire(this.listeners[Input.KEY_UP], e, code);

	// specific key
	this.fire(this.listeners[code], e, Input.KEY_UP);

	return false;

};


Input.prototype.mouseMoveHandler = function(e) {

	this.mouse.position.x = e.clientX - this.mouseTargetOffset.x;
	this.mouse.position.y = e.clientY - this.mouseTargetOffset.y;

	this.fire(this.listeners[Input.MOUSE_MOVE], e, this.mouse.position);

};

Input.prototype.mouseDownHandler = function(e) {

	// offset to distinguish from keyboard events
	var code = 1000 + e.button;

	this.down[code] = true;

	// general listeners
	this.fire(this.listeners[Input.MOUSE_DOWN], e, code);

	// fire specific button listeners
	this.fire(this.listeners[code], e, code);

};

Input.prototype.mouseUpHandler = function(e) {

	// offset to distinguish from keyboard events
	var downCode = 1000 + e.button;
	var upCode = 2000 + e.button;

	this.down[downCode] = false;

    
	// general listeners
	this.fire(this.listeners[Input.MOUSE_UP], e, upCode);

	// fire specific button listeners
	this.fire(this.listeners[upCode], e, upCode);

};

Input.prototype.mouseWheelHandler = function(e) {

	// firefox uses detail, and it's backwards
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

	// todo fire listeners
};

Input.prototype.fire = function(listeners, event, arg) {

	if(!listeners) { return; }

	for(var i = 0; i < listeners.length; i++) {
		listeners[i].callback.call( listeners[i].scope, event, arg );
	}
};

/**
 * add an event listener for a type of event
 */
Input.prototype.on = function(event, callback, scope) {

	if(!this.listeners[event]) {
		this.listeners[event] = [];
	}

	this.listeners[event].push({
		callback : callback,
		scope : scope
	});

};

/**
 * remove a specific event listener
 */
Input.prototype.remove = function(event, callback) {

	if(!this.listeners[event]) { return; }

	this.listeners[event] = this.listeners[event].filter(function(ev){
		return ev.callback !== callback;
	});

};




Input.prototype.isDown = function(key) {
	return this.down[key] == true;
};


/**
 * a list of keycodes used for input
 */
Input.KEY_BACKSPACE = 8;
Input.KEY_TAB = 9;
Input.KEY_ENTER = 13;
Input.KEY_PAUSE = 19;
Input.KEY_CAPS = 20;
Input.KEY_ESC = 27;
Input.KEY_SPACE = 32;
Input.KEY_PAGE_UP = 33;
Input.KEY_PAGE_DOWN = 34;
Input.KEY_END = 35;
Input.KEY_HOME = 36;
Input.KEY_ARROW_LEFT = 37;
Input.KEY_ARROW_UP = 38;
Input.KEY_ARROW_RIGHT = 39;
Input.KEY_ARROW_DOWN = 40;
Input.KEY_INSERT = 45;
Input.KEY_DELETE = 46;
Input.KEY_0 = 48;
Input.KEY_1 = 49;
Input.KEY_2 = 50;
Input.KEY_3 = 51;
Input.KEY_4 = 52;
Input.KEY_5 = 53;
Input.KEY_6 = 54;
Input.KEY_7 = 55;
Input.KEY_8 = 56;
Input.KEY_9 = 57;
Input.KEY_A = 65;
Input.KEY_B = 66;
Input.KEY_C = 67;
Input.KEY_D = 68;
Input.KEY_E = 69;
Input.KEY_F = 70;
Input.KEY_G = 71;
Input.KEY_H = 72;
Input.KEY_I = 73;
Input.KEY_J = 74;
Input.KEY_K = 75;
Input.KEY_L = 76;
Input.KEY_M = 77;
Input.KEY_N = 78;
Input.KEY_O = 79;
Input.KEY_P = 80;
Input.KEY_Q = 81;
Input.KEY_R = 82;
Input.KEY_S = 83;
Input.KEY_T = 84;
Input.KEY_U = 85;
Input.KEY_V = 86;
Input.KEY_W = 87;
Input.KEY_X = 88;
Input.KEY_Y = 89;
Input.KEY_Z = 90;
Input.KEY_NUM_0 = 96;
Input.KEY_NUM_1 = 97;
Input.KEY_NUM_2 = 98;
Input.KEY_NUM_3 = 99;
Input.KEY_NUM_4 = 100;
Input.KEY_NUM_5 = 101;
Input.KEY_NUM_6 = 102;
Input.KEY_NUM_7 = 103;
Input.KEY_NUM_8 = 104;
Input.KEY_NUM_9 = 105;
Input.KEY_MULTIPLY = 106;
Input.KEY_NUM_PLUS = 107;
Input.KEY_NUM_MINUS = 109;
Input.KEY_DECIMAL = 110;
Input.KEY_DIVIDE = 111;
Input.KEY_F1 = 112;
Input.KEY_F2 = 113;
Input.KEY_F3 = 114;
Input.KEY_F4 = 115;
Input.KEY_F5 = 116;
Input.KEY_F6 = 117;
Input.KEY_F7 = 118;
Input.KEY_F8 = 119;
Input.KEY_F9 = 120;
Input.KEY_F10 = 121;
Input.KEY_F11 = 122;
Input.KEY_F12 = 123;
Input.KEY_SHIFT = 16;
Input.KEY_CTRL = 17;
Input.KEY_ALT = 18;
Input.KEY_PLUS = 187;
Input.KEY_COMMA = 188;
Input.KEY_MINUS = 189;
Input.KEY_PERIOD = 190;
Input.KEY_TILDE = 223;


Input.MOUSE_DOWN_LEFT = 1000;
Input.MOUSE_DOWN_MIDDLE = 1001;
Input.MOUSE_DOWN_RIGHT = 1002;

Input.MOUSE_UP_LEFT = 2000;
Input.MOUSE_UP_MIDDLE = 2001;
Input.MOUSE_UP_RIGHT = 2002;

Input.MOUSE_MOVE = 3000;
Input.MOUSE_UP = 3001;
Input.MOUSE_DOWN = 3002;

Input.KEY_DOWN = 1;
Input.KEY_PRESS = 2;
Input.KEY_UP = 3;
