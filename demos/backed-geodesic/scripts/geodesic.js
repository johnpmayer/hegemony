
// geodesic

define(
  ["vector"],
  function(vector) {
    
    function GridCoord(u,v) {
      this.u = u;
      this.v = v;
      
      this.doubleFrequency = function() {
        this.u *= 2;
        this.v *= 2;
        return this;
      }
      
      this.equals = function(u,v) {
        return this.u === u
          && this.v === v;
      }
      
    }
    
    
    function Node(vec, u, v, gen) {
      
      this.p = vec;
      this.instances = [new GridCoord(u,v)];
      this.gen = gen;
      
      this.doubleFrequency = function() {
        var instances = this.instances
        for (var i = 0; i < instances.length; i += 1) {
          instances[i].doubleFrequency();
        }
        return this;
      }
      
      this.firstAt = function(u,v) {
        return this.instances[0].equals(u,v);
      }
      
    }
    
    // create the base icosahedron
    var icosahedron = {};
    
    icosahedron.frequency = 1;
    
    // initialize 2-level array
    icosahedron.u_array = [];
    for (var i = 0; i <= 6; i +=1) {
      var v_array = [];
      icosahedron.u_array[i] = v_array;
    }
    
    icosahedron.addNode = function(vec, u, v) {
      this.u_array[u][v] = new Node(vec,u,v,this.frequency);
    }
    
    // add the vertices, and handle all duplication
    var north_pole = new vector.Vector3(0,1,0);
    var south_pole = new vector.Vector3(0,-1,0);
    var latitude = Math.atan(0.5);
    for (var i = 0; i < 5; i += 1) {
      //icosahedron.u_array[i][i+1] = north_pole;
      icosahedron.addNode(north_pole, i, i+1);
      
      var t1 = (2 * i)     * Math.PI / 5;
      var upper = new vector.fromSpherical(1,t1,latitude);
      //icosahedron.u_array[i][i] = upper;
      icosahedron.addNode(upper, i, i);
      if (i === 0) //icosahedron.u_array[i+5][i+5] = upper;
        icosahedron.addNode(upper, 5, 5);
        
      var t2 = (2 * i + 1) * Math.PI / 5
      var lower = new vector.fromSpherical(1,t2,-latitude);
      //icosahedron.u_array[i+1][i] = lower;
      icosahedron.addNode(lower,i+1,i);
      if (i === 0) //icosahedron.u_array[i+6][i+5] = lower;
        icosahedron.addNode(lower,6,5);
        
      //icosahedron.u_array[i+2][i] = south_pole;
      icosahedron.addNode(south_pole,i+2,i);
    }
        
    icosahedron.boundaryScan = function() {
      
      var u_array = this.u_array;
      var f = this.frequency;
      
      // North pole (A)
      var north_pole = u_array[0][f];
      if (f <= north_pole.gen) {
        for (var i = 1; i <= 4; i += 1) {
          var u = i * f;
          var v = (i+1) * f;
          north_pole.instances.push(new GridCoord(u,v));
          u_array[u][v] = north_pole;
        }
      }
      
      // South pole (C)
      var south_pole = u_array[2*f][0];
      if (f <= south_pole.gen) {
        for (var i = 1; i <= 4; i += 1) {
          var u = (i+2) * f;
          var v = i * f;
          south_pole.instances.push(new GridCoord(u,v));
          u_array[u][v] = south_pole;
        }
      }
      
      // mid stitch (purple)
      for (var i = 0; i <= f; i += 1) {
        var purple = u_array[i][0];
        if (f <= purple.gen) {
          var u = 5*f + i;
          var v = 5*f;
          purple.instances.push(new GridCoord(u,v));
          u_array[u][v] = purple;
        }
      }
      
      // upper stitch x5 (red,salmon,green,cyan,orange)
      // copy horizontal onto next vertical (wrap)
      for (var i = 0; i < 5; i += 1) {
        var src_u_base = i * f;
        var src_v = (i+1) * f;
        var dst_u = ((i+1)%5) * f;
        var dst_v_base = ((i+1)%5) * f;
        for (var j = 1; j < f; j += 1) {
          var src_u = src_u_base + j;
          var src = u_array[src_u][src_v];
          if (f <= src.gen) {
            var dst_v = dst_v_base + j;
            src.instances.push(new GridCoord(dst_u, dst_v));
            u_array[dst_u][dst_v] = src;
          }
        }
      }
      
      // lower stutch x5 (blue,indigo,silver,gold,dgreen)
      // copy vertical onto next horizontal (wrap)
      for (var i = 0; i < 5; i += 1) {
        var src_u = (i+2) * f;
        var src_v_base = i * f;
        var dst_u_base = (((i+1)%5)+1) * f;
        var dst_v = ((i+1)%5) * f;
        for (var j = 1; j < f; j += 1) {
          var src_v = src_v_base + j;
          var src = u_array[src_u][src_v];
          if (f <= src.gen) {
            var dst_u = dst_u_base + j;
            src.instances.push(new GridCoord(dst_u,dst_v));
            u_array[dst_u][dst_v] = src;
          }
        }
      }
            
    }
    
    icosahedron.boundaryScan();
    
    icosahedron.uniqueVertices = function() {
      var count = 0;
      var u_array = this.u_array;
      for (var i = 0; i < u_array.length; i += 1) {
        var v_array = u_array[i];
        for (var j = 0; j < u_array.length; j += 1) {
          var node = v_array[j];
          if (node && node.firstAt(i,j)) {
            count += 1;
          }
        }
      }
      return count;
    }
    
    icosahedron.addLabels = function() {
      // ToDo
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
        
        // copy the major vertices from previous generation
        for (var i = 0; i < this.u_array.length; i += 1) {
          var old_v_array = this.u_array[i];
          var v_array = u_array[2*i];
          for (var j = 0; j < old_v_array.length; j += 1) {
            var node = old_v_array[j];
            if (node) {
              if (node.firstAt(i,j)) {
                node.doubleFrequency();
              }
              v_array[2*j] = old_v_array[j];
            }
          }
        }
        
        // update object fields
        this.frequency = f;
        this.u_array = u_array;
        
        // interpolate along v_arrays
        // for every v_array
        for (var i = 0; i < u_array.length; i += 2) {
          var v_array = u_array[i];
          // for every pair of vertical adjacent vertices
          for (var j = 0; j + 2 < v_array.length; j += 2) {
            if (v_array[j] && v_array[j+2]) {
              // calculate the 1 new vertex
              var start = v_array[j].p;
              var end = v_array[j+2].p;
              //var stepV = end.sub(start).scale(1/2);
              //v_array[j+1] = start.add(stepV);
              //var node = start.add(stepV).normalize();
              var node = start.mid(end).normalize();
              this.addNode(node, i,j+1)
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
              var start = v_array_a[j].p;
              var end = v_array_b[j].p;
              //var stepV = end.sub(start).scale(1/2);
              //u_array[i+1][j] = start.add(stepV);
              var node = start.mid(end).normalize();
              this.addNode(node, i+1, j);
            }
            // for every two diagonally adjacent vertices
            if(v_array_a[j] && v_array_b[j+2]) {
              // calculate the f-1 new vertices diagonally
              var start = v_array_a[j].p;
              var end = v_array_b[j+2].p;
              if (!(start === end)) {
                //var stepV = end.sub(start).scale(1/2);
                //u_array[i+1][j+1] = start.add(stepV);
                var node = start.mid(end).normalize();
                this.addNode(node, i+1, j+1);
              }
            }
          }
        }
        
        // scan boundaries for duplication
        this.boundaryScan();
      }
      
    }
    
    Geodesic.prototype = icosahedron;
    
    return {
      Geodesic : Geodesic
    };
    
  }
); 
