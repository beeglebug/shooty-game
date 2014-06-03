function handleInput() {
	
    player.velocity.zero();
    
	var speed = 1.5;
	
	if(input.isDown(Input.KEY_W)) {
		player.velocity.y -= speed;
	}
	
	if(input.isDown(Input.KEY_A)) {	
		player.velocity.x -= speed;
	}
	
	if(input.isDown(Input.KEY_S)) {	
		player.velocity.y += speed;
	}

	if(input.isDown(Input.KEY_D)) {	
		player.velocity.x += speed;
	}
	
}

input.on( Input.MOUSE_DOWN_LEFT, shoot );
input.mouse.worldPosition = new Vector2();
