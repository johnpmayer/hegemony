
// vector

define(function() {

  var Vector3 = function (x,y,z) {
    
    this.x = x;
    this.y = y;
    this.z = z;
    
  };
  
  function convert(Vec) {
    return new Vector3(Vec.X, Vec.Y, Vec.Z)
  }
  
  Vector3.prototype = {
    
    dot : function(vec2) {
      return this.x * vec.x + this.y * vec2.y + this.z * vec2.z;
    },
    
    cross : function(vec2) {
      return new Vector3(
        this.y * vec2.z - this.z * vec2.y,
        this.z * vec2.x - this.x * vec2.z,
        this.x * vec2.y - this.y * vec2.x
      );
    },
    
    add : function(vec2) {
      return new Vector3(
        this.x + vec2.x,
        this.y + vec2.y,
        this.z + vec2.z
      );
    },
    
    sub : function(vec2) {
      return new Vector3(
        this.x - vec2.x,
        this.y - vec2.y,
        this.z - vec2.z
      );
    },
    
    scale : function(c) {
      return new Vector3(
        this.x * c,
        this.y * c,
        this.z * c
      );
    },
    
    mid : function(vec2) {
      var diff = vec2.sub(this);
      return this.add(diff.scale(1/2));
    },
    
    magnitude : function() {
      var x = this.x;
      var y = this.y;
      var z = this.z;
      return Math.sqrt(x*x + y*y + z*z);
    },
    
    normalize : function() {
      var mag = this.magnitude();
      return this.scale(1/mag);
    }
    
  };

  // 0 <= theta < 2 * Math.PI
  // -Math.PI <= phi <= Math.PI
  var fromSpherical = function(r, theta, phi) {
    var x = r * Math.cos(phi) * Math.cos(theta);
    var y = r * Math.sin(phi);
    var z = r * Math.cos(phi) * Math.sin(theta);
    return new Vector3(x,y,z);
  };
  
  return {
    Vector3 : Vector3,
    convert : convert,
    fromSpherical : fromSpherical
  };
  
});
