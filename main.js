// setup globaL stuff
var stage = new PIXI.Stage(0xFFFFFF);
var renderer = PIXI.autoDetectRenderer(384, 256);
var input = new Input();
var stats = new Stats();
var world = new PIXI.DisplayObjectContainer();

// pixelly goodness
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var Game = {
    mapCache : {}
};

function init(data) {

    // dom binding
    document.body.appendChild(renderer.view);
    input.bindKeyboard(document.body);
    input.bindMouse(document.body);
    document.body.appendChild( stats.domElement );

    // make entity groups
    bullets = new Group();
    enemies = new Group();

	// build map
    var importer = new TiledImporter();
    
    importer.addEventListener('complete', function(event) {
    
        var map = event.content;
    
        loadMap(map);
        
    });
    
    importer.load('assets/map.json');

    entityLayer = new PIXI.DisplayObjectContainer();

	// make player
	player = new Entity();
	
    player.sprite = new AnimatedSprite( makeSpriteSheet( PIXI.TextureCache['assets/tiny16.png'], 16, 16) );
    player.sprite.addAnimation( 'idle', [128] );
    player.sprite.addAnimation( 'walk', [129,130] );
    player.sprite.play('idle', 6);
    player.sprite.anchor.set(0, 0.5);
    player.position.set(30,100);
	player.shape = new Rect(16, 8);

    entityLayer.addChild( player.sprite );

	player.addEventListener( 'PLAYER_COLLIDE_WALL', function( wall, response ) {
		this.position.add( response.mtd );
        this.shape.position.set( this.position.x, this.position.y );
	});

    
    enemy = new Enemy(32,32);
    
    // test animated sprite
    animatedSprite = new AnimatedSprite( makeSpriteSheet( PIXI.TextureCache['assets/tiny16.png'], 16, 16) );
    animatedSprite.position.set(32,32);
    animatedSprite.addAnimation( 'fly', [195,196] );
    animatedSprite.play('fly', 6);

    enemy.sprite = animatedSprite;
    
    enemies.add(enemy);
    
    entityLayer.addChild(animatedSprite);
    
	// make camera
	camera = new Camera(renderer.width, renderer.height, world);
	camera.setTarget(player);
	
	// build up the game layers
	stage.addChild( world );
	stage.addChild( camera.container );

    floorLayer = new PIXI.DisplayObjectContainer();
    shadowLayer = new PIXI.DisplayObjectContainer();
    overhangLayer = new PIXI.DisplayObjectContainer();
    
    shadowLayer.alpha = 0.1;
    
	world.addChild( floorLayer );
	world.addChild( shadowLayer );
	world.addChild( entityLayer );
    world.addChild( overhangLayer );
	
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

var walls = [];

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
	
    // player updates
	handleInput();
    player.update();
	
	// avoid toe stubbing by doing closest ones first
	walls.sort( Physics.sortByDistanceTo( player.shape.center ) );
	
	Physics.collideRects( player, walls, 'PLAYER_COLLIDE_WALL' );
    
    player._beforeRender();
    
    // enemy updates
    enemies.forEach(function(enemy) {
        
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

    AnimationManager.update(delta);
    
    // z sort the middle layer
    entityLayer.children.sort(sortByDepth);

	renderer.render(stage);

	stats.end();

}

function die() { running = false; }


function shoot() {
    
    var bullet = new Bullet( player.shape.center, input.mouse.worldPosition, 4 );
	
    camera.shake(2, 50);
    
	bullets.add(bullet);
	
	entityLayer.addChild( bullet.sprite );

}



function spawn() {
    
    // make enemy
	var enemy = new Enemy( 220, 120 );
    
    enemies.add(enemy);
    
    entityLayer.addChild( enemy.sprite );
    
}


function test() {

    var importer = new TiledImporter();
    
    importer.addEventListener('complete', function(event) {
    
        var map = event.content;

        unloadMap();
        
        loadMap(map);
        
        entityLayer.addChild( player.sprite );
        
    });
    
    importer.load('assets/map2.json');
    
}
    

function unloadMap() {
    
    floorLayer.removeAll();
    shadowLayer.removeAll();
    
    walls = [];
    entityLayer.removeAll();
    
    overhangLayer.removeAll();    
}

function loadMap(map) {
 
    Game.map = map;
    
    floorLayer.addChild( map.layers.floor.sprite );
    shadowLayer.addChild( map.layers.shadows.sprite );
    walls = map.layers.walls;
    overhangLayer.addChild( map.layers.overhang.sprite );

    // move all the wall sprites into the entity layer
    reparent( walls.container, entityLayer );
        
    walls = walls.getCollidable();
    
    camera.setBounds( map.layers.floor.shape )
    
}



