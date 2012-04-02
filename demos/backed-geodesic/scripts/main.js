
require(
  ["geodesic", "mesh", "matrix", "scene","webgl"], 
  function(geodesic, mesh, matrix, scene, webgl){
    
    // Setup the basic webgl environment
    var c = document.getElementById("c");
    var gl = c.getContext("experimental-webgl");
    if (!gl) throw "WebGL failed to get context";
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);

    var numDoubles = 5;
    
    var geo = new geodesic.Geodesic();
    for (var i = 0; i < numDoubles; i++) {
      geo.doubleFrequency();
    }
    
    var geoMesh = new mesh.Mesh(gl);
    var camera = new matrix.Matrix4x3();
    var geoScene = new scene.DAGNode([new scene.Geometry(geoMesh)]);
    var theta = 0, phi = 0;
    
    var keyMappings = {'37':'spinleft','38':'tiltup','39':'spinright','40':'tiltdown',
                       '90':'zoomin','88':'zoomout','70':'frequency'};
    var actions = {};
    
    window.onkeydown = function(e) {
      var kc = e.keyCode.toString();
      if(keyMappings.hasOwnProperty(kc)) {
        actions[keyMappings[kc]] = true;
      }
    }
    
    window.onkeyup = function(e) {
      var kc = e.keyCode.toString();
      if(keyMappings.hasOwnProperty(kc)) {
        actions[keyMappings[kc]] = false;
      }
      
      for (var j in keyMappings) {
        if (actions[keyMappings[j]]) {
          return;
        }
      }
    }
    
    draw = function() {
      theta += 0.01 * (actions.spinright ? -1 : 0 + actions.spinleft ? 1 : 0);
      phi += 0.01 * (actions.tiltup ? -1 : 0 + actions.tiltdown ? 1 : 0);
      
      if (actions.frequency) {
        actions.frequency = false; // only do it once ber keydown
        geo.doubleFrequency();
        var newGeoMesh = new mesh.Mesh(gl);
        newGeoMesh.build(geo, function(){
          geoScene.children = [new scene.Geometry(newGeoMesh)];
          draw();
        });
        return;
      }
      
      phi = Math.max(-Math.PI/3, phi);
      phi = Math.min(Math.PI/3, phi);
      
      webgl.requestAnimationFrame(draw, c);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      geoScene.local.makeRotate(phi,1,0,0);
      geoScene.local.multiply(new matrix.Matrix4x3().makeRotate(theta,0,1,0));
      camera.d[14] = 5;
      matrix.viewMatrix().makeInverseRigidBody(camera);
      geoScene.draw();
    }
    
    geo.materials = [{
      vertexshader : "shaders/geo.vert",
      fragmentshader : "shaders/geo.frag",
      numindices : geo.indices.length
    }];
    
    geoMesh.build(geo, draw);
    
  }
);

