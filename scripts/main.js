
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
      var camera = new matrix.Matrix4x3();
      var geoScene = new scene.DAGNode([new scene.Geometry(geoMesh)])
      
      var draw = function() {
        
        gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT)
        
        camera.d[14] = 5
        matrix.viewMatrix().makeInverseRigidBody(camera)
        
        geoScene.draw()
        
      }
      
      utils.loadFile("globe", 
                     function(responseText){
                       var geo = geodesic.initGeodesic(JSON.parse(responseText))
                       geo.generateMesh(geoMesh,draw)
                     },
                     true,true);
      
      
      
    });
    
  }
);
