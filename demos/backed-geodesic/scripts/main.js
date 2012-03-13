
require(["geodesic"], function(geodesic){
  
  var geo = new geodesic.Geodesic();
  
  function write(s) {
    document.write("<p>" + s + "</p>")
  }
  
  write("geo = " + JSON.stringify(geo));
  write("geo.__proto__ = " + JSON.stringify(geo.__proto__));
  
  geo.doubleFrequency();
  
  write("geo f=2:")
  var u_count = 0;
  for (var i = 0; i < geo.u_array.length; i += 1) {
    var v_array = geo.u_array[i];
    var v_count = 0;
    for (var j = 0; j < v_array.length; j += 1) {
      if (v_array[j]) {
        u_count += 1;
        v_count += 1;
      }
    }
    write(i + " " + v_array.length + " " + v_count + " " + JSON.stringify(v_array));
  }
  write(u_count);
  
  geo.doubleFrequency();
  
  write("geo f=4:")
  var u_count = 0;
  for (var i = 0; i < geo.u_array.length; i += 1) {
    var v_array = geo.u_array[i];
    var v_count = 0;
    for (var j = 0; j < v_array.length; j += 1) {
      if (v_array[j]) {
        u_count += 1;
        v_count += 1;
      }
    }
    write(i + " " + v_array.length + " " + v_count + " " + JSON.stringify(v_array));
  }
  write(u_count);
  
});
