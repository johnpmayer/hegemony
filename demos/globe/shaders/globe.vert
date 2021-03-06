attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMMatrix;

varying vec4 vWorldSpaceNormal;

void main() {
  gl_Position = uMMatrix * vec4(aVertexPosition, 1.0);
  vWorldSpaceNormal = uMMatrix * vec4(aVertexNormal, 0.0);
}
