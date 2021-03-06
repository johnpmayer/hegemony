attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMMatrix;
uniform mat4 uPMatrix;

varying vec4 vWorldSpaceNormal;

void main() {
  gl_Position = uPMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
  vWorldSpaceNormal = uMMatrix * vec4(aVertexNormal, 0.0);
}
