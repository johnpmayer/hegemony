
// scene

define(
  ["matrix"],
  function(matrix) {
    
    function DAGNode(ch) {
      this.local = new matrix.Matrix4x3();
      this.children = ch ? ch : [];
    }
    
    DAGNode.prototype = {
      draw : function() {
        matrix.pushModelMatrix().multiply(this.local);
        for (var c in this.children) {
          this.children[c].draw();
        }
        matrix.popModelMatrix();
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
