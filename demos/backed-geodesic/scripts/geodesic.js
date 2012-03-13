
// geodesic

define(
  ["vector"],
  function(vector) {
    
    function Node(lbl, vec, u, v) {
      
      this.label = lbl;
      this.point = vec;
      this.instances = [{u:u,v:v}];
      
    }
    
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
    
    icosahedron.frequency = 1;
    
    icosahedron.boundaryScan = function() {
      // ToDo
    }
    
    icosahedron.addLabels = function() {
      // ToDo
      this.uniqueVertices = -1;
    }
    
    var Geodesic = function() {
      
      this.doubleFrequency = function() {
        
        var f = this.frequency * 2;
        var u_array = [];
        var max_u = f * 6; // 0 <= u <= 6f

        // allocate space for the new u_array
        var u_array = [];
        for (var i = 0; i <= max_u; i += 1) {
          u_array[i] = [];
        }
        
        // copy the major vertices from the icosahedron
        for (var i = 0; i < this.u_array.length; i += 1) {
          var old_v_array = this.u_array[i];
          var v_array = u_array[2*i];
          for (var j = 0; j < old_v_array.length; j += 1) {
            if (old_v_array[j]) {            
              v_array[2*j] = old_v_array[j];
            }
          }
        }
        
        // interpolate along v_arrays
        // for every v_array
        for (var i = 0; i < u_array.length; i += 2) {
          var v_array = u_array[i];
          // for every pair of vertical adjacent vertices
          for (var j = 0; j + 2 < v_array.length; j += 2) {
            if (v_array[j] && v_array[j+2]) {
              // calculate the 1 new vertex
              var start = v_array[j];
              var end = v_array[j+2];
              var stepV = end.sub(start).scale(1/2);
              v_array[j+1] = start.add(stepV);
            }
          }
        }
        
        // interpolate between v_arrays
        // for every pair of v_arrays
        for (var i = 0; i + 2 < u_array.length; i += 2) {
          var v_array_a = u_array[i];
          var v_array_b = u_array[i+2];
          for (var j = 0; j < v_array_a.length; j += 2) {
            // for every two horizontal adjacent vertices
            if(v_array_a[j] && v_array_b[j]) {
              // calculate the f-1 new vertices horizontally
              var start = v_array_a[j];
              var end = v_array_b[j];
              var stepV = end.sub(start).scale(1/2);
              u_array[i+1][j] = start.add(stepV);
            }
            // for every two diagonally adjacent vertices
            if(v_array_a[j] && v_array_b[j+2]) {
              // calculate the f-1 new vertices diagonally
              var start = v_array_a[j];
              var end = v_array_b[j+2];
              if (!(start === end)) {
                var stepV = end.sub(start).scale(1/2);
                u_array[i+1][j+1] = start.add(stepV);
              }
            }
          }
        }
        
        // boundary scan
        
        
        
        
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
