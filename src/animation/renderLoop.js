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
  // TEMPORIZADOR
  // ====================================================

  const timer =
    new THREE.Timer()


  // Evita saltos temporales grandes cuando el usuario
  // cambia de pestaña o el navegador queda oculto.

  timer.connect(
    document
  )


  // ====================================================
  // LOOP PRINCIPAL
  // ====================================================

  function animate(
    timestamp
  ) {

    timer.update(
      timestamp
    )


    const delta =
      timer.getDelta()


    const elapsed =
      timer.getElapsed()


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


    requestAnimationFrame(
      animate
    )

  }


  // ====================================================
  // INICIAR
  // ====================================================

  requestAnimationFrame(
    animate
  )

}


// ======================================================
// EXPORT
// ======================================================

export {
  startRenderLoop
}