
// scene

define(
  ["utils","mjs"],
  function(utils,mjs) {
    
    var m = mjs.M4x4
    
    function DAGNode(ch) {
      this.local = m.clone(m.I)
      this.children = ch ? ch : [];
    }
    
    DAGNode.prototype = {
      draw : function() {
        utils.pushModelMatrix(this.local)
        for (var c in this.children) {
          this.children[c].draw();
        }
        utils.popModelMatrix();
      }
    };
    
    function Geometry(mesh) {
      this.mesh = mesh;
    }
    
    Geometry.prototype = {
      draw : function() {
        this.mesh.draw();
      }
    };
    
    return {
      DAGNode : DAGNode,
      Geometry : Geometry
    };
    
  }
);
