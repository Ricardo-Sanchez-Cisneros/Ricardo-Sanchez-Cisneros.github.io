import {
  setLanguage,
  getCurrentLanguage
} from './languageManager.js'


// ======================================================
// SELECTOR VISUAL DE IDIOMA
// ======================================================

function setupLanguageSwitch() {

  const existingSwitch =
    document.querySelector(
      '.language-switch'
    )


  if (
    existingSwitch
  ) {

    return existingSwitch

  }


  // ====================================================
  // CONTENEDOR
  // ====================================================

  const languageSwitch =
    document.createElement(
      'div'
    )


  languageSwitch.className =
    'language-switch'


  languageSwitch.setAttribute(
    'role',
    'group'
  )


  languageSwitch.setAttribute(
    'aria-label',
    'Idioma / Language'
  )


  languageSwitch.innerHTML = `
    <button
      class="language-switch__button"
      type="button"
      data-language="es"
      aria-label="Español"
    >
      ES
    </button>

    <span
      class="language-switch__divider"
      aria-hidden="true"
    ></span>

    <button
      class="language-switch__button"
      type="button"
      data-language="en"
      aria-label="English"
    >
      EN
    </button>
  `


  document.body.appendChild(
    languageSwitch
  )


  const buttons = [
    ...languageSwitch.querySelectorAll(
      '[data-language]'
    )
  ]


  // ====================================================
  // ESTADO VISUAL DEL IDIOMA
  // ====================================================

  function updateSwitch(
    language
  ) {

    buttons.forEach(
      (button) => {

        const buttonLanguage =
          button.dataset.language


        const isActive =
          buttonLanguage ===
          language


        button.classList.toggle(
          'language-switch__button--active',
          isActive
        )


        button.setAttribute(
          'aria-pressed',
          isActive
            ? 'true'
            : 'false'
        )

      }
    )

  }


  // ====================================================
  // CLICK
  // ====================================================

  buttons.forEach(
    (button) => {

      button.addEventListener(
        'click',
        () => {

          const language =
            button.dataset.language


          if (
            language ===
            getCurrentLanguage()
          ) {

            return

          }


          setLanguage(
            language
          )

        }
      )

    }
  )


  // ====================================================
  // CAMBIO DE IDIOMA DESDE OTROS MÓDULOS
  // ====================================================

  window.addEventListener(
    'portfolio:languagechange',
    (event) => {

      updateSwitch(
        event.detail.language
      )

    }
  )


  // ====================================================
  // MOSTRAR SOLO EN LA PORTADA
  // ====================================================

  const introSection =
    document.querySelector(
      '.intro-section'
    )


  if (
    introSection
  ) {

    const introObserver =
      new IntersectionObserver(
        (entries) => {

          const entry =
            entries[0]


          languageSwitch.classList.toggle(
            'language-switch--hidden',
            !entry.isIntersecting
          )

        },
        {
          threshold:
            0.15
        }
      )


    introObserver.observe(
      introSection
    )

  }


  // ====================================================
  // ESTADO INICIAL
  // ====================================================

  updateSwitch(
    getCurrentLanguage()
  )


  return languageSwitch

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupLanguageSwitch
}