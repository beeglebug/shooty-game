var assets = [
	'assets/tiles.png',
	'assets/player.png',
	'assets/bullet.png',
	'assets/crosshair.png',
	'assets/shadow.png',
	'assets/player-shadow.png',
	'assets/enemy.png',
    'assets/tiny16.png',
	
];

var loader = new PIXI.AssetLoader(assets);

loader.addEventListener('onComplete', init);