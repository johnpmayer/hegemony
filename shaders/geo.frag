precision mediump float;

varying vec4 vWorldSpaceNormal;
varying vec3 vVertexColor;

void main() {
  float diff = max(dot(vec3(0,0,-1), vWorldSpaceNormal.xyz),0.05);
  gl_FragColor = vec4(vVertexColor * diff, 1);
}
