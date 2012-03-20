
require(
  ["geodesic", "mesh", "matrix", "scene","webgl"], 
  function(geodesic, mesh, matrix, scene, webgl){
    
    // Setup the basic webgl environment
    var c = document.getElementById("c");
    var gl = c.getContext("experimental-webgl");
    if (!gl) throw "WebGL failed to get context";
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);

    var numDoubles = 3;
    
    var geo = new geodesic.Geodesic();
    for (var i = 0; i < numDoubles; i++) {
      geo.doubleFrequency();
    }
    
    var geoMesh = new mesh.Mesh(gl);
    var camera = new matrix.Matrix4x3();
    var geoScene = new scene.DAGNode([new scene.Geometry(geoMesh)]);
    var z = 0;
    
    var id;
    
    draw = function() {
      id = webgl.requestAnimationFrame(draw, c);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      geoScene.local.makeRotate(z,0,1,0);
      camera.d[14] = 5;
      matrix.viewMatrix().makeInverseRigidBody(camera);
      geoScene.draw();
      z += 0.005;
    }
    
    geo.materials = [{
      vertexshader : "shaders/geo.vert",
      fragmentshader : "shaders/geo.frag",
      numindices : geo.indices.length
    }];
    
    geoMesh.build(geo, draw);
    
  }
);

