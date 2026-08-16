import * as THREE from 'three'

// ======================================================
// CREAR FONDO ATMOSFÉRICO
// ======================================================

function createBackground(
  scene,
  camera
) {

  // ====================================================
  // GEOMETRÍA
  // ====================================================

  const backgroundGeometry =
    new THREE.PlaneGeometry(
      1,
      1
    )


  // ====================================================
  // MATERIAL / SHADER
  // ====================================================

  const backgroundMaterial =
    new THREE.ShaderMaterial({

      uniforms: {

        colorCenter: {
          value:
            new THREE.Color(
              '#1c2638'
            )
        },

        colorEdge: {
          value:
            new THREE.Color(
              '#0f1522'
            )
        },

        colorAccent: {
          value:
            new THREE.Color(
              '#2a2942'
            )
        }

      },

      vertexShader: `
        varying vec2 vUv;

        void main() {

          vUv = uv;

          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(
              position,
              1.0
            );

        }
      `,

      fragmentShader: `
        uniform vec3 colorCenter;
        uniform vec3 colorEdge;
        uniform vec3 colorAccent;

        varying vec2 vUv;

        void main() {

          vec2 center =
            vUv - vec2(0.5);

          float distanceFromCenter =
            length(center);

          float radial =
            smoothstep(
              0.1,
              0.75,
              distanceFromCenter
            );

          vec3 color =
            mix(
              colorCenter,
              colorEdge,
              radial
            );

          float accent =
            smoothstep(
              0.0,
              0.7,
              vUv.y
            );

          color =
            mix(
              color,
              colorAccent,
              accent * 0.18
            );

          gl_FragColor =
            vec4(
              color,
              1.0
            );

        }
      `,

      depthWrite: false

    })


  // ====================================================
  // MESH
  // ====================================================

  const backgroundPlane =
    new THREE.Mesh(
      backgroundGeometry,
      backgroundMaterial
    )

  backgroundPlane.position.set(
    0,
    0,
    -12
  )

  scene.add(
    backgroundPlane
  )


  // ====================================================
  // AJUSTAR AL VIEWPORT
  // ====================================================

  function resize() {

    // Distancia entre cámara y plano
    const distance =
      Math.abs(
        camera.position.z -
        backgroundPlane.position.z
      )

    // Altura visible según FOV
    const visibleHeight =
      2 *
      Math.tan(
        THREE.MathUtils.degToRad(
          camera.fov / 2
        )
      ) *
      distance

    // Anchura según aspect ratio
    const visibleWidth =
      visibleHeight *
      camera.aspect

    // Margen pequeño para evitar
    // bordes visibles por redondeo.
    backgroundPlane.scale.set(
      visibleWidth * 1.05,
      visibleHeight * 1.05,
      1
    )

  }


  // ====================================================
  // AJUSTE INICIAL
  // ====================================================

  resize()


  // ====================================================
  // RETORNO PÚBLICO
  // ====================================================

  return {

    mesh:
      backgroundPlane,

    material:
      backgroundMaterial,

    resize

  }

}


// ======================================================
// EXPORT
// ======================================================

export {
  createBackground
}