var Septikon = (function(){

	var board;
	var clone;

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
	
	var group;
	//var worldScale = 1;
	
	

	return {
	
		preload: function(game) {
			game.load.image('board', 'assets/medium_board.png');
			game.load.image('clone', 'assets/clone.png');
		},
		
		getLegalMoves: function(moves, currentCoord, previousCoord) {
			moves--;
			var legalMoves = [];
			
			dir={North:1,East:2,South:4,West:8};
		
			for(direction in dir)
			{	
				//CHECK FOR LOCKS
				
				var moveCheck = this.getCoordFromDirection(currentCoord,direction);
				
				if(Septikon.checkWall(direction, currentCoord) === true &&  ((typeof previousCoord === 'undefined') || ((typeof previousCoord !== 'undefined') && (JSON.stringify(moveCheck) !== JSON.stringify(previousCoord))))) {
					if(moves==0){
						legalMoves.push(moveCheck);
					}
					else {
						var returnArray = (Septikon.getLegalMoves(moves, moveCheck, currentCoord));
						for(var i=0; i<returnArray.length; i++) {
							if(JSON.stringify(returnArray[i]) !== JSON.stringify(currentCoord))
								legalMoves.push(returnArray[i]);
						}
					}
				}
			}
			return legalMoves;
		},
		
		create: function(game) {
		
			this.group = game.add.group();
		
			this.board = game.add.sprite(0, 0, 'board');
			this.clone = game.add.sprite(Septikon.xCoordsToPixel(0), Septikon.yCoordsToPixel(0), 'clone');
			
			this.clone.xCoord = 0;
			this.clone.yCoord = 0;
			this.clone.anchor.set(0.5);
			game.physics.arcade.enable(this.clone);
			this.clone.scale.setTo(0.25);
			this.clone.angle = 90;
			
			this.group.add(this.board);
			this.group.add(this.clone);
			this.group.pivot = {x:500,y:350};
			this.group.x = 500;
			this.group.y = 350;
			
			
		},
		
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
					
					this.group.add(currentTile);
					
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
		
		clone: this.clone,
		
		group: this.group,
		
		listener: function (obj) {
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

		checkWall: function (direction, currentCoord) {
		
			var dir={North:1,East:2,South:4,West:8};
			
			switch (direction){
				case "North": //UP
					if (parseInt(WALL_GRID[currentCoord.x][currentCoord.y]&dir.North) == 0) {
						return true;
					}
					break;
				case "South": //DOWN
					if (parseInt(WALL_GRID[currentCoord.x][currentCoord.y]&dir.South) == 0) {
						return true;
					}
					break;
				case "East": // right arrow key
					if (parseInt(WALL_GRID[currentCoord.x][currentCoord.y]&dir.East) == 0) {
						return true;
					}
					break;
				case "West": // left arrow key
					if (parseInt(WALL_GRID[currentCoord.x][currentCoord.y]&dir.West) == 0) {
						return true;
					}
					break;
				default:
					return false;
			}
		},
		
		rollDice: function(){
			roll = Math.floor(Math.random() * 6) + 1;
			console.log(Septikon.getLegalMoves(3,{x:1,y:10}));
			return roll;  
		}, 
		
		getCoordFromDirection: function(originCoord,direction) {
		
			var dir={North:{"y":-1},East:{"x":1},South:{"y":1},West:{"x":-1}};
			
			if (typeof(dir[direction].y) !== "undefined")
				return {x:originCoord.x, y: originCoord.y + parseInt(dir[direction].y)};
				
			if (typeof(dir[direction].x) !== "undefined")
				return {x:originCoord.x + parseInt(dir[direction].x), y: originCoord.y}
		}
	
	};

})();