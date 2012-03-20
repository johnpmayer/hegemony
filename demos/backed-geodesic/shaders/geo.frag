precision mediump float;

varying vec4 vWorldSpaceNormal;
varying vec3 vVertexColor;

void main() {
  float diff = dot(vec3(0,0,-1), vWorldSpaceNormal.xyz);
  diff *= 0.8;
  //gl_FragColor = vec4(diff, diff, 1, 1);
  gl_FragColor = vec4(vVertexColor * diff, 1);
}
