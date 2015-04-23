var PIXI = require('pixi.js');
var pixiTiled = require('pixi-tiled');

var loader = new PIXI.loaders.Loader();

loader.use(pixiTiled.tiledParser);

loader.add('assets/map.json');

loader.once('complete', function() {

    console.log('files loaded');

});

loader.load();