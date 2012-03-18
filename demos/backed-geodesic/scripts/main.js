
require(
  ["geodesic", "mesh", "matrix", "scene"], 
  function(geodesic, mesh, matrix, scene){
    
    // Setup the basic webgl environment
    var c = document.getElementById("c");
    var gl = c.getContext("experimental-webgl");
    if (!gl) throw "WebGL failed to get context";
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);
    
    var geo = new geodesic.Geodesic();
    var numDoubles = 1;
    for (var i = 0; i < numDoubles; i++) {
      geo.doubleFrequency();
    }
    
    alert("Geo: " + (geo.vertexPositions.length / 3)
          + " " + (geo.indices.length / 3));
    
    var geoMesh = new mesh.Mesh(gl);
    var camera = new matrix.Matrix4x3();
    var scene = new scene.DAGNode([new scene.Geometry(geoMesh)]);
    
    draw = function() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      scene.local.scale(0.8);
      camera.d[14] = 8;
      matrix.viewMatrix().makeInverseRigidBody(camera);
      scene.draw();
    }
    
    geo.materials = [{
      vertexshader : "shaders/geo.vert",
      fragmentshader : "shaders/geo.frag",
      numindices : geo.indices.length
    }];
    
    geoMesh.build(geo, draw);
    
  }
);

