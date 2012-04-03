
require(
  ["jquery","utils","geodesic","mesh","scene","matrix"], 
  function($,utils,geodesic,mesh,scene,matrix){
    
    window.onerror = function(ev){alert("Error:" + ev)};
    
    $(function(){
      
      //$('body').append("Hello, World!");
      var c = $('#c')[0];
      var gl = c.getContext("experimental-webgl");
      if (!gl) throw "WebGL failed to get context";
      
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0,0,0,1);
      
      var geoMesh = new mesh.Mesh(gl)
      var geoScene = new scene.DAGNode([new scene.Geometry(geoMesh)])
      var theta = 0, phi = 0, zoom = 5
      
      var keyMappings = {'37':'spinleft',
                         '38':'tiltup',
                         '39':'spinright',
                         '40':'tiltdown',
                         '90':'zoomin',
                         '88':'zoomout'};

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
      
      var draw = function() {
        
        theta += 0.01 * (actions.spinright ? -1 : 0 + actions.spinleft ? 1 : 0);
        phi += 0.01 * (actions.tiltup ? -1 : 0 + actions.tiltdown ? 1 : 0);
        zoom += .1 * (actions.zoomin ? -1 : 0 + actions.zoomout ? 1 : 0)
        
        phi = Math.max(-Math.PI/3, phi);
        phi = Math.min(Math.PI/3, phi);
        
        zoom = Math.max(3, zoom)
        zoom = Math.min(zoom, 8)
        
        utils.requestAnimationFrame(draw, c);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        //geoScene.local.makeRotate(phi,1,0,0);
        //geoScene.local.multiply(new matrix.Matrix4x3().makeRotate(theta,0,1,0));
        
        var camera = new matrix.Matrix4x3().makeIdentity();
        camera.multiply(new matrix.Matrix4x3().makeRotate(theta,0,1,0))
        camera.multiply(new matrix.Matrix4x3().makeRotate(phi,1,0,0))
        camera.multiply(new matrix.Matrix4x3().makeTranslate(0,0,zoom))
        
        matrix.viewMatrix().makeInverseRigidBody(camera);
        geoScene.draw();
        
      }
      
      $("#c").click(function(ev){
        
        alert("Clicked the canvas: " + ev.offsetX + " " + ev.offsetY)
      })
      
      utils.loadFile("globe", 
                     function(responseText){
                       var geo = geodesic.initGeodesic(JSON.parse(responseText))
                       geo.generateMesh(geoMesh,draw)
                     },
                     true,true);
      
    });
    
  }
);
