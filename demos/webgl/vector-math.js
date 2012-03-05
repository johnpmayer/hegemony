function Matrix4x3() {
  this.d = new Float32Array(16);
  this.d[0] = 1;
  this.d[5] = 1;
  this.d[10] = 1;
  this.d[15] = 1;
}

Matrix4x3.prototype = {
  
  make : function(x1, x2, x3, y1, y2, y3, z1, z2, z3, t1, t2, t3) {
    this.d[0]  = x1;
    this.d[1]  = x2;
    this.d[2]  = x3;
    this.d[4]  = y1;
    this.d[5]  = y2;
    this.d[6]  = y3;
    this.d[8]  = z1;
    this.d[9]  = z2;
    this.d[10] = z3;
    this.d[12] = t1;
    this.d[13] = t2;
    this.d[14] = t3;
    return this;
  },
  
  makeIdentity : function() {
    return this.make(1,0,0, 0,1,0, 0,0,1, 0,0,0);
  },
  
  makeRotate : function(angle, x, y, z) {
    var invlen = 1 / Math.sqrt(x*x + y*y + z*z);
    var n = { x : invlen * x,
              y : invlen * y,
              z : invlen * z };
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1 - c;
    
    this.d[0]  = t*n.x*n.x + c;
    this.d[1]  = t*n.x*n.y + s*n.z;
    this.d[2]  = t*n.x*n.z - s*n.y;
    this.d[4]  = t*n.x*n.y - s*n.z;
    this.d[5]  = t*n.y*n.y + c;
    this.d[6]  = t*n.y*n.z + s*n.x;
    this.d[8]  = t*n.x*n.z + s*n.y;
    this.d[9]  = t*n.y*n.z - s*n.x;
    this.d[10] = t*n.z*n.z + c;
    this.d[12] = this.d[13] = this.d[14] = 0;
    return this;
  },
  
  multiply : function(m) {
    this.make(
      this.d[0]*m.d[0] + this.d[4]*m.d[1] + this.d[8]*m.d[2],
      this.d[1]*m.d[0] + this.d[5]*m.d[1] + this.d[9]*m.d[2],
      this.d[2]*m.d[0] + this.d[6]*m.d[1] + this.d[10]*m.d[2],
      
      this.d[0]*m.d[4] + this.d[4]*m.d[5] + this.d[8]*m.d[6],
      this.d[1]*m.d[4] + this.d[5]*m.d[5] + this.d[9]*m.d[6],
      this.d[2]*m.d[4] + this.d[6]*m.d[5] + this.d[10]*m.d[6],
      
      this.d[0]*m.d[8] + this.d[4]*m.d[9] + this.d[8]*m.d[10],
      this.d[1]*m.d[8] + this.d[5]*m.d[9] + this.d[9]*m.d[10],
      this.d[2]*m.d[8] + this.d[6]*m.d[9] + this.d[10]*m.d[10],
      
      this.d[0]*m.d[12] + this.d[4]*m.d[13] + this.d[8]*m.d[14] + this.d[12],
      this.d[1]*m.d[12] + this.d[5]*m.d[13] + this.d[9]*m.d[14] + this.d[13],
      this.d[2]*m.d[12] + this.d[6]*m.d[13] + this.d[10]*m.d[14] + this.d[14]
    );
    return this;
  }

};

globalGLMatrixState = {
  modelMatrix : new Matrix4x3()
};

function modelMatrix() {
  return globalGLMatrixState.modelMatrix;
}
