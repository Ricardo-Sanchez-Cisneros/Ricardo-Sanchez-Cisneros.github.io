import * as THREE from 'three'
import gsap from 'gsap'

// ======================================================
// CONFIGURAR ROTACIÓN MANUAL DE PROTEÍNAS
// ======================================================

function setupProteinDrag({
  camera,
  renderer,
  proteins
}) {

  // ====================================================
  // RAYCASTER
  // ====================================================

  const raycaster =
    new THREE.Raycaster()

  const pointer =
    new THREE.Vector2()


  // ====================================================
  // ESTADO
  // ====================================================

  let activeProtein =
    null

  let hoveredProtein =
    null

  let isDragging =
    false

  let previousPointerX =
    0

  let previousPointerY =
    0


  // ====================================================
  // CONFIGURACIÓN
  // ====================================================

  const rotationSensitivity =
    0.008

  const automaticRotationResumeDelay =
    0.6


  // ====================================================
  // DETECTAR PROTEÍNA BAJO CURSOR
  // ====================================================

  function getProteinUnderPointer() {

    raycaster.setFromCamera(
      pointer,
      camera
    )

    for (
      const protein
      of proteins
    ) {

      if (
        !protein.loaded ||
        !protein.model
      ) {

        continue
      }

      const intersections =
        raycaster.intersectObject(
          protein.model,
          true
        )

      if (
        intersections.length > 0
      ) {

        return protein
      }
    }

    return null
  }


  // ====================================================
  // ACTUALIZAR CURSOR NORMALIZADO
  // ====================================================

  function updatePointer(
    event
  ) {

    const rect =
      renderer.domElement
        .getBoundingClientRect()

    pointer.x =
      (
        (
          event.clientX -
          rect.left
        ) /
        rect.width
      ) * 2 - 1

    pointer.y =
      -(
        (
          event.clientY -
          rect.top
        ) /
        rect.height
      ) * 2 + 1
  }


  // ====================================================
  // POINTER MOVE
  // ====================================================

  window.addEventListener(
    'pointermove',
    (event) => {

      updatePointer(
        event
      )


      // ------------------------------------------------
      // SI ESTAMOS ARRASTRANDO
      // ------------------------------------------------

      if (
        isDragging &&
        activeProtein
      ) {

        const deltaX =
          event.clientX -
          previousPointerX

        const deltaY =
          event.clientY -
          previousPointerY

        activeProtein
          .rotationGroup
          .rotation
          .y +=
            deltaX *
            rotationSensitivity

        activeProtein
          .rotationGroup
          .rotation
          .x +=
            deltaY *
            rotationSensitivity

        // Limitar rotación vertical
        activeProtein
          .rotationGroup
          .rotation
          .x =
            THREE.MathUtils.clamp(
              activeProtein
                .rotationGroup
                .rotation
                .x,
              -Math.PI / 2,
              Math.PI / 2
            )

        previousPointerX =
          event.clientX

        previousPointerY =
          event.clientY

        return
      }


      // ------------------------------------------------
      // HOVER PARA CURSOR GRAB
      // ------------------------------------------------

      hoveredProtein =
        getProteinUnderPointer()

      if (
        hoveredProtein
      ) {

        renderer.domElement.style.cursor =
          'grab'
      }
      else {

        renderer.domElement.style.cursor =
          'default'
      }

    }
  )


  // ====================================================
  // POINTER DOWN
  // ====================================================

  renderer.domElement
    .addEventListener(
      'pointerdown',
      (event) => {

        updatePointer(
          event
        )

        const protein =
          getProteinUnderPointer()

        if (
          !protein
        ) {

          return
        }

        activeProtein =
          protein

        isDragging =
          true

        previousPointerX =
          event.clientX

        previousPointerY =
          event.clientY

        renderer.domElement.style.cursor =
          'grabbing'

        renderer.domElement
          .setPointerCapture(
            event.pointerId
          )


        // ----------------------------------------------
        // PAUSAR ROTACIÓN AUTOMÁTICA
        // ----------------------------------------------

        activeProtein.userData =
          activeProtein.userData || {}

        activeProtein.userData
          .savedRotationSpeed =
            activeProtein.rotationSpeed

        gsap.to(
          activeProtein,
          {

            rotationSpeed:
              0,

            duration:
              0.15,

            ease:
              'power2.out',

            overwrite:
              true

          }
        )

      }
    )


  // ====================================================
  // FINALIZAR DRAG
  // ====================================================

  function endDrag(
    event
  ) {

    if (
      !isDragging ||
      !activeProtein
    ) {

      return
    }

    const releasedProtein =
      activeProtein

    isDragging =
      false

    activeProtein =
      null

    renderer.domElement.style.cursor =
      hoveredProtein
        ? 'grab'
        : 'default'


    if (
      renderer.domElement
        .hasPointerCapture(
          event.pointerId
        )
    ) {

      renderer.domElement
        .releasePointerCapture(
          event.pointerId
        )
    }


    // ------------------------------------------------
    // REANUDAR ROTACIÓN AUTOMÁTICA
    // ------------------------------------------------

    const savedSpeed =
      releasedProtein
        .userData
        ?.savedRotationSpeed ??
      releasedProtein.rotationSpeed

    gsap.to(
      releasedProtein,
      {

        rotationSpeed:
          savedSpeed,

        duration:
          automaticRotationResumeDelay,

        ease:
          'power2.out',

        overwrite:
          true

      }
    )

  }


  // ====================================================
  // POINTER UP / CANCEL
  // ====================================================

  renderer.domElement
    .addEventListener(
      'pointerup',
      endDrag
    )

  renderer.domElement
    .addEventListener(
      'pointercancel',
      endDrag
    )


  // ====================================================
  // PREVENIR SELECCIÓN / DRAG DEL NAVEGADOR
  // ====================================================

  renderer.domElement.style.userSelect =
    'none'

  renderer.domElement.style.touchAction =
    'none'

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupProteinDrag
}