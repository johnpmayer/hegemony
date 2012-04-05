
require(
  ["jquery","utils","geodesic","mesh","scene","matrix","vector"], 
  function($,utils,geodesic,mesh,scene,matrix,vector){
    
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
        
        theta += 0.05 * (actions.spinright ? -1 : 0 + actions.spinleft ? 1 : 0);
        phi += 0.05 * (actions.tiltup ? -1 : 0 + actions.tiltdown ? 1 : 0);
        zoom += .1 * (actions.zoomin ? -1 : 0 + actions.zoomout ? 1 : 0)
        
        phi = Math.max(-Math.PI/3, phi);
        phi = Math.min(Math.PI/3, phi);
        
        zoom = Math.max(3, zoom)
        zoom = Math.min(zoom, 8)
        
        utils.requestAnimationFrame(draw, c);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        camera.makeIdentity();
        camera.multiply(new matrix.Matrix4x3().makeRotate(theta,0,1,0))
        camera.multiply(new matrix.Matrix4x3().makeRotate(phi,1,0,0))
        camera.multiply(new matrix.Matrix4x3().makeTranslate(0,0,zoom))
        
        matrix.viewMatrix().makeInverseRigidBody(camera);
        geoScene.draw();
        
        var log = "Camera:"+camera.d[12]
          +","+camera.d[13]
          +","+camera.d[14]
          +"<br>"+JSON.stringify(camera.d)
        
        $("#camera_log").html(log)
        
      }
      
      $("#c").click(function(ev){
        
        var log = "Clicked the canvas: " + ev.offsetX + " " + ev.offsetY
        
        // gl_Position = proj * view * (model * modelPosition)
        // gl_Position = proj * view * scenePos
        // proj-1 * gl_Position = view * scenePos
        // view-1 * (proj-1 * gl_Position) = scenePos
        // view-1 * (viewPos)              = scenePos
        
        var glX = (ev.offsetX / 600) * 2 - 1
        var glY = 1 - (ev.offsetY / 600) * 2
        var glZ = 100
        
        var glPosition = new vector.Vector3(glX, glY, glZ)
        
        log += "<br>glPosition" + JSON.stringify(glPosition);
        
        var unproject = new matrix.Matrix4x4()
        
        
        unproject.multiply(matrix.projectionMatrix())        
        
        unproject.multiply(matrix.viewMatrix())

        
        unproject = unproject.computeInverse()
        
        var scenePos = unproject.multiplyVector3(glPosition)
        
        log += "<br>ScenePosition" + JSON.stringify(scenePos)
        
        $("#mouse_log").html(log)
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
