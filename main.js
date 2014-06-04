// setup globaL stuff
var stage = new PIXI.Stage(0xFFFFFF);
var renderer = PIXI.autoDetectRenderer(320, 320);
var input = new Input();
var stats = new Stats();
var world = new PIXI.DisplayObjectContainer();

// pixelly goodness
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

function init(data) {

    // dom binding
    document.body.appendChild(renderer.view);
    input.bindKeyboard(document.body);
    input.bindMouse(document.body);
    document.body.appendChild( stats.domElement );
    
	// make spritesheets
	//var tileset = makeSpriteSheet( PIXI.TextureCache['assets/tiles.png'], 16, 16 );
	//var shadowTileset = makeSpriteSheet( PIXI.TextureCache['assets/shadows.png'], 16, 16 );

    // make entity groups
    bullets = new Group();
    enemies = new Group();

	// build map
    var importer = new TiledImporter();
    mapData = importer.parse( PIXI.JsonCache['assets/map.json'] );
    
    floorLayer = mapData.layers[0];
    shadowLayer = mapData.layers[1];
    wallLayer = mapData.layers[2];
	overhangLayer = mapData.layers[3];
    
    wallLayer.setCollidable([2,3]);
	shadowLayer.sprite.alpha = 0.1;
	
    entityLayer = new PIXI.DisplayObjectContainer();

    // move all the wall sprites into the entity layer
    reparent( wallLayer.container, entityLayer );

	// make player
	player = new Entity();
	player.sprite = PIXI.Sprite.fromImage( 'assets/player.png' );
	player.sprite.anchor.set(0, 0.5);
    player.position.set(160,180);
	player.shape = new Rect(16, 8);

    entityLayer.addChild( player.sprite );

	player.on( 'PLAYER_COLLIDE_WALL', function( wall, response ) {
		this.position.add( response.mtd );
        this.shape.position.set( this.position.x, this.position.y );
	});

    
    // test animated sprite
//  animatedSprite = new AnimatedSprite( makeSpriteSheet( PIXI.TextureCache['assets/tiny16.png'], 16, 16) );
//  animatedSprite.position.set(128,128);
//  animatedSprite.addAnimation( 'idle', [128] );
//  animatedSprite.addAnimation( 'walk', [129,130] );
//  animatedSprite.addAnimation( 'fly', [195,196] );
//  animatedSprite.addAnimation( 'pot', [52,53,54,55] );
//  animatedSprite.play('idle');

	// make camera
	camera = new Camera(320, 320, world);
	camera.setTarget(player);
	
	// build up the game layers
	stage.addChild( world );
	stage.addChild( camera.container );

	world.addChild( floorLayer.sprite );
	world.addChild( shadowLayer.sprite );
	world.addChild( entityLayer );
    world.addChild( overhangLayer.sprite );
	
	// cursor overlay
	cursor = PIXI.Sprite.fromImage( 'assets/crosshair.png' );
	cursor.anchor.set( 0.5, 0.5 );

	// things attached to camera are fixed (ui etc)
	camera.container.addChild( cursor );
	
    // enemy spawner (temp)
    setInterval(function(){
        //spawn();
    }, 1000);

	// go!
	loop();

}

running = true;

var lastUpdate = Date.now();

function loop() {

	if(!running) { return; }
	
	requestAnimationFrame(loop);

    var now = Date.now();
    var delta = now - lastUpdate;
    lastUpdate = now;
    
	stats.begin();
	
    // for the physics stuff
	var walls = wallLayer.getCollidable();
    
    // player updates
	handleInput();
    player.update();
	
	// avoid toe stubbing by doing closest ones first
	walls.sort( Physics.sortByDistanceTo( player.shape.center ) );
	
	Physics.collideRects( player, walls, 'PLAYER_COLLIDE_WALL' );
    
    player._beforeRender();
    
    // enemy updates
    enemies.forEach(function(enemy) {
        
        enemy.doAI();
        enemy.update(delta);
       
        // @todo sort walls by distance to enemy?
        
        Physics.collideRects( enemy, walls, 'ENEMY_COLLIDE_WALL' );
	
        enemy._beforeRender();
    });
    
    // bullet updates
	bullets.forEach(function(bullet) {
	
		bullet.update(delta);
		
		Physics.collideRects( bullet, walls, 'BULLET_COLLIDE_WALL' );
		
        Physics.collideRects( bullet, enemies.all(), 'BULLET_COLLIDE_ENEMY' );

        bullet._beforeRender();
        
	});

	camera.update(delta);
	UI.update();	
	
    // z sort the middle layer
    entityLayer.children.sort(sortByDepth);

	renderer.render(stage);

	stats.end();

}

function die() { running = false; }


function shoot() {
    
    var bullet = new Bullet( player.shape.center, input.mouse.worldPosition, 2 );
	
	bullets.add(bullet);
	
	entityLayer.addChild( bullet.sprite );

}



function spawn() {
    
    // make enemy
	var enemy = new Enemy( 220, 120 );
    
    enemies.add(enemy);
    
    entityLayer.addChild( enemy.sprite );
    
}




