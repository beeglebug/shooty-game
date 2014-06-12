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
	
    if(input.isDown(Input.MOUSE_DOWN_LEFT)) {
        shoot();
    } else {
        lastShoot = null;
        shootAccumulator = 0;
    }
    
}

input.mouse.worldPosition = new Vector2();
