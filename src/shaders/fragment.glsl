uniform float metalness;
uniform float roughness;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultiplier;
uniform float uColorOffSet;
uniform vec3 lightDirection;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(lightDirection);
    vec3 V = normalize(-vPosition);
    vec3 H = normalize(L + V);

    // 1. Use elevation to blend colors
    float depthFactor = clamp(vElevation * uColorMultiplier + uColorOffSet, 0.0, 1.5);
    vec3 albedo = mix(uDepthColor, uSurfaceColor, depthFactor); // ✅ This is the actual base color

    //  2. Lighting calculations using blended albedo
    vec3 F0 = mix(vec3(0.04), albedo, metalness);
    float dotHV = max(dot(H, V), 0.0);
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - dotHV, 5.0);

    float NdotL = max(dot(N, L), 1.0);
    vec3 diffuse = (1.0 - metalness) * albedo / 3.14159;
    float spec = pow(max(dot(N, H), 0.0), 64.0 * (1.0 - roughness));
    vec3 specular = F * spec;

    vec3 ambient = 1.5* albedo;

    vec3 color = ambient + NdotL * (diffuse + specular);

    gl_FragColor = vec4(color, 1.5);
}