function sortByDepth(a,b) { return a.y - b.y; }

function setPixelAnchor( sprite, x, y ) {
    
    sprite.anchor.x = x / sprite.width;
    sprite.anchor.y = y / sprite.height;
    
}

function reparent(from, to) {

    for(var i = from.children.length - 1; i >= 0; i--) {
        to.addChild( from.children[i] );
    }
    
}