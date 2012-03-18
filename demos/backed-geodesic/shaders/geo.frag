precision mediump float;

varying vec4 vWorldSpaceNormal;

void main() {
  float diff = dot(vec3(0,0,-1), vWorldSpaceNormal.xyz);
  //  diff *= 1.5;
  gl_FragColor = vec4(diff, diff, 1, 1);
}
