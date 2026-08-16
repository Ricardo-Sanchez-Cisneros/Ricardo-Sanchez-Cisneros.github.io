import * as THREE from 'three'

// ======================================================
// INICIAR RENDER LOOP
// ======================================================

function startRenderLoop({
  scene,
  camera,
  renderer,
  proteins,
  ambientSystem,
  postprocessing
}) {
  // ====================================================
  // RELOJ
  // ====================================================

  const clock =
    new THREE.Clock()


  // ====================================================
  // LOOP PRINCIPAL
  // ====================================================

  function animate() {

    requestAnimationFrame(
      animate
    )

    const delta =
      clock.getDelta()

    const elapsed =
      clock.elapsedTime


    // ==================================================
    // ROTACIÓN CONTINUA DE PROTEÍNAS
    // ==================================================

    proteins.forEach(
      (protein) => {

        if (
          !protein.loaded
        ) {

          return
        }

        protein.rotationGroup.rotation.y +=
          delta *
          protein.rotationSpeed

      }
    )


    // ==================================================
    // MOVIMIENTO AMBIENTAL
    // ==================================================

    ambientSystem.update(
      delta,
      elapsed
    )


    // ==================================================
    // RENDER
    // ==================================================

   postprocessing.composer.render()

  }


  // ====================================================
  // INICIAR
  // ====================================================

  animate()

}


// ======================================================
// EXPORT
// ======================================================

export {
  startRenderLoop
}