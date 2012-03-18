
require(
  ["geodesic", "mesh", "matrix", "scene","webgl"], 
  function(geodesic, mesh, matrix, scene, webgl){
    
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
    
    var geoMesh = new mesh.Mesh(gl);
    var camera = new matrix.Matrix4x3();
    var scene = new scene.DAGNode([new scene.Geometry(geoMesh)]);
    var z = 0;
    
    draw = function() {
      webgl.requestAnimationFrame(draw, c);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      scene.local.makeRotate(z,0,1,0);
      camera.d[14] = 10;
      matrix.viewMatrix().makeInverseRigidBody(camera);
      scene.draw();
      z += 0.01;
    }
    
    geo.materials = [{
      vertexshader : "shaders/geo.vert",
      fragmentshader : "shaders/geo.frag",
      numindices : geo.indices.length
    }];
    
    geoMesh.build(geo, draw);
    
  }
);

