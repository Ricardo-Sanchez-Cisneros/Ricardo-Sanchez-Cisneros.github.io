import * as THREE from 'three'

// ======================================================
// ESCENA
// ======================================================

const scene =
  new THREE.Scene()

scene.background =
  new THREE.Color('#111827')


// ======================================================
// CÁMARA
// ======================================================

const camera =
  new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
      window.innerHeight,
    0.1,
    100
  )

camera.position.set(
  0,
  0,
  7
)

camera.lookAt(
  0,
  0,
  0
)


// ======================================================
// RENDERER
// ======================================================

const renderer =
  new THREE.WebGLRenderer({
    antialias: true
  })

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
)

renderer.outputColorSpace =
  THREE.SRGBColorSpace

renderer.toneMapping =
  THREE.ACESFilmicToneMapping

renderer.toneMappingExposure =
  1.0

document.body.appendChild(
  renderer.domElement
)


// ======================================================
// RESPONSIVE
// ======================================================

function resizeScene() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight

  camera.updateProjectionMatrix()

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  )
}


// ======================================================
// EXPORTS
// ======================================================

export {
  scene,
  camera,
  renderer,
  resizeScene
}