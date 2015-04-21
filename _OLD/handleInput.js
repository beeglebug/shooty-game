function handleInput() {
	
    player.acceleration.zero();
	
    var speed = 0.35;
    
	if(input.isDown(Input.KEY_W)) {
		player.acceleration.y -= 1;
	}
	
	if(input.isDown(Input.KEY_A)) {	
		player.acceleration.x -= 1;
	}
	
	if(input.isDown(Input.KEY_S)) {	
		player.acceleration.y += 1;
	}

	if(input.isDown(Input.KEY_D)) {	
		player.acceleration.x += 1;
	}
	
    player.acceleration.normalise().multiply(speed);
    
    if(input.isDown(Input.MOUSE_DOWN_LEFT)) {
        shoot();
    } else {
        lastShoot = null;
        shootAccumulator = 0;
    }
    
}

input.mouse.worldPosition = new Vector2();
