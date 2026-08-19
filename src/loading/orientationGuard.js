import {
  t
} from '../i18n/languageManager.js'


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
    t(
      'orientation.aria'
    )
  )


  orientationGuard.dataset.i18nAriaLabel =
    'orientation.aria'


  orientationGuard.innerHTML = `
    <div class="orientation-guard__content">

      <div
        class="orientation-guard__device"
        aria-hidden="true"
      >

        <div
          class="orientation-guard__phone"
        ></div>

        <span
          class="orientation-guard__arrow"
        >
          ↻
        </span>

      </div>


      <p
        class="orientation-guard__eyebrow"
        data-i18n="orientation.eyebrow"
      >
        ${t('orientation.eyebrow')}
      </p>


      <h1
        class="orientation-guard__title"
        data-i18n="orientation.title"
      >
        ${t('orientation.title')}
      </h1>


      <p
        class="orientation-guard__description"
        data-i18n="orientation.description"
      >
        ${t('orientation.description')}
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


  updateOrientationGuard()


  window.addEventListener(
    'resize',
    updateOrientationGuard,
    {
      passive: true
    }
  )


  window.addEventListener(
    'orientationchange',
    updateOrientationGuard,
    {
      passive: true
    }
  )


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