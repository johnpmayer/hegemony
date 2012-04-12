
// geodesic

define(
  ["utils","vector","mesh"],
  function(utils, vector, mesh){
    
    var deepLevel = 300;
    var seaLevel = 650;
    var mtnLevel = 900;

    var scaleFactor = 1.02
    
    function canonicalEquals(node1, node2) {
      var l1 = node1.Locations[0]
      var l2 = node2.Locations[0]
      return l1.U === l2.U && l1.V === l2.V
    }
    
    function containsNode(nodeList, node) {
      for (var i = 0; i < nodeList.length; i += 1) {
        if (canonicalEquals(nodeList[i], node)) {
          return true
        }
      }
      return false
    }
    
    function closestNode(testVec) {
      
      var geo = this
      var u_array = geo.U_Array
      
      var node = u_array[0][0]
      var vec = vector.convert(node.Point)
      var dist = testVec.sub(vec).magnitude()
      
      while(true) {
        
        var neighbors = geo.nodeNeighbors(node)
        var better = false;
        
        for (var i = 0; i < neighbors.length; i++) {
          
          var node2 = neighbors[i]
          var vec2 = vector.convert(node2.Point)
          var dist2 = testVec.sub(vec2).magnitude()
          
          if (dist2 < dist) {
            node = node2;
            dist = dist2;
            better = true;
            break;
          }
          
        }
        
        if(!better) {
          break
        }
        
      }
      
      return node;
      
    }
    
    function nodeNeighbors(that){ 
      return function(node) {
        var neighbors = []
        var locations = node.Locations
        
        for (var i = 0; i < locations.length; i += 1) {
          var index = locations[i]
          var u = index.U
          var v = index.V
          
          var tryNode = function(u1, v1) {
            if (u1 === u && v1 === v) return
            
            var v_array = that.U_Array[u1]
            if (v_array) {
              var node1 = v_array[v1]
              if (node1
                  //&& node1.Locations[0].U === u1
                  //&& node1.Locations[0].V === v1
                 ) {
                // skip if this node is canonically equal to the source node
                if (node1.Locations[0].U === node.Locations[0].U &&
                    node1.Locations[0].V === node.Locations[0].V) {
                  return
                }
                // skip if this node is caonically equal to a node
                // already accounted for
                for (var j = 0; j < neighbors.length; j++) {
                  if (neighbors[j].Locations[0].U === node1.Locations[0].U &&
                      neighbors[j].Locations[0].V === node1.Locations[0].V) {
                    return
                  }
                }
                neighbors.push(node1)
              }
            }
            
          }
          
          tryNode(u-1, v-1)
          tryNode(u-1, v)
          tryNode(u, v-1)
          tryNode(u, v+1)
          tryNode(u+1, v)
          tryNode(u+1, v+1)
          
        }
        
        return neighbors
        
      }
      
    }
    
    function generateBorderMesh(borderMesh, node, callback) {
      
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
      
      var addColor = function() {
        vertexColors.push(1.0)
        vertexColors.push(0.0)
        vertexColors.push(0.0)
      }
      
      var addTriangle = function(v1,v2,v3) {
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
        
      }
      
      var neighbors = this.nodeNeighbors(node)
      
      var elevation = node.Elevation
      var vc = vector.convert(node.Point)
      
      var sortedNeighborVertices = []
      
      var sortedNeighbors = []
      
      var node1 = neighbors.pop()
      sortedNeighbors.push(node1)
      lastNodeNeighbors = this.nodeNeighbors(node1)
      var vn1 = vector.convert(node1.Point)
      var vsub = vc.sub(vn1)
      var vcross = vsub.cross(vc)
      
      while(neighbors.length > 0) {
        
        node2 = neighbors.pop()
        
        if (containsNode(lastNodeNeighbors, node2)) {
          
          var vn2 = vector.convert(node2.Point)
          
          if (vcross.dot(vn2) > 0) {
            
            node1 = node2
            sortedNeighbors.push(node1)
            lastNodeNeighbors = this.nodeNeighbors(node1)
            vn1 = vector.convert(node1.Point)
            vsub = vc.sub(vn1)
            vcross = vsub.cross(vc)
            
            continue
            
          }
          
        }
        
        neighbors.unshift(node2)
        
      }
      
      var neighborVertices = []
      
      for (var i = 0; i < sortedNeighbors.length; i += 1) {
        neighborVertices.push(vector.convert(sortedNeighbors[i].Point))
      }
      
      var gameSpaceVertices = []
      
      for (var i = 0; i < neighborVertices.length; i += 1) {
        v1 = vector.convert(node.Point)
        v2 = neighborVertices[i]
        v3 = neighborVertices[(i+1)%neighborVertices.length]
        
        var x = (v1.x + v2.x + v3.x) / 3
        var y = (v1.y + v2.y + v3.y) / 3
        var z = (v1.z + v2.z + v3.z) / 3
        
        gameSpaceVertices.push((new vector.Vector3(x,y,z)).normalize())
        
      }
      
      for (var i = 0; i < gameSpaceVertices.length; i += 1) {
        //v1 = vector.convert(node.Point)
        v2 = gameSpaceVertices[i]
        v3 = gameSpaceVertices[(i+1) % gameSpaceVertices.length]
        
        v2a = v2.scale(scaleFactor)
        v3a = v3.scale(scaleFactor)
        
        addTriangle(v2, v3, v2a)
        addTriangle(v3, v2a, v3a)
        
        for (var j = 0; j < 6; j ++) {
          addColor()
        }
        
      }
      
      var meshAttributes = {
        
        vertexPositions : vertexPositions,
        indices : indices,
        vertexNormals : vertexNormals,
        vertexColors : vertexColors,
        
        materials : [{
          
          vertexshader : "shaders/border.vert",
          fragmentshader : "shaders/border.frag",
          numindices : indices.length
          
        }]
        
      }
      
      borderMesh.build(meshAttributes, callback)
      
    }
    
    function generateHexagonMesh(geoMesh, callback) {
      
      var f = this.Frequency
      var u_array = this.U_Array
      
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
      
      var addColor = function(elevation) {
        if (elevation > mtnLevel) {
          vertexColors.push(.5)
          vertexColors.push(.5)
          vertexColors.push(0)
        } else if (elevation > seaLevel) {
          vertexColors.push(.4)
          vertexColors.push(.8)
          vertexColors.push(0)
        } else if (elevation < deepLevel) {
          vertexColors.push(.1)
          vertexColors.push(.1)
          vertexColors.push(.5)
        } else {
          vertexColors.push(0)
          vertexColors.push(0)
          vertexColors.push(.6)
        }
      }
      
      var addTriangle = function(v1,v2,v3) {
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
        
      }
      
      var that = this
      
      var addGameSpace = function(node) {
        var neighbors = that.nodeNeighbors(node)
        
        var elevation = node.Elevation
        var vc = vector.convert(node.Point)
        
        var sortedNeighborVertices = []
        
        var sortedNeighbors = []
        
        var node1 = neighbors.pop()
        sortedNeighbors.push(node1)
        lastNodeNeighbors = that.nodeNeighbors(node1)
        var vn1 = vector.convert(node1.Point)
        var vsub = vc.sub(vn1)
        var vcross = vsub.cross(vc)
        
        while(neighbors.length > 0) {
          
          node2 = neighbors.pop()
          
          if (containsNode(lastNodeNeighbors, node2)) {
            
            var vn2 = vector.convert(node2.Point)
            
            if (vcross.dot(vn2) > 0) {
              
              node1 = node2
              sortedNeighbors.push(node1)
              lastNodeNeighbors = that.nodeNeighbors(node1)
              vn1 = vector.convert(node1.Point)
              vsub = vc.sub(vn1)
              vcross = vsub.cross(vc)
              
              continue
              
            }
            
          }
          
          neighbors.unshift(node2)
          
        }
        
        var neighborVertices = []
        
        for (var i = 0; i < sortedNeighbors.length; i += 1) {
          neighborVertices.push(vector.convert(sortedNeighbors[i].Point))
        }
        
        var gameSpaceVertices = []
        
        for (var i = 0; i < neighborVertices.length; i += 1) {
          v1 = vector.convert(node.Point)
          v2 = neighborVertices[i]
          v3 = neighborVertices[(i+1)%neighborVertices.length]
          
          var x = (v1.x + v2.x + v3.x) / 3
          var y = (v1.y + v2.y + v3.y) / 3
          var z = (v1.z + v2.z + v3.z) / 3
          
          gameSpaceVertices.push((new vector.Vector3(x,y,z)).normalize())
          
        }
        
        for (var i = 0; i < gameSpaceVertices.length; i += 1) {
          v1 = vector.convert(node.Point)
          v2 = gameSpaceVertices[i]
          v3 = gameSpaceVertices[(i+1) % gameSpaceVertices.length]
          
          addTriangle(v1,v2,v3)
          
          for (var j = 0; j < 3; j ++) {
            addColor(elevation)
          }
          
        }
        
      }
      
      for (var u = 0; u < u_array.length; u += 1) {
        var v_array = u_array[u]
        for (var v = 0; v < v_array.length; v += 1) {
          var node = v_array[v]
          if (node) {
            addGameSpace(node)
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
    
    function generateTriangleMesh(geoMesh, callback) {
      
      var f = this.Frequency
      var u_array = this.U_Array
      
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
          } else if (n.Elevation < deepLevel) {
            vertexColors.push(.1)
            vertexColors.push(.1)
            vertexColors.push(.5)
            
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
      //TODO: each major square is its own mesh; webgl max buffer size
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
      
      obj.generateMesh = generateHexagonMesh
      obj.generateBorderMesh = generateBorderMesh
      obj.nodeNeighbors = nodeNeighbors(obj)
      obj.closestNode = closestNode
      
      return obj
      
    }
    
    return {
      initGeodesic:initGeodesic
    }
    
  }
);
