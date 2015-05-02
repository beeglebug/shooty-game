var PIXI = require('pixi.js');
var pixiTiled = require('pixi-tiled');
var Rect = require('gm2-rect');
var Circle = require('gm2-circle');
var Collision = require('gm2-collision');
var Vector2 = require('gm2-vector2');


var renderer = new PIXI.WebGLRenderer(800, 600);
var mount = document.getElementById('app-mount');
mount.appendChild(renderer.view);

PIXI.loader.add('assets/map.json', function(res) {

    var map = res.tiledMap;

    var solid = map.getTilesByGid([2,3]);

    var collidables = solid.map(function(tile) {
        return new Rect(tile.width, tile.height, tile.position);
    });

    console.log(collidables);

    var c = new Circle(100);
    c.position.set(100,100);
    var r1 = new Rect(25,25);
    var r2 = new Rect(100,100);

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFF0000);
    collidables.forEach(function(rect) {
        graphics.drawRect(rect.position.x, rect.position.y, rect.width, rect.height);
    });

    console.log(
        Collision.circleRect(c, r1),
        Collision.circleRect(c, r2)
    );

    var stage = new PIXI.Container();
    stage.addChild(map);
    stage.addChild(graphics);

    renderer.render(stage);
});

PIXI.loader.load();


