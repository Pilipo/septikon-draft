var Septikon = (function(){


	var directions = {N:1,E:2,S:4,W:8};	
	var playerPositions;

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
			
			this.board = game.add.sprite(game.world.centerX, game.world.centerY, 'board');
			this.board.anchor.set(0.5);

			this.player1 = new Septikon.Player("Player 1", "Red", Septikon.playerPositions.local);
			this.player2 = new Septikon.Player("Player 2", "Blue",  Septikon.playerPositions.remote);

			this.group.add(this.board);
			this.player1.initResources(game, this.player1);
			//this.player2.initResources(game, this.player2);

			this.group.pivot = {x:game.world.centerX,y:game.world.centerY};
			this.group.x = game.world.centerX;
			this.group.y = game.world.centerY;
			this.createTiles(game);
		},
		
		createTiles: function(game){
			
			var graphics = game.add.graphics(0,0);
			
			var tileArray = [];
			
			var tileSize = 25;
			var tileCountX = 31;
			var tileCountY = 21;
			var tileGap = 4.89;
			var tileStartX = Septikon.board.x - Septikon.board.width/2 + 52;
			var tileStartY = Septikon.board.y - Septikon.board.height/2 + 51;

			
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
					currentTile.alpha = 0.2;
					
					currentTile.inputEnabled = true;
					currentTile.events.onInputDown.add(Septikon.listener, this);
					
					if(tile_col<9){
						currentTile.tileOwner = Septikon.playerPositions.local;
					}
					
					if(tile_col>22){
						currentTile.tileOwner = Septikon.playerPositions.remote;
					}
					
					
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

								tileArray[x][y].tileType = obj[prop].type;

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
		board: this.board,
		group: this.group,
		tileSize: this.tileSize = 25,
		tileCountX: this.tileCountX = 31,
		tileCountY: this.tileCountY = 21,
		tileGap: this.tileGap = 4.89,
		playerPositions: this.playerPositions = {local:1, remote:2},
		
		listener: function (obj) {
			this.player1.AddClone(obj);
		},

		xCoordsToPixel: function (x) {
			return Septikon.tileStartX + (x * (Septikon.tileSize+Septikon.tileGap));
		},

		yCoordsToPixel: function (y) {
			return Septikon.tileStartY + (y * (Septikon.tileSize+Septikon.tileGap));
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

Septikon.Game = function() {
	
}

Septikon.Player = function(name, color, playerPosition) {
	this.name = name;
	this.color = color;
		
	this.position = playerPosition;
	
	this.oxygen = [false,false,false,false,false,false,false,false,false,false];
	this.rocket = [false,false,false,false,false,false,false,false,false,false];
	this.metal = [false,false,false,false,false,false,false,false,false,false];
	this.biomass = [false,false,false,false,false,false,false,false,false,false];
	this.biodrone = [false,false,false,false,false,false,false,false,false,false];
	this.uranium = [false,false,false,false,false,false,false,false,false,false];
	this.energy1 = [false,false,false,false,false,false,false,false,false,false];
	this.energy2 = [false,false,false,false,false,false,false,false,false,false];
	
	this.rocketCollection = [];
	this.satelliteCollection = [];
	this.shieldCollection = [];
	this.biodroneCollection = [];
	this.nukeCollection = [];
	
	this.ResourceManager = {
	
		types: {
			oxygen:{id:1, name:"oxygen", startCoord:{x:5,y:0}, endCoord:{x:5,y:9}, color:0x26A7E0}, 
			rocket:{id:2, name:"rocket", startCoord:{x:4,y:0}, endCoord:{x:4,y:9}, color:0xDF3633}, 
			metal:{id:3, name:"metal", startCoord:{x:3,y:0}, endCoord:{x:3,y:9}, color:0xFFEBE6}, 
			biomass:{id:4, name:"biomass", startCoord:{x:5,y:20}, endCoord:{x:5,y:11}, color:0x95B43C}, 
			biodrone:{id:5, name:"biodrone", startCoord:{x:4,y:20}, endCoord:{x:4,y:11}, color:0xA83984}, 
			uranium:{id:6, name:"uranium", startCoord:{x:3,y:20}, endCoord:{x:3,y:11}, color:0xF45C1E}, 
			energy1:{id:7, name:"energy1", startCoord:{x:2,y:0}, endCoord:{x:2,y:9}, color:0xFCCE00}, 
			energy2:{id:8, name:"energy2", startCoord:{x:2,y:20}, endCoord:{x:2,y:11}, color:0xFCCE00}
		},
	
		GetResource: function(resourceType, player) {
		},
		PutResource: function(resourceType, player) {
			console.log(this.GetResourceCount(resourceType, player));
			
			var resource = new Septikon.Resource(game, position, {type:resourceType, player:player});
			player[resourceType].push(resource);
		},
		GetResourceCount: function(resourceType, player) {
		
			if(typeof(player[resourceType]) === "undefined")
				return false;
			
			var availableResources = 0;
			for(var i=0; i<player[resourceType].length; i++) {
				if(player[resourceType][i].isDamaged == false)
					availableResources++;
			}
			return availableResources;
		},
		CountAvailableResources: function(resourceType, player) {
			var resourceCount = 0;
			var falseFound = false;
			for(var test in player[resourceType]) {
				if(player[resourceType][test] == false) {
					falseFound = true;
					continue;
				} else {
					if(falseFound == true)
						resourceCount = 0;
					
					resourceCount++;
				}
			}
			return resourceCount;
		}
	};
	
	this.cloneCollection = [];
	
	this.AddClone = function(tile) {
	console.log(tile);
		if(tile.tileType == "warehouse" || tile.tileType == "space" || tile.tileOwner != Septikon.playerPositions.local)
			return false;
		
		if(this.ResourceManager.CountAvailableResources('oxygen',this) <= this.cloneCollection.length)
			return false;
		
		clone = new Septikon.Clone(game, 'clone', {x:tile.xCoord, y:tile.yCoord}, {texture:""});
		clone.xCoord = tile.xCoord;
		clone.yCoord = tile.yCoord;
		this.cloneCollection.push(clone);
	};
		
	this.initResources = function(game, player) {
		//fill up resources
		for(var type in player.ResourceManager.types) {
			if(player.ResourceManager.types[type].startCoord.y < player.ResourceManager.types[type].endCoord.y) {
				for(var i=0; i < 5; i++) {
					var position = {x:player.ResourceManager.types[type].startCoord.x, y:player.ResourceManager.types[type].startCoord.y+i};
					var resource = new Septikon.Resource(game, position, {type:type, player:player});
					player[type][i] = resource;
				}
			} else {
				for(var i=0; i < 5; i++) {
					var position = {x:player.ResourceManager.types[type].startCoord.x, y:player.ResourceManager.types[type].startCoord.y-i};
					var resource = new Septikon.Resource(game, position, {type:type, player:player});
					player[type][i] = resource;
				}

			}

		}
	}
}

Septikon.Resource = function(game, position, properties) {

	var graphics = game.add.graphics(25, 25);
	//console.log(properties.player.ResourceManager.types[properties.type].color);
	graphics.lineColor = 0x000000;
	graphics.lineWidth = 2;
	graphics.beginFill(properties.player.ResourceManager.types[properties.type].color);
	graphics.drawRoundedRect(0, 0, 20, 20, 8);

	this.xCoord = position.x;
	this.yCoord = position.y;
	Phaser.Sprite.call(this, game, Septikon.xCoordsToPixel(this.xCoord), Septikon.yCoordsToPixel(this.yCoord), graphics.generateTexture());
	this.anchor.set(0.5);
	this.angle = 5;
	this.type = properties.player.ResourceManager.types[properties.type];	
	this.isDamaged = false;
	
	Septikon.group.add(this);
	graphics.destroy();

}
Septikon.Resource.prototype = Object.create(Phaser.Sprite.prototype);
Septikon.Resource.prototype.constructor = Septikon.Resource;

Septikon.Clone = function(game, name, position, properties) {
	//this.player = player;
	//get the player obj
	
	this.xCoord = position.x;
	this.yCoord = position.y;
	Phaser.Sprite.call(this, game, Septikon.xCoordsToPixel(this.xCoord), Septikon.yCoordsToPixel(this.yCoord), 'clone');
	this.anchor = {x:0.5,y:0.65};
	this.scale.setTo(0.25);
	this.angle = 90;
	
	Septikon.group.add(this);
	//set color based on player obj
	//this.color = player.color;
}

Septikon.Clone.prototype = Object.create(Phaser.Sprite.prototype);
Septikon.Clone.prototype.constructor = Septikon.Clone;