import * as THREE from 'three'

import {
  EffectComposer
} from 'three/addons/postprocessing/EffectComposer.js'

import {
  RenderPass
} from 'three/addons/postprocessing/RenderPass.js'

import {
  BokehPass
} from 'three/addons/postprocessing/BokehPass.js'

import {
  UnrealBloomPass
} from 'three/addons/postprocessing/UnrealBloomPass.js'

import {
  OutputPass
} from 'three/addons/postprocessing/OutputPass.js'


// ======================================================
// CREAR SISTEMA DE POSTPROCESADO
// ======================================================

function createPostprocessing({
  renderer,
  scene,
  camera
}) {

  // ====================================================
  // COMPOSER
  // ====================================================

  const composer =
    new EffectComposer(
      renderer
    )

  composer.setSize(
    window.innerWidth,
    window.innerHeight
  )

  composer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  )


  // ====================================================
  // 01 — RENDER BASE
  // ====================================================

  const renderPass =
    new RenderPass(
      scene,
      camera
    )

  composer.addPass(
    renderPass
  )


  // ====================================================
  // 02 — DEPTH OF FIELD
  // ====================================================

  const bokehPass =
    new BokehPass(
      scene,
      camera,
      {

        focus:
          6.8,

        aperture:
          0.00012,

        maxblur:
          0.01

      }
    )

  composer.addPass(
    bokehPass
  )


  // ====================================================
  // 03 — BLOOM
  // ====================================================

  const bloomPass =
    new UnrealBloomPass(

      new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      ),

      // Strength
      0.22,

      // Radius
      0.18,

      // Threshold
      1.0

    )

  composer.addPass(
    bloomPass
  )


  // ====================================================
  // 04 — OUTPUT FINAL
  // ====================================================

  const outputPass =
    new OutputPass()

  composer.addPass(
    outputPass
  )


  // ====================================================
  // RESIZE
  // ====================================================

  function resize() {

    composer.setSize(
      window.innerWidth,
      window.innerHeight
    )

    composer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    )

    bloomPass.resolution.set(
      window.innerWidth,
      window.innerHeight
    )

  }


  // ====================================================
  // RETORNO PÚBLICO
  // ====================================================

  return {

    composer,

    renderPass,

    bokehPass,

    bloomPass,

    outputPass,

    resize

  }

}


// ======================================================
// EXPORT
// ======================================================

export {
  createPostprocessing
}