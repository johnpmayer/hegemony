attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTextureCoord;

uniform mat4 uMMatrix;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;

varying vec4 vWorldSpaceNormal;
varying vec2 vVertexTextureCoord;

void main() {
  gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
  vWorldSpaceNormal = uMMatrix * vec4(aVertexNormal, 0.0);
  vVertexTextureCoord = aVertexTextureCoord;
}
