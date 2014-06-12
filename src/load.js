var assets = [
	'assets/tiles.png',
	'assets/player.png',
	'assets/bullet.png',
	'assets/crosshair.png',
	'assets/shadows.png',
	'assets/player-shadow.png',
    'assets/bullet-hit.png',
    'assets/enemy.png',
    'assets/map.json'
];

var loader = new PIXI.AssetLoader(assets);

loader.addEventListener('onComplete', init);