// The last touch of looking down a microscope: a little colour fringing toward the edges,
// a soft vignette and fine grain.
export const LensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uRes: { value: [1, 1] },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uRes;
    varying vec2 vUv;
    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c);
      vec2 off = c * d * 0.005;
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col *= mix(1.0, 0.45, smoothstep(0.3, 0.85, d));
      float n = fract(sin(dot(floor(vUv * uRes) + fract(uTime) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * 0.018;
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `,
};
