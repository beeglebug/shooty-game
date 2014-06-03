var UI = {

	update : function() {
		
		// set the in game position of the mouse
		input.mouse.worldPosition.set(
			input.mouse.position.x + camera.position.x,
			input.mouse.position.y + camera.position.y
		);

		// set the mouse cursor position
		cursor.position.set(
			input.mouse.position.x,
			input.mouse.position.y
		);
		
	}
	
	
}