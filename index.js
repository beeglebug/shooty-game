var PIXI = require('pixi.js');
var pixiTiled = require('pixi-tiled');

var renderer = new PIXI.WebGLRenderer(800, 600);
var mount = document.getElementById('app-mount');
mount.appendChild(renderer.view);

PIXI.loader.add('assets/map.json', function(res) {

    var map = res.tiledMap;

    var solid = map.getTilesByGid([2,3]);

    console.log(map, solid);

    renderer.render(map);
});

PIXI.loader.load();