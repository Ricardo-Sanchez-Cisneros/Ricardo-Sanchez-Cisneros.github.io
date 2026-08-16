import * as THREE from 'three'
import gsap from 'gsap'

// ======================================================
// CONFIGURAR HOVER DE PROTEÍNAS
// ======================================================

function setupProteinHover({
  camera,
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

  let hoveredProtein =
    null


  // ====================================================
  // TRANSPARENTAR SUPERFICIE
  // ====================================================

  function revealProtein(
    protein
  ) {

    protein.surfaces.forEach(
      (surface) => {

        const material =
          surface.material

        // Activar transparencia
        material.transparent =
          true

        material.depthWrite =
          false

        material.needsUpdate =
          true

        gsap.to(
          material,
          {

            opacity:
              0.18,

            transmission:
              0.08,

            duration:
              0.4,

            ease:
              'power2.out',

            overwrite:
              true

          }
        )

      }
    )

  }


  // ====================================================
  // RESTAURAR SUPERFICIE
  // ====================================================

  function hideProteinInterior(
    protein
  ) {

    protein.surfaces.forEach(
      (surface) => {

        const material =
          surface.material

        // Recuperamos inmediatamente
        // la escritura de profundidad.
        material.depthWrite =
          true

        material.needsUpdate =
          true

        gsap.to(
          material,
          {

            opacity:
              1.0,

            transmission:
              0.08,

            duration:
              0.28,

            ease:
              'power2.out',

            overwrite:
              true,

            onComplete: () => {

              // Volver al estado opaco real.
              material.transparent =
                false

              material.opacity =
                1.0

              material.transmission =
                0.08

              material.depthWrite =
                true

              material.needsUpdate =
                true

            }

          }
        )

      }
    )

  }


  // ====================================================
  // DETECTAR PROTEÍNA BAJO EL CURSOR
  // ====================================================

  function getHoveredProtein() {

    for (
      const protein
      of proteins
    ) {

      if (
        !protein.loaded ||
        protein.surfaces.length === 0
      ) {

        continue

      }

      const intersections =
        raycaster.intersectObjects(
          protein.surfaces,
          false
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
  // POINTER MOVE
  // ====================================================

  window.addEventListener(
    'pointermove',
    (event) => {

      pointer.x =
        (
          event.clientX /
          window.innerWidth
        ) * 2 - 1

      pointer.y =
        -(
          event.clientY /
          window.innerHeight
        ) * 2 + 1

      raycaster.setFromCamera(
        pointer,
        camera
      )

      const currentProtein =
        getHoveredProtein()


      // ------------------------------------------------
      // ENTRA A UNA PROTEÍNA
      // ------------------------------------------------

      if (
        currentProtein &&
        currentProtein !==
          hoveredProtein
      ) {

        // Si veníamos de otra proteína,
        // restaurarla primero.
        if (
          hoveredProtein
        ) {

          hideProteinInterior(
            hoveredProtein
          )

        }

        hoveredProtein =
          currentProtein

        revealProtein(
          hoveredProtein
        )

        return
      }


      // ------------------------------------------------
      // SALE DE TODAS LAS PROTEÍNAS
      // ------------------------------------------------

      if (
        !currentProtein &&
        hoveredProtein
      ) {

        hideProteinInterior(
          hoveredProtein
        )

        hoveredProtein =
          null

      }

    }
  )


  // ====================================================
  // POINTER LEAVE
  // ====================================================

  window.addEventListener(
    'pointerleave',
    () => {

      if (
        hoveredProtein
      ) {

        hideProteinInterior(
          hoveredProtein
        )

        hoveredProtein =
          null

      }

    }
  )

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupProteinHover
}