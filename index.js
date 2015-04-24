var PIXI = require('pixi.js');
var pixiTiled = require('pixi-tiled');

var renderer = new PIXI.WebGLRenderer(800, 600);
var mount = document.getElementById('app-mount');
mount.appendChild(renderer.view);

var loader = new PIXI.loaders.Loader();

loader.use(pixiTiled.tiledMapParser);

loader.add('assets/map.json', function(res) {

    console.log(res.tiledMap);

    renderer.render(res.tiledMap);
});

loader.load();