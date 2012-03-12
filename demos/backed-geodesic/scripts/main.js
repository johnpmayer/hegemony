
require(["geodesic"], function(geodesic){
  
  var geo = new geodesic.Geodesic();
  
  function write(s) {
    document.write("<p>" + s + "</p>")
  }
  
  write("geo = " + JSON.stringify(geo));
  write("geo.__proto__ = " + JSON.stringify(geo.__proto__));
  
  geo.setFrequency(2);
  
  write("geo 2 = " + JSON.stringify(geo));
  
});
