
// geodesic

define(
  ["utils","vector","mesh"],
  function(utils, vector, mesh){
    
    var seaLevel = 750;
    var mtnLevel = 900;
    
    function generateMesh(geoMesh, callback) {
      
      var f = this.Frequency
      var u_array = this.U_array
      
      var vertexPositions = [];
      var indices = [];
      var vertexNormals = [];
      var vertexColors = [];
      
      var indexCounter = 0;
      
      var addVertex = function(l,v) {
        l.push(v.x);
        l.push(v.y);
        l.push(v.z);
      }
      
      var addColor = function(n) {
        if (n.Elevation > mtnLevel) {
          vertexColors.push(.5)
          vertexColors.push(.5)
          vertexColors.push(0)
        } else if (n.Elevation > seaLevel) {
          vertexColors.push(.4)
          vertexColors.push(.8)
          vertexColors.push(0)
        } else {
          // ocean
          if (n.Point.Y > .8 || n.Point.Y < -.8) {
            vertexColors.push(.5)
            vertexColors.push(.5)
            vertexColors.push(.8)
          } else {
            vertexColors.push(0)
            vertexColors.push(0)
            vertexColors.push(.6)
          }
        }
      }
      
      var addTriangle = function(n1,n2,n3) {
        var v1 = vector.convert(n1.Point)
        var v2 = vector.convert(n2.Point)
        var v3 = vector.convert(n3.Point)
        var a = v3.sub(v1);
        var b = v2.sub(v1);
        var norm = a.cross(b).normalize();
        
        addVertex(vertexPositions, v1);
        addVertex(vertexPositions, v2);
        addVertex(vertexPositions, v3);
        
        for (var i = 0; i < 3; i++) {
          indices.push(indexCounter);
          indexCounter += 1;
          addVertex(vertexNormals, norm);
        }
        
        addColor(n1);
        addColor(n2);
        addColor(n3);
        
      }
      
      // For each "major square"
      for (var i = 0; i < 5; i += 1) {
        for (var j = 0; j < 2; j += 1) {
          var anchor_u = (i+j) * f;
          var anchor_v = i * f;
          
          // Starting at the anchor Coord, generate the 2*f*f
          // triangles (clockwise)
          for (var x = 0; x < f; x += 1) {
            for (var y = 0; y < f; y += 1) {
              
              var nodeA = u_array[anchor_u + x][anchor_v + y];
              var nodeB = u_array[anchor_u + x + 1][anchor_v + y];
              var nodeC = u_array[anchor_u + x][anchor_v + y + 1];
              var nodeD = u_array[anchor_u + x + 1][anchor_v + y + 1];
              
              addTriangle(nodeA, nodeC, nodeD);
              addTriangle(nodeA, nodeD, nodeB);
              
            }
          }
          
        }
      }
      
      var meshAttributes = {
        
        vertexPositions : vertexPositions,
        indices : indices,
        vertexNormals : vertexNormals,
        vertexColors : vertexColors,
        
        materials : [{
          
          vertexshader : "shaders/geo.vert",
          fragmentshader : "shaders/geo.frag",
          numindices : indices.length
          
        }]
        
      }
      
      geoMesh.build(meshAttributes, callback)
      
    }
    
    function initGeodesic(obj) {
      
      obj.generateMesh = generateMesh
      
      return obj
      
    }
    
    return {
      initGeodesic:initGeodesic
    }
    
  }
);
