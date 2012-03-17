
require(["geodesic", "mesh"], function(geodesic, mesh){
  
  // Setup the basic webgl environment
  var c = document.getElementById("c");
  var gl = c.getContext("experimental-webgl");
  if (!gl) throw "WebGL failed to get context";
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  var geo = new geodesic.Geodesic();
  var numDoubles = 0;
  for (var i = 0; i < numDoubles; i++) {
    geo.doubleFrequency();
  }
  
  alert("Geo: " + (geo.vertexPositions.length / 3)
        + " " + (geo.indices.length / 3));
  
  draw = function() {
    alert("draw");
  }
  
  geo.materials = [{
    vertexshader : "shaders/geo.vert",
    fragmentshader : "shaders/geo.frag"
  }];
  
  var geoMesh = new mesh.Mesh(gl);
  geoMesh.build(geo, draw);
  
});

