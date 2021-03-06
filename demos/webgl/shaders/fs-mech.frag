precision mediump float;

varying vec4 vWorldSpaceNormal;
varying vec2 vVertexTextureCoord;

uniform sampler2D uDiffuseSampler;
uniform sampler2D uEmissiveSampler;

void main() {
  float diff = dot(vec3(0,0,1), vWorldSpaceNormal.xyz);
  vec4 color = diff * texture2D(uDiffuseSampler, vVertexTextureCoord);
  vec4 emissive = texture2D(uEmissiveSampler, vVertexTextureCoord);
  gl_FragColor = vec4(max(color.rgb, emissive.rgb), 1);
}
