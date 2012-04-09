
require(
  ["jquery","utils","geodesic","mesh","scene","matrix","vector","mjs"], 
  function($,utils,geodesic,mesh,scene,matrix,vector,mjs){
    
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
      var camera = new matrix.Matrix4x3();
      var theta = 0, phi = 0, zoom = 5
      
      var keyMappings = {'37':'spinleft',
                         '38':'tiltdown',
                         '39':'spinright',
                         '40':'tiltup',
                         '65':'spinleft',
                         '83':'tiltup',
                         '68':'spinright',
                         '87':'tiltdown',
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
        
        var log = ""
        
        theta += 0.05 * (actions.spinright ? -1 : 0 + actions.spinleft ? 1 : 0);
        phi += 0.05 * (actions.tiltup ? -1 : 0 + actions.tiltdown ? 1 : 0);
        zoom += .1 * (actions.zoomin ? -1 : 0 + actions.zoomout ? 1 : 0)
        
        phi = Math.max(-Math.PI/3, phi);
        phi = Math.min(Math.PI/3, phi);
        
        zoom = Math.max(2, zoom)
        zoom = Math.min(zoom, 20)
        
        utils.requestAnimationFrame(draw, c);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var eye = vector.fromSpherical(zoom, theta, phi).toMJS()
        var center = new vector.Vector3(0,0,0).toMJS()
        var up = new vector.Vector3(0,1,0).toMJS()
        
        log += "<br>Eye: " + JSON.stringify(eye)
        log += "<br>Center: " + JSON.stringify(center)
        log += "<br>Up: " + JSON.stringify(up)
        
        matrix.viewMatrix().fromMJS(mjs.M4x4.makeLookAt(eye, center, up))
        
        geoScene.draw();
        
        log += "<br>Camera:"+camera.d[12]
          +","+camera.d[13]
          +","+camera.d[14]
          +"<br>"+JSON.stringify(camera.d)
        
        $("#camera_log").html(log)
        
      }
      
      $("#c").click(function(ev){
        
        var log = "Clicked the canvas: " + ev.offsetX + " " + ev.offsetY
        
        var xRatio = (ev.offsetX / 600) * 2 - 1
        var yRatio = 1 - (ev.offsetY / 600) * 2
        
        $("#mouse_log").html(log)
        
      })
      
      utils.loadFile("globe", 
                     function(responseText){
                       var geo = geodesic.initGeodesic(JSON.parse(responseText))
                       
                       /*
                         var count = 0
                         var neighborFreq = [0,0,0,0,0,0,0,0,0]
                         
                         for (var u = 0; u < geo.U_Array.length; u += 1) {
                         var v_array = geo.U_Array[u]
                         for (var v = 0; v < v_array.length; v += 1) {
                         var node = v_array[v]
                         if (node && 
                         node.Locations[0].U === u &&
                         node.Locations[0].V === v) {
                         count += 1
                         var numNeighbors = geo.nodeNeighbors(node).length
                         if (numNeighbors !== 6) {
                         alert("Anomoly at: " + u + " " + v + " " + numNeighbors
                         + "\n" + JSON.stringify(geo.nodeNeighbors(node))
                         )
                         }
                         neighborFreq[numNeighbors] += 1
                         }
                         }
                         }
                         
                         alert(count + " " + neighborFreq)
                       */
                       
                       geo.generateMesh(geoMesh,draw)
                     },
                     true,true);
      
    });
    
  }
);
