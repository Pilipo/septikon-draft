function Tile() {
  {
	this.x= 0,
	this.y= 0,
	this.wall= 0,
	this.is_start= false,
	this.is_lock=false,
	this.is_rec_energy=false,
	this.is_rec_metal=false,
	this.is_rec_rocket=false,
	this.is_rec_oxygen=false,
	this.is_rec_nuke=false,
	this.is_rec_merc=false,
	this.is_rec_biomass=false
  };
}
Tile.prototype = new createjs.Shape();

Tile.prototype.store = function(name, value) {
  this.values[name] = value;
};
Tile.prototype.lookup = function(name) {
  return this.values[name];
};
Tile.prototype.contains = function(name) {
  return Object.prototype.hasOwnProperty.call(this.values, name) &&
    Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Tile.prototype.each = function(action) {
  forEachIn(this.values, action);
};

function forEachIn(object, action) {
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property))
      action(property, object[property]);
  }
};