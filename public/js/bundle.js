/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// setup globaL stuff
var width = 800;
var height = 450;
var stage = new PIXI.Stage(0x0000000);
var renderer = PIXI.autoDetectRenderer( width, height );
var input = new Input();
var stats = new Stats();
var world = new PIXI.DisplayObjectContainer();
var DEBUG = false;

// pixelly goodness
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var Game = {
    mapCache : {},
    scale : 3,
};

function init(data) {

    // dom binding
    document.querySelector('.canvas-container').appendChild(renderer.view);
    input.bindKeyboard(document.body);
    input.bindMouse(document.body);
    document.body.appendChild( stats.domElement );
    
    // make entity groups
    bullets = new Group();
    enemies = new Group();

    
	// build map
    var importer = new TiledImporter();
    
    importer.addEventListener('complete', function(event) {
    
        map = event.content;
    
        loadMap(map);
        
    });
    
    importer.load('assets/map.json');

    entityLayer = new PIXI.DisplayObjectContainer();

    debugLayer = new PIXI.Graphics();
    
	// make player
	player = new Entity();
	
    player.sprite = new PIXI.Sprite( PIXI.TextureCache['assets/player.png'] );
    player.sprite.anchor.set(0.25, 0.5);
    player.position.set(155,200);
	player.shape = new Rect(8, 8);

    entityLayer.addChild( player.sprite );

	player.addEventListener( 'PLAYER_COLLIDE_WALL', function( wall, response ) {
		this.position.add( response.mtd );
        this.updateShape();
	});
    
    player.addEventListener( 'ENEMY_COLLIDE_PLAYER', function( enemy, response ) {
		
        enemy.position.add( response.mtd );
        enemy.updateShape();
        
	});

    makeEnemy(32,32);    
    makeEnemy(64,32);    
    makeEnemy(96,32);    
    
    makeEnemy(20,480);
    makeEnemy(60,480);
    
    makeEnemy(305,465);
    
    makeEnemy(120,270);
    
    makeEnemy(315,295);
    makeEnemy(345,295);
    
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
	world.addChild( debugLayer );
    
	// cursor overlay
	cursor = PIXI.Sprite.fromImage( 'assets/crosshair.png' );
	cursor.anchor.set( 0.5, 0.5 );

	// things attached to camera are fixed (ui etc)
	camera.container.addChild( cursor );
	
    setScale(Game.scale);
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
        
        aaaiii(enemy);
        
        enemy.update(delta);
       
        // @todo sort walls by distance to enemy?
        
        Physics.collideRects( enemy, walls, 'ENEMY_COLLIDE_WALL' );
        
        Physics.collideRects( enemy, [player], 'ENEMY_COLLIDE_PLAYER' );
	
        enemy._beforeRender();
    });
    
    // bullet updates
	bullets.forEach(function(bullet) {
	
		bullet.update(delta);
		
		Physics.collideRects( bullet, walls, 'BULLET_COLLIDE_WALL' );
		
        Physics.collideRects( bullet, enemies.all(), 'BULLET_COLLIDE_ENEMY', true );

        bullet._beforeRender();
        
	});

	camera.update(delta);
	UI.update();	

    AnimationManager.update(delta);
    
    // z sort the middle layer
    entityLayer.children.sort(sortByDepth);

    renderDebug();
    
	renderer.render(stage);

    
	stats.end();

}

function die(message) {
    console.log(message);
    running = false;
}


var lastShoot;
var shootAccumulator = 0;

function shoot() {

    var now = +new Date();
    var fireRate = 1000 / 5;

    if(!lastShoot) {
        // first shot of a burst
        lastShoot = now - fireRate; // so delta == fireRate
    }
    
    var delta = now - lastShoot;
    
    shootAccumulator += delta;
    
    while(shootAccumulator > fireRate) {

        shootAccumulator -= fireRate;
        
        camera.shake(2,100);
        
        var bullet = new Bullet( player.shape.center, input.mouse.worldPosition );    
        
        bullets.add(bullet);
        
        entityLayer.addChild( bullet.sprite );
     
    }
    
    lastShoot = now;

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
    
    // @todo move enemy loading etc to some function after map has loaded
	loop();
}

function setScale(scale) {
 
    Game.scale = scale;
    world.scale.set(scale, scale);
    camera.container.scale.set(scale, scale);
    
    //camera.scaleCenter(1/scale);
    camera.setTarget(camera.target);

}


function renderDebug() {
    
    if(!DEBUG) { return; }
    
    var gfx = debugLayer;
    
    gfx.clear();
    
    gfx.lineStyle(1, 0xFF0000);
    
    enemies.forEach(function(enemy) {
       
        gfx.drawRect( enemy.shape.position.x, enemy.shape.position.y, enemy.shape.width, enemy.shape.height );    
        
    });
    
    gfx.lineStyle(1, 0x00FF00);
    
    gfx.drawRect( player.shape.position.x, player.shape.position.y, player.shape.width, player.shape.height );
    
    gfx.lineStyle(1, 0xFFFFFF);
    
    gfx.drawCircle( player.shape.position.x, player.shape.position.y, 1 );
    
    var target = player.position._add(player.velocity._multiply(30));
    
    gfx.drawCircle( target.x, target.y, 1 );
    
    gfx.lineStyle(1, 0x0000FF);
    
    var cursor = input.mouse.worldPosition;
    var diff = cursor._subtract(player.position).divide(5);
        
    gfx.drawCircle( 
        player.position.x + diff.x,
        player.position.y + diff.y,
    1 );
    
    
}

function makeEnemy(x,y) {
 
    enemy = new Enemy(x,y);
    enemies.add(enemy);
    entityLayer.addChild(enemy.sprite);
    
    enemy.addEventListener( 'ENEMY_DIED', function() {
    
        Analytics.track('ENEMY_KILLED');
 
        if(enemies.length == 0) {
            Analytics.track('ALL_ENEMIES_KILLED');
        }
    
    });
    
    
}





/***/ })
/******/ ]);