
require(["geodesic"], function(geodesic){
  
  var geo = new geodesic.Geodesic();
  
  var numDoubles = 3;
  
  function br(n) {
    for (var i = 0; i < n; i += 1) {
      document.write("<br/>");
    }
  }
  
  for (var i = 0; i < numDoubles; i++) {
    geo.doubleFrequency();
  }
  
  document.write("geo f=" + geo.frequency);  
  br(2);
  
  document.write("Unique Vertices")
  br(2)
  
  document.write("expected = " 
                 + (10 * Math.pow(geo.frequency, 2) + 2));
  br(1);
  
  document.write("method call = " + geo.uniqueVertices())
  br(1);
  
  document.write("vertexBuffer length = " + geo.vertexBuffer.length);
  br(2);
  
  document.write("Indices");
  br(2);
  
  document.write("indices length = " + geo.indices.length)
  br(1);

  document.write("triangles = " + (geo.indices.length / 3));
  br(1);
  
  var f = geo.frequency;
  document.write("10 * 2 * f*f = " + (10 * 2 * f*f))
  
});
