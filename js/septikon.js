var tileSize = 25;
var tileCountX = 31;
var tileCountY = 21;
var tileGap = 4.89;
var tileStartX = 52;
var tileStartY = 51;

var North = 1;
var South = 4;
var East = 2;
var West = 8;

//TESTING
var counter = 0;
//END TESTING

function CreateHitTiles() {
    
    var tileArray = [];
    var graphics = game.add.graphics(0,0);
    
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(1, 0xffd900, 1);
    graphics.drawRoundedRect(0, 0, tileSize, tileSize, 2);
    
    console.log(tileArray);
    
    for(var tile_col = 0; tile_col < tileCountX; tile_col++)
    {
        for(var tile_row = 0; tile_row < tileCountY; tile_row++)
        {
            currentTile = this.game.add.sprite(tileSize, tileSize, graphics.generateTexture());
            currentTile.anchor.set(0.5);
            currentTile.name = "tile_" + tile_col + "_" + tile_row;
            currentTile.x = tileStartX + (tileSize * tile_col) + (tileGap * tile_col);
            currentTile.y = tileStartY + (tileSize * tile_row) + (tileGap * tile_row);
            currentTile.alpha = 0.1;
            
            currentTile.inputEnabled = true;
            currentTile.events.onInputDown.add(listener, this);
            
            tileArray[currentTile.name] = currentTile;
        }
    }
    
    graphics.destroy();
}

function listener () {

    counter++;
    game.text.text = "You clicked " + counter + " times!";

}

function xCoordsToPixel(x) {
    return tileStartX + (x * (tileSize+tileGap));
}

function yCoordsToPixel(y) {
    return tileStartY + (y * (tileSize+tileGap));
}

// direction in "North" "South" "East" "West"
// x is the starting point prior to movement
// y is the starting point prior to movement

function checkWall(direction, x, y) {
    switch (direction){
        case "North": //UP
            if (parseInt(WALL_GRID[x][y]&1) == 0) {
                return true;
            }
            break;
        case "South": //DOWN
            if (parseInt(WALL_GRID[x][y]&4) == 0) {
                return true;
            }
            break;
        case "East": // right arrow key
            if (parseInt(WALL_GRID[x][y]&2) == 0) {
                return true;
            }
            break;
        case "West": // left arrow key
            if (parseInt(WALL_GRID[x][y]&8) == 0) {
                return true;
            }
            break;
        default:
            return false;
    }
}
