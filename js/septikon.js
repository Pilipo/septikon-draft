var Septikon = (function(){

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
	
	var tileArray = {};
	
	//TESTING
	var counter = 0;
	//END TESTING

	return {
	
		createTiles: function(game){
			
			var graphics = game.add.graphics(0,0);
			
			graphics.beginFill(0xFF3300);
			graphics.lineStyle(1, 0xffd900, 1);
			graphics.drawRoundedRect(0, 0, tileSize, tileSize, 2);
			 
			for(var tile_col = 0; tile_col < tileCountX; tile_col++)
			{
				for(var tile_row = 0; tile_row < tileCountY; tile_row++)
				{
					currentTile = game.add.sprite(tileSize, tileSize, graphics.generateTexture());
					currentTile.anchor.set(0.5);
					currentTile.title = "tile_" + tile_col + "_" + tile_row;
					currentTile.x = tileStartX + (tileSize * tile_col) + (tileGap * tile_col);
					currentTile.y = tileStartY + (tileSize * tile_row) + (tileGap * tile_row);
					currentTile.alpha = 0.1;
					
					currentTile.inputEnabled = true;
					currentTile.events.onInputDown.add(Septikon.listener, this);
					
					if (typeof tileArray[tile_col] == 'undefined') 
						tileArray[tile_col] = [];
						
					tileArray[tile_col][tile_row] = currentTile;
					
				}
			}
				
			$(function () {
				$.ajaxSetup({
					cache:false
				});
				
				$.getJSON( "js/tiles.json", function( data ) {
					for(var key in data) {
						if (!data.hasOwnProperty(key)) continue;
						
						var obj = data[key];
						for (var prop in obj) {
							// skip loop if the property is from prototype
							if(!obj.hasOwnProperty(prop)) continue;
							
							var locationCount = obj[prop].locations.length;
							for( var i = 0; i < locationCount; i++) {
								
								var coords = obj[prop].locations[i].split(",");
								var x = coords[0];
								var y = coords[1];
								
								tileArray[x][y].xCoord = x;
								tileArray[x][y].yCoord = y;

								if (typeof tileArray[x][y] != 'undefined')
									tileArray[x][y].tileName = obj[prop].name;
								else
									console.log(x + ":" + y + " not found!");
								 
								if (typeof obj[prop].properties != 'undefined') {
									tileArray[x][y].tileResourceCostCount = obj[prop].properties.resourceCostCount;
									tileArray[x][y].tileResourceCostType = obj[prop].properties.resourceCostType;
								}
							}
						}
					}
				});
			});
			
			graphics.destroy();
			
			return tileArray;
		},
	
		listener: function (obj) {
			counter++;
			game.helpTitle.text = "You clicked the " + obj.tileName + " tile at " + obj.xCoord + "," + obj.yCoord + "!";
			
			if (typeof obj.tileResourceCostCount != 'undefined')
				game.helpInfo.text = "The cost is " + obj.tileResourceCostCount + " " + obj.tileResourceCostType;
			else
				game.helpInfo.text = "It does not cost anything";
		},

		xCoordsToPixel: function (x) {
			return tileStartX + (x * (tileSize+tileGap));
		},

		yCoordsToPixel: function (y) {
			return tileStartY + (y * (tileSize+tileGap));
		},

		checkWall: function (direction, x, y) {
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
	
	};

})();