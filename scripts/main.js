
require(["jquery","utils"], function($,utils){
  $(function(){
    
    $('body').append("Hello, World!");
    
    utils.loadFile("randomGlobe", 
             function(responseText){
               geo = JSON.parse(responseText);
               alert(geo.U_array.length);
             },
             true,true);
    
  });
});
