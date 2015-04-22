var PIXI = require('pixi.js');
var Input = require('js-game-lib').Input;
var TiledImporter = require('./src/TiledImporter');

var Stage = PIXI.Stage;
var Renderer = PIXI.WebGLRenderer;
var DisplayObjectContainer = PIXI.DisplayObjectContainer;

// pixel goodness
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var width = 800;
var height = 450;
var stage = new Stage(0x0000000);
var renderer = new Renderer( width, height );
//var world = new DisplayObjectContainer();


// dom binding
var mount = document.getElementById('app-mount');
mount.appendChild(renderer.view);

Input.bindKeyboard(document.body);
Input.bindMouse(document.body);


// build map
var importer = new TiledImporter();

importer.on('complete', function(map) {

    console.log(map);

    //loadMap(map);
});

importer.load('assets/map.json');