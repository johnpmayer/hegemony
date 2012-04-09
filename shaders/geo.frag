precision mediump float;

varying vec4 vWorldSpaceNormal;
varying vec3 vVertexColor;

void main() {
  float minDiff = 0.1;
  float diff = max(dot(vec3(0,0,-1), vWorldSpaceNormal.xyz), minDiff);
  diff *= 0.8;
  gl_FragColor = vec4(vVertexColor * diff, 1);
}
