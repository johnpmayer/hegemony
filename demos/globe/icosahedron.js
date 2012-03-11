

function Icosahedron() {
  
  /* The icosahedron is a regular polyhedron comprised of 20 equilateral
     triangles. We define it's construction in spherical coordinates,
     inscribed on a sphere of radius 1. */
  
  this.init = function() {
    this.initPolyhedron();
    this.initMesh();
  };
  
  this.initPolyhedron = function() {
    this.initRawVertices();
    this.initRawIndices();
  };
  
  this.initMesh = function() {
    this.initCoordinates();
    this.initMaterials();
  };
  
  this.initRawVertices = function() {
    
    this.rawVertices = [];
    
    // North Pole
    this.rawVertices.push(new Vector3(0,1,0));
    
    // Upper Ring
    for (var i = 0; i < 5; i++) {
      var t = Math.PI * 2*i / 5
      this.rawVertices.push(new Vector3(
        Math.cos(t),
        0.5,
        Math.sin(t)
      ));
    }
    
    // Lower Ring
    for (var i = 0; i < 5; i++) {
      var t = Math.PI * (2*i + 1) / 5;
      this.rawVertices.push(new Vector3(
        Math.cos(t),
        -0.5,
        Math.sin(t)
      ));
    }
     
    // South Pole
    this.rawVertices.push(new Vector3(0,-1,0));
    
  };
  
  this.initRawIndices = function() {
    
    this.rawIndices = [];
    this.numFaces = 0;
    
    // top
    for (var i = 1; i <= 5; i += 1) {
      this.rawIndices.push(0);
      this.rawIndices.push(i);
      this.rawIndices.push(i % 5 + 1);
      this.numFaces += 1;
    }
    
    // upper-mid
    for (var i = 1; i <= 5; i += 1) {
      this.rawIndices.push(i);
      this.rawIndices.push(i+5);
      this.rawIndices.push(i % 5 + 1);
      this.numFaces += 1;
    }
    
    // lower-mid
    for (var i = 1; i <= 5; i += 1) {
      this.rawIndices.push(i);
      if (i === 1) {
        this.rawIndices.push(10);
      } else {
        this.rawIndices.push(i+4);
      }
      this.rawIndices.push(i+5);
      this.numFaces += 1;
    }
    
    // bottom
    for (var i = 6; i <= 10; i+= 1) {
      this.rawIndices.push(11);
      this.rawIndices.push(i);
      if (i === 6) {
        this.rawIndices.push(10);
      } else {
        this.rawIndices.push(i-1);
      }
      this.numFaces += 1;
    }
    
  };
  
  this.subdivide = function(divisions) {
    var n = Math.floor(divisions);
    if (n < 2) {throw "Illegal subdivision factor: " + n}
    
    var rawIndices = this.rawIndices;
    var rawVertices = this.rawVertices;
    
    this.vertexGridCollection = [];
    
    for (var i = 0; i < rawIndices.length; i += 3) {
      var p0 = rawVertices[rawIndices[i]];
      var p1 = rawVertices[rawIndices[i+1]];
      var p2 = rawVertices[rawIndices[i+2]];
      
      var vertexGrid = [];
      
      var a = p1.sub(p0).scale(1/n);
      var b = p2.sub(p0).scale(1/n);
      
      for (var j = 0; j <= n; j += 1) {
        vertexGrid.push([]);
        for (var k = 0; k <= (n-j); k++) {
          vertexGrid[j].push(p0.add(a.scale(j)).add(b.scale(k)));
        }
      }
      
      this.vertexGridCollection.push(vertexGrid);
      
    }
    
  }
  
  this.initCoordinates = function() {
    
    this.vertexPositions = [];
    this.vertexNormals = [];
    this.indices = [];
    
    var nextIndex = 0;
    
    for (var i = 0; i < this.numFaces; i += 1) {
      
      var p0 = this.rawVertices[this.rawIndices[i*3]];
      var p1 = this.rawVertices[this.rawIndices[i*3 + 1]];
      var p2 = this.rawVertices[this.rawIndices[i*3 + 2]];
      
      var a = p2.sub(p0);
      var b = p1.sub(p0);
      
      var norm = a.cross(b);
      //var norm = b.cross(a);
      
      p0.pushOnto(this.vertexPositions);
      p1.pushOnto(this.vertexPositions);
      p2.pushOnto(this.vertexPositions);
      
      for (var j = 0; j < 3; j += 1) {
        norm.pushOnto(this.vertexNormals);
        this.indices.push(nextIndex);
        nextIndex += 1;
      }
      
    }
    
  };
  
  this.initMaterials = function() {
    this.materials = [
      {
        vertexshader : "shaders/yellow.vert",
        fragmentshader : "shaders/yellow.frag",
        numindices : this.indices.length
      }
    ];
  }
  
}
