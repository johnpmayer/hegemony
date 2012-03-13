
require(["geodesic"], function(geodesic){
  
  var geo = new geodesic.Geodesic();
  
  function write(s) {
    document.write("<p>" + s + "</p>")
  }
  
  write("geo = " + JSON.stringify(geo));
  write("geo.__proto__ = " + JSON.stringify(geo.__proto__));
  
  geo.setFrequency(2);
  
  write("geo f=2:")
  for (var i = 0; i < geo.u_array.length; i += 1) {
    var v_array = geo.u_array[i];
    var count = 0;
    for (var j = 0; j < v_array.length; j += 1) {
      if (v_array[j]) count += 1;
    }
    write(i + " " + v_array.length + " " + count + " " + JSON.stringify(v_array));
  }
  
});
