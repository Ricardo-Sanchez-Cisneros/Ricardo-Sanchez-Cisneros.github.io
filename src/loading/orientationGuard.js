// ======================================================
// CONTROL DE ORIENTACIÓN
// ======================================================

function setupOrientationGuard() {

  const orientationGuard =
    document.createElement(
      'div'
    )


  orientationGuard.className =
    'orientation-guard'


  orientationGuard.setAttribute(
    'role',
    'dialog'
  )


  orientationGuard.setAttribute(
    'aria-label',
    'Gira tu dispositivo'
  )


  orientationGuard.innerHTML = `
    <div class="orientation-guard__content">

      <div
        class="orientation-guard__device"
        aria-hidden="true"
      >
        <div class="orientation-guard__phone"></div>

        <span class="orientation-guard__arrow">
          ↻
        </span>
      </div>


      <p class="orientation-guard__eyebrow">
        EXPERIENCIA 3D
      </p>


      <h1 class="orientation-guard__title">
        Gira tu dispositivo
      </h1>


      <p class="orientation-guard__description">
        Esta experiencia está diseñada para visualizarse
        en modo horizontal.
      </p>

    </div>
  `


  document.body.appendChild(
    orientationGuard
  )


  // ====================================================
  // ACTUALIZAR ESTADO
  // ====================================================

  function updateOrientationGuard() {

    const isPortrait =
      window.matchMedia(
        '(orientation: portrait)'
      ).matches


    const isNarrowScreen =
      window.matchMedia(
        '(max-width: 900px)'
      ).matches


    const shouldBlock =
      isPortrait &&
      isNarrowScreen


    orientationGuard.classList.toggle(
      'orientation-guard--visible',
      shouldBlock
    )


    document.documentElement.classList.toggle(
      'orientation-blocked',
      shouldBlock
    )


    document.body.classList.toggle(
      'orientation-blocked',
      shouldBlock
    )

  }


  // ====================================================
  // ESTADO INICIAL
  // ====================================================

  updateOrientationGuard()


  // ====================================================
  // CAMBIOS DE TAMAÑO
  // ====================================================

  window.addEventListener(
    'resize',
    updateOrientationGuard,
    {
      passive: true
    }
  )


  // ====================================================
  // CAMBIOS DE ORIENTACIÓN
  // ====================================================

  window.addEventListener(
    'orientationchange',
    updateOrientationGuard,
    {
      passive: true
    }
  )


  // ====================================================
  // VISUAL VIEWPORT
  // Útil en navegadores móviles modernos.
  // ====================================================

  if (
    window.visualViewport
  ) {

    window.visualViewport.addEventListener(
      'resize',
      updateOrientationGuard,
      {
        passive: true
      }
    )

  }


  return orientationGuard

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupOrientationGuard
}