
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
  
  var u_count = 0;
  for (var i = 0; i < geo.u_array.length; i += 1) {
      var v_array = geo.u_array[i];
      var v_count = 0;
      for (var j = 0; j < v_array.length; j += 1) {
        document.write(JSON.stringify(v_array[j]));
        br(1);
        if (v_array[j]) {
          u_count += 1;
          v_count += 1;
        }
      }
    document.write(i + " " + v_array.length + " " + v_count);
    br(2);
  }
  
  document.write(geo.uniqueVertices());
  br(2);
  document.write(10 * Math.pow(geo.frequency, 2) + 2);
  
});
