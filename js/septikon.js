var Septikon = Septikon || {}

Septikon.directions = {N:1,E:2,S:4,W:8};	
Septikon.playerPositions = {local:1, remote:2};
Septikon.tileSize = 25;
Septikon.tileGap = 4.89;
Septikon.boardCenterX;
Septikon.boardCenterY;
Septikon.rollValue = 0;

	
Septikon.preload= function(game) {
	game.load.image('board', 'assets/medium_board.png');
	game.load.image('clone', 'assets/clone.png');
};
		
Septikon.getLegalMoves= function(moves, currentCoord, previousCoord) {
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
				for(index in returnArray) {
					if(JSON.stringify(returnArray[index]) !== JSON.stringify(currentCoord))
						legalMoves.push(returnArray[index]);
				}
			}
		}
	}
	return legalMoves;
};
		
Septikon.create= function(game) {
	this.group = game.add.group();
	this.groupHUDRight = game.add.group();
	this.groupHUDLeft = game.add.group();

	Septikon.board = game.add.sprite(game.world.centerX, game.world.centerY, 'board');
	Septikon.board.anchor.set(0.5);
	
	Septikon.boardCenterX = game.world.centerX;
	Septikon.boardCenterY = game.world.centerY;
	
	this.player1 = new Septikon.Player("Player 1", "Red", Septikon.playerPositions.local);
	this.player2 = new Septikon.Player("Player 2", "Blue",  Septikon.playerPositions.remote);

	this.group.add(Septikon.board);
	Septikon.tileStartX = Septikon.board.x - Septikon.board.width/2 + 52;
	Septikon.tileStartY = Septikon.board.y - Septikon.board.height/2 + 51;

	this.player1.initResources(game, this.player1);
	//this.player2.initResources(game, this.player2);

	this.group.pivot = {x:game.world.centerX,y:game.world.centerY};
	this.group.x = Septikon.boardCenterX;
	this.group.y = Septikon.boardCenterY;
	
	this.groupHUDRight.x = game.world.width;
	
	Septikon.tileCollection = this.createTiles(game);
	
	Septikon.player1HUD = new Septikon.HUD(game, 'player1-HUD', "right", {title:this.player1.name});
	//Septikon.logsHUD = new Septikon.HUD(game, 'logs-HUD', "left");
};

Septikon.update = function() {
	
}
		
Septikon.createTiles= function(game){
	
	var graphics = game.add.graphics(0,0);
	
	var tileArray = [];
	
	var tileCountX = 31;
	var tileCountY = 21;

	
	graphics.beginFill(0xFF3300);
	graphics.lineStyle(1, 0xffd900, 1);
	graphics.drawRoundedRect(0, 0, Septikon.tileSize, Septikon.tileSize, 2);
	 
	for(var tile_col = 0; tile_col < tileCountX; tile_col++)
	{
		for(var tile_row = 0; tile_row < tileCountY; tile_row++)
		{
			currentTile = game.add.sprite(Septikon.tileSize, Septikon.tileSize, graphics.generateTexture());
			currentTile.anchor.set(0.5);
			currentTile.title = "tile_" + tile_col + "_" + tile_row;
			currentTile.x = Septikon.tileStartX + (Septikon.tileSize * tile_col) + (Septikon.tileGap * tile_col);
			currentTile.y = Septikon.tileStartY + (Septikon.tileSize * tile_row) + (Septikon.tileGap * tile_row);
			currentTile.alpha = 0;
			
			currentTile.illuminate = function(currentTile){
				game.time.events.add(2000, function() {    
					game.add.tween(currentTile).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
				}, this);
				
				currentTile.alpha = 1;
			}
			
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
};
		
		
Septikon.listener= function (obj) {
	Septikon.player1.AddClone(obj);
};

Septikon.test = function(obj){
	if(Septikon.rollValue == 0)
		return false;
	
	var moves = Septikon.getLegalMoves(Septikon.rollValue, {x:obj.xCoord,y:obj.yCoord});
	var tile;
	for (i in moves){
		tile = Septikon.tileCollection[moves[i].x][moves[i].y];
		tile.illuminate(tile);
	}
	
}
Septikon.xCoordsToPixel= function (x) {
	return Septikon.tileStartX + (x * (Septikon.tileSize+Septikon.tileGap));
};

Septikon.yCoordsToPixel= function (y) {
	return Septikon.tileStartY + (y * (Septikon.tileSize+Septikon.tileGap));
};

Septikon.checkWall= function (direction, currentCoord) {

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
};

Septikon.rollDice= function(){
	roll = Math.floor(Math.random() * 6) + 1;
	Septikon.rollValue = roll;
	//roll = 2;
	console.log("=================");
	
	for(index in Septikon.player1.cloneCollection){
		x = Septikon.player1.cloneCollection[index].xCoord;
		y = Septikon.player1.cloneCollection[index].yCoord;
		console.log("Clone: x:"+x+":"+"y:"+y)
		console.log("Legal moves:");
		console.log(Septikon.getLegalMoves(roll,{x:parseInt(x), y:parseInt(y)}));
		console.log("=================");
	}
	Septikon.player1HUD.rollText.text = roll;
	return roll;  
};

Septikon.getCoordFromDirection= function(originCoord,direction) {

	var dir={North:{x:0,y:-1},East:{x:1,y:0},South:{x:0,y:1},West:{x:-1,y:0}};
	
	return {x:(parseInt(originCoord.x) + parseInt(dir[direction].x)), y:(parseInt(originCoord.y) + parseInt(dir[direction].y))};
		
};

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
		if(tile.tileType == "warehouse" || tile.tileType == "space" || tile.tileOwner != Septikon.playerPositions.local)
			return false;
		
		if(this.ResourceManager.CountAvailableResources('oxygen',this) <= this.cloneCollection.length)
			return false;
		
		clone = new Septikon.Clone(game, 'clone', {x:tile.xCoord, y:tile.yCoord}, {texture:""});
		clone.xCoord = parseInt(tile.xCoord);
		clone.yCoord = parseInt(tile.yCoord);
		clone.inputEnabled = true;
		clone.events.onInputDown.add(Septikon.test, clone);

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
	graphics.lineColor = 0x000000;
	graphics.lineWidth = 2;
	graphics.beginFill(properties.player.ResourceManager.types[properties.type].color);
	graphics.drawRoundedRect(0, 0, 20, 20, 8);

	this.xCoord = position.x;
	this.yCoord = position.y;
	Phaser.Sprite.call(this, game, Septikon.xCoordsToPixel(this.xCoord), Septikon.yCoordsToPixel(this.yCoord), graphics.generateTexture());
	this.anchor.set(0.5);
	this.angle = Math.floor(Math.random() * 21) - 5;
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

Septikon.HUD = function(game, name, orientation, properties) {
	var hudGraphic = game.add.graphics(25, 25);
	hudGraphic.lineColor = 0x000000;
	hudGraphic.lineWidth = 2;
	hudGraphic.beginFill(0xF98C15);
	hudGraphic.drawRoundedRect(0, 0, 280, 500, 15);
	Phaser.Sprite.call(this, game, 0, Septikon.boardCenterY, hudGraphic.generateTexture());
	
	var rollGraphic = game.add.graphics(25, 25);
	rollGraphic.lineColor = 0x000000;
	rollGraphic.lineWidth = 2;
	rollGraphic.beginFill(0x952327);
	rollGraphic.drawRoundedRect(0, 0, 50, 50, 15);
	//var rollSprite = game.add.sprite(-75, Septikon.boardCenterY, rollGraphic.generateTexture());
	var rollButton = game.add.button(-75, Septikon.boardCenterY, rollGraphic.generateTexture(), Septikon.rollDice, this);
	
	rollButton.anchor.set(0.5);
	
	this.anchor = {x:0.5,y:0.5};
	
	Septikon.groupHUDRight.add(this);
	Septikon.groupHUDRight.add(rollButton);
	
	var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
	this.text = game.add.text(hudGraphic.width/4*-1, Septikon.boardCenterY-hudGraphic.height/2+40, properties.title, style, Septikon.groupHUDRight);
	this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4);
	this.text.anchor.set(0.5);
	
	this.rollText = game.add.text(rollButton.x, rollButton.y, "Roll", style, Septikon.groupHUDRight);
	this.rollText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4);
	this.rollText.anchor.set(0.5);

	hudGraphic.destroy();
	rollGraphic.destroy();
}
Septikon.HUD.prototype = Object.create(Phaser.Sprite.prototype);
Septikon.HUD.prototype.constructor = Septikon.HUD;