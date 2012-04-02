
require(["jquery","utils"], function($,utils){
  
  window.onerror = function(ev){alert("Error:" + ev)};
  
  $(function(){
    
    //$('body').append("Hello, World!");
    var c = $('#c')[0];
    var gl = c.getContext("experimental-webgl");
    if (!gl) throw "WebGL failed to get context";
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    utils.loadFile("globe", 
             function(responseText){
               geo = JSON.parse(responseText);
               alert(geo.U_array.length);
             },
             true,true);
    
    
    
  });
  
});
