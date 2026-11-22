// Source: basementstudio/ship-25-explorations, depth experiment, commit 6e6342ea7008b66b9f32afcedc44534596b27b16
precision highp float;
#define GLSLIFY 1

//
// GLSL textureless classic 2D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-08-22
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec4 mod289_0(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute_0(vec4 x)
{
  return mod289_0(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt_0(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade_0(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise_0(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289_0(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute_0(permute_0(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt_0(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade_0(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289_1(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289_1(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute_1(vec4 x)
{
  return mod289_1(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt_1(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade_1(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise_1(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289_1(Pi0);
  Pi1 = mod289_1(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute_1(permute_1(ix) + iy);
  vec4 ixy0 = permute_1(ixy + iz0);
  vec4 ixy1 = permute_1(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt_1(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt_1(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade_1(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

#define MAX_STEPS (300)
#define SURFACE_DIST (0.00001)
#define MAX_DISTANCE (30.0)

uniform vec3 cPos;
uniform vec4 cameraQuaternion;
uniform float fov;
uniform float uTime;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform mat3 floorRotation;
uniform vec3 projectedMousePos;
uniform float speed;
uniform vec3 mainColor;
uniform sampler2D matcapMap;
uniform sampler2D reflectionMap;
uniform float reflectionIntensity;
uniform vec3 lightDirection;
uniform float lightIntensity;
uniform float glossiness;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vPosition;

struct Material {
  vec3 color;
  float glossiness;
  float reflectivity;
};

struct RayHit {
  float dist;
  Material material;
};

struct CastedRay {
  bool hit;
  vec3 position;
};

struct RayLightResult {
  vec3 color;
  float reflectFactor;
};

struct SurfaceResult {
  vec3 color;
  vec3 normal;
  float reflectFactor;
};

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

vec3 Translate(vec3 p, vec3 t) {
  return p - t;
}

// Expensive, do not use
vec3 Rotate(vec3 p, vec3 r) {
  // Rotation around X axis
  mat3 rotX = mat3(
    1.0,
    0.0,
    0.0,
    0.0,
    cos(r.x),
    -sin(r.x),
    0.0,
    sin(r.x),
    cos(r.x)
  );

  // Rotation around Y axis
  mat3 rotY = mat3(
    cos(r.y),
    0.0,
    sin(r.y),
    0.0,
    1.0,
    0.0,
    -sin(r.y),
    0.0,
    cos(r.y)
  );

  // Rotation around Z axis
  mat3 rotZ = mat3(
    cos(r.z),
    -sin(r.z),
    0.0,
    sin(r.z),
    cos(r.z),
    0.0,
    0.0,
    0.0,
    1.0
  );

  // Apply all rotations in order (Z * Y * X)
  return p * rotX * rotY * rotZ;
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
  vec3 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sdPlane(vec3 p, vec4 n) {
  return dot(p, normalize(n.xyz)) + n.w;
}

float sdPyramid(vec3 p, float h) {
  float m2 = h * h + 0.25;

  p.xz = abs(p.xz);
  p.xz = p.z > p.x ? p.zx : p.xz;
  p.xz -= 0.5;

  vec3 q = vec3(p.z, h * p.y - 0.5 * p.x, h * p.x + 0.5 * p.y);

  float s = max(-q.x, 0.0);
  float t = clamp((q.y - 0.5 * p.z) / (m2 + 0.25), 0.0, 1.0);

  float a = m2 * (q.x + s) * (q.x + s) + q.y * q.y;
  float b =
    m2 * (q.x + 0.5 * t) * (q.x + 0.5 * t) + (q.y - m2 * t) * (q.y - m2 * t);

  float d2 = min(q.y, -q.x * m2 - q.y * 0.5) > 0.0 ? 0.0 : min(a, b);

  return sqrt((d2 + q.z * q.z) / m2) * sign(max(q.z, -p.y));
}

float random(vec2 p) {
  return fract(sin(dot(p.xy, vec2(12.345, 67.89))) * 43758.5453123);
}

float getNoiseLevel(vec3 p) {
  float centerLength = 1.0;

  vec3 centerP = Translate(p, projectedMousePos);
  float center = (centerLength - length(centerP)) / centerLength;
  center = clamp(center, 0.0, 1.0);
  center = smoothstep(0.0, 1.0, center);

  float sinNoise = sin((center + uTime * 0.1) * 20.0) * 0.1 * center;

  // polar noise arriund center
  float polarNoise = cos(atan(centerP.x, centerP.z) * 50.0 + uTime * 10.0);

  float n2 = sin(p.x * 20.0) + sin(p.z * 20.0);

  float bigNoise = cnoise_1(vec3(p.xz * 2.3, uTime * 0.2));

  float n = 0.0;
  n = bigNoise * n2 * sinNoise + sinNoise * 0.3;
  n *= speed;
  return n;
}

float getSceneHit(vec3 p) {
  vec3 floorP = p;
  floorP = Translate(
    floorP,
    vec3(0.0, getNoiseLevel(vec3(p.x, 0.0, p.z)), 0.0)
  );

  float floorPlane = sdPlane(floorP, vec4(0.0, 1.0, 0.0, 0.0));

  vec3 cubeCenter = projectedMousePos;
  cubeCenter.y += 0.1;
  float cube = sdSphere(Translate(p, cubeCenter), 0.1);

  return floorPlane;
}

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289_2(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289_2(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute_2(vec4 x)
{
  return mod289_2(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt_2(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade_2(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise_2(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289_2(Pi0);
  Pi1 = mod289_2(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute_2(permute_2(ix) + iy);
  vec4 ixy0 = permute_2(ixy + iz0);
  vec4 ixy1 = permute_2(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt_2(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt_2(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade_2(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

#define PI (3.14159265359)

const float pi = 3.1415926535897932384626433832795;
const float goldenAngle = pi * (3.0 - sqrt(5.0)); // Golden angle in radians

vec2 getVogel(float diskSize, float i, float totalSamples, float rotation) {
  float cosAngle = cos(rotation);
  float sinAngle = sin(rotation);

  float r = diskSize * sqrt(float(i) / float(totalSamples));
  float theta = float(i) * goldenAngle;

  vec2 offset;
  offset.x = r * cos(theta);
  offset.y = r * sin(theta);

  vec2 rotatedOffset;
  rotatedOffset.x = cosAngle * offset.x - sinAngle * offset.y;
  rotatedOffset.y = sinAngle * offset.x + cosAngle * offset.y;

  return rotatedOffset;
}

const float ior = 1.01;

vec2 normalToReflectionUv(vec3 n) {
  float u = atan(n.x, n.z) / (2.0 * PI) + 0.5;
  // Remap u to go from 0 to 1 to 0
  u = 1.0 - abs(2.0 * u - 1.0);

  float v = n.y * 0.5 + 0.5;
  return vec2(u, v);
}

// Normal calculation function (using gradient):
const vec3 GRADIENT_STEP_2212694189 = vec3(0.001, 0.0, 0.0);
vec3 getNormal(vec3 p) {
  float gradientX =
    getSceneHit(p + GRADIENT_STEP_2212694189.xyy) - getSceneHit(p - GRADIENT_STEP_2212694189.xyy);
  float gradientY =
    getSceneHit(p + GRADIENT_STEP_2212694189.yxy) - getSceneHit(p - GRADIENT_STEP_2212694189.yxy);
  float gradientZ =
    getSceneHit(p + GRADIENT_STEP_2212694189.yyx) - getSceneHit(p - GRADIENT_STEP_2212694189.yyx);
  return normalize(vec3(gradientX, gradientY, gradientZ));
}

const int totalSamples_0 = 20;
const float diskSize_0 = 0.01;

float rand3(vec3 p) {
  return fract(sin(dot(p, vec3(12.75613, 38.12123, 78.23121))) * 13234.76575);
}

float getGaussian(float x, float sigma) {
  return exp(-x * x / (2.0 * sigma * sigma));
}

vec3 getReflection(vec3 normal, float randomRotation) {
  vec2 uv = normalToReflectionUv(normal);
  vec3 reflection = vec3(0.0);

  reflection = vec3(0.0);

  for (int i = 0; i < totalSamples_0; i++) {
    vec2 distUv = getVogel(
      diskSize_0,
      float(i),
      float(totalSamples_0),
      randomRotation
    );
    float gaussian = getGaussian(float(i) / float(totalSamples_0), 0.1);
    reflection += texture2D(reflectionMap, uv + distUv).rgb * gaussian;
  }

  reflection /= float(totalSamples_0);
  reflection *= 6.0;

  return reflection;
}

SurfaceResult getSurfaceLight(vec3 p, vec3 rd, vec3 ro) {
  vec3 viewDirection = -rd;
  vec3 materialColor = mainColor;
  vec3 normal = getNormal(p);

  float lambert = max(0.0, dot(lightDirection, normal));
  vec3 vLambertLight = mainColor * lambert;

  float fresnel = pow(1.0 - dot(normal, viewDirection), 5.0);

  float specularExponent = pow(2.0, glossiness * 10.0) + 20.0;
  vec3 halfVector = normalize(lightDirection + viewDirection);
  float specular = max(dot(halfVector, normal), 0.0);
  specular = pow(specular, specularExponent);
  specular = specular * smoothstep(0.0, 1.0, lambert * 2.0);
  specular = specular * glossiness * 0.001;

  float specular2 = dot(normal, lightDirection);
  specular2 = pow(specular2, specularExponent);
  specular2 = specular2 * smoothstep(0.0, 1.0, lambert * 2.0);
  specular2 = specular2 * glossiness;
  specular2 *= lightIntensity;

  specular += specular2;

  vec3 vSpecularLight = vec3(1.0) * specular * lightIntensity;
  // combining the two lights
  vec3 light = vLambertLight + vSpecularLight;

  vec3 reflectionDirection = reflect(rd, normal);

  float rotation = rand3(p * 100.0);
  vec3 reflection =
    getReflection(reflectionDirection, rotation) * reflectionIntensity;
  light += reflection * fresnel;

  // vec3 light = lambert * materialColor;

  return SurfaceResult(vec3(light), normal, 0.0);
}

CastedRay castRay(vec3 ro, vec3 rd, float maxDistance, float surfaceDistance) {
  float d0 = 0.0;
  float hitPoint = getSceneHit(ro);
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + d0 * rd;
    hitPoint = getSceneHit(p);
    d0 += hitPoint;
    if (hitPoint < surfaceDistance || d0 > maxDistance) {
      break;
    }
    ;
  }
  bool isHit = hitPoint < surfaceDistance;
  vec3 p = ro + d0 * rd;
  return CastedRay(isHit, p);
}

vec2 normalToUv(vec3 normal) {
  return normal.xy;
}

// returns a color for the given ray
vec3 rayMarch(vec3 ro, vec3 rd) {
  vec3 rayPosition = ro;
  vec3 rayDirection = rd;
  vec3 result = vec3(0.0);

  CastedRay hit = castRay(
    rayPosition,
    rayDirection,
    MAX_DISTANCE,
    SURFACE_DIST
  );

  RayLightResult lightResult;

  if (hit.hit) {
    SurfaceResult objectLight = getSurfaceLight(hit.position, rayDirection, ro);
    lightResult = RayLightResult(objectLight.color, objectLight.reflectFactor);

  } else {
    lightResult = RayLightResult(vec3(0.0), 0.0);
  }

  return lightResult.color;
}

// camera utils

// https://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
vec4 quat_from_axis_angle(vec3 axis, float angle) {
  vec4 qr;
  float half_angle = angle * 0.5 * 3.14159 / 180.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) {
  vec4 q = quat_from_axis_angle(axis, angle);
  vec3 v = position.xyz;
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

vec3 quaterion_rotate(vec3 v, vec4 q) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
  float aspectRatio = resolution.x / resolution.y;
  vec3 cameraOrigin = cPos;

  float fovMult = fov / 90.0;

  vec2 screenPos = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
  screenPos.x *= aspectRatio;
  screenPos *= fovMult;
  vec3 ray = vec3(screenPos.xy, -1.0);
  ray = quaterion_rotate(ray, cameraQuaternion);
  ray = normalize(ray);

  vec3 color = rayMarch(cameraOrigin, ray);

  gl_FragColor = vec4(color, 1.0);
}
