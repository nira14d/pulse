uniform float time;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vElevation;

void main() {
    // Shape deformation
    vec3 displaced = position;

    float elevation = sin(position.y * 5.0 + time * 2.0) * 0.1
                    + sin(position.x * 5.0 + time * 1.5) * 0.1
                    + sin(position.z * 5.0 + time) * 0.05;

    displaced -= normal * elevation;

    // Varyings
    vElevation = elevation; 
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(displaced, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}