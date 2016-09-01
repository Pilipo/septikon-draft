var Septikon = Septikon || {};

Septikon.Player = function (name, color){
	this.Name = name;
	this.Color = color;
	
	this.ResourceManager = console.log("Build a ResourceManager!");
};

Septikon.Player.prototype = Object.create(Object);
Septikon.Player.prototype.constructor = Septikon.Player;
