
// geodesic

define(
  ["vector"],
  function(vector) {
    
    // create the base icosahedron
    var icosahedron = {};
    
    // initialize 2-level array
    icosahedron.u_array = [];
    for (var i = 0; i <= 6; i +=1) {
      var v_array = [];
      icosahedron.u_array[i] = v_array;
    }
    
    // add the vertices, and handle all duplication
    var north_pole = new vector.Vector3(0,1,0);
    var south_pole = new vector.Vector3(0,-1,0);
    var latitude = Math.atan(0.5);
    for (var i = 0; i < 5; i += 1) {
      icosahedron.u_array[i][i+1] = north_pole;
      
      var t1 = (2 * i)     * Math.PI / 5;
      var upper = new vector.fromSpherical(1,t1,latitude);
      icosahedron.u_array[i][i] = upper;
      if (i === 0) icosahedron.u_array[i+5][i+5] = upper;
      
      var t2 = (2 * i + 1) * Math.PI / 5
      var lower = new vector.fromSpherical(1,t2,-latitude);
      icosahedron.u_array[i+1][i] = lower;
      if (i === 0) icosahedron.u_array[i+6][i+5] = lower;
      
      icosahedron.u_array[i+2][i] = south_pole;
    }
    
    var Geodesic = function() {
      
      this.setFrequency = function(f) {
        
        var ico = this.__proto__;
        
        var max_u = f * 6; // 0 <= u <= 6f
        //var max_v = f * 5; // 0 <= v <= 5f
        
        // allocate space for the new u_array
        var u_array = [];
        for (var i = 0; i <= max_u; i += 1) {
          u_array[i] = [];
        }
        
        // copy the major vertices from the icosahedron
        for (var i = 0; i < ico.u_array.length; i += 1) {
          var ico_v_array = ico.u_array[i];
          var v_array = u_array[f*i];
          for (var j = 0; j < ico_v_array.length; j += 1) {
            if (ico_v_array[j]) {            
              v_array[f*j] = ico_v_array[j];
            }
          }
        }
        
        // interpolate along v_arrays
        // for every v_array (the filled-in ones)
        for (var i = 0; i < u_array.length; i += f) {
          var v_array = u_array[i];
          // for every pair of vertical adjacent vertices (the
          // filled-in ones)
          for (var j = 0; j + f < v_array.length; j += f) {
            if (v_array[j] && v_array[j+f]) {
              // calculate the f-1 new vertices
              var start = v_array[j];
              var end = v_array[j+f];
              var stepV = end.sub(start).scale(1/f);
              for (var k = 1; k < f; k +=1) {
                v_array[j+k] = start.add(stepV.scale(k));
              }
            }
          }
        }
        
        // interpolate between v_arrays
        // for every pair of v_arrays (the filled-in ones)
        for (var i = 0; i + f < u_array.length; i += f) {
          var v_array_a = u_array[i];
          var v_array_b = u_array[i+f];
          // for every two horizontal adjacent vertices (the ones from
          // the icosahedron only)
          for (var j = 0; j + f < v_array.length; j += f) {
            if(v_array_a[j] && v_array_b[j]) {
              // calculate the f-1 new vertices horizontally
              var start = v_array_a[j];
              var end = v_array_b[j];
              var stepV = end.sub(start).scale(1/f);
              for (var k = 1; k < f; k += 1) {
                u_array[i+k][j] = start.add(stepV.scale(k));
              }
            }
          }
        }
        
        this.frequency = f;
        this.u_array = u_array;
      }
      
    }
    
    Geodesic.prototype = icosahedron;
    
    return {
      Geodesic : Geodesic
    };
    
  }
); 
