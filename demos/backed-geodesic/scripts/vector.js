
// vector

define({
  
  Vector3 : function (x,y,z) {
    
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.dot = function(vec2) {
      return this.x * vec.x + this.y * vec2.y + this.z * vec2.z;
    };
  
    this.cross = function(vec2) {
      return new Vector3(
        this.y * vec2.z - this.z * vec2.y,
        this.z * vec2.x - this.x * vec2.z,
        this.x * vec2.y - this.y * vec2.x
      );
    };
    
    this.add = function(vec2) {
      return new Vector3(
        this.x + vec2.x,
        this.y + vec2.y,
        this.z + vec2.z
      );
    };
    
    this.sub = function(vec2) {
      return new Vector3(
        this.x - vec2.x,
        this.y - vec2.y,
        this.z - vec2.z
      );
    };
    
    this.scale = function(c) {
      return new Vector3(
        this.x * c,
        this.y * c,
        this.z * c
      );
    };
    
    this.pushOnto = function(list) {
      list.push(this.x);
      list.push(this.y);
      list.push(this.z);
    };
    
  }
  
})
