import {
  loadingManager
} from './loadingManager.js'

import {
  t
} from '../i18n/languageManager.js'


// ======================================================
// PANTALLA DE CARGA
// ======================================================

function setupLoadingScreen() {

  const loadingScreen =
    document.createElement(
      'div'
    )


  loadingScreen.className =
    'loading-screen'


  loadingScreen.innerHTML = `
    <div class="loading-screen__content">

      <p
        class="loading-screen__eyebrow"
        data-i18n="loading.eyebrow"
      >
        ${t('loading.eyebrow')}
      </p>

      <h1
        class="loading-screen__title"
        data-i18n="loading.title"
      >
        ${t('loading.title')}
      </h1>

      <p
        class="loading-screen__description"
        data-i18n="loading.description"
      >
        ${t('loading.description')}
      </p>

      <div class="loading-screen__progress">

        <div class="loading-screen__bar">

          <div
            class="loading-screen__bar-fill"
            data-loading-bar
          ></div>

        </div>

        <span
          class="loading-screen__percentage"
          data-loading-percentage
        >
          0%
        </span>

      </div>

    </div>
  `


  document.body.appendChild(
    loadingScreen
  )


  // ====================================================
  // BLOQUEAR SCROLL
  // ====================================================

  document.documentElement.classList.add(
    'portfolio-loading'
  )


  document.body.classList.add(
    'portfolio-loading'
  )


  const percentage =
    loadingScreen.querySelector(
      '[data-loading-percentage]'
    )


  const bar =
    loadingScreen.querySelector(
      '[data-loading-bar]'
    )


  let currentProgress =
    0


  // ====================================================
  // ACTUALIZAR PROGRESO
  // ====================================================

  loadingManager.onProgress(
    (progress) => {

      currentProgress =
        Math.max(
          currentProgress,
          progress
        )


      percentage.textContent =
        `${currentProgress}%`


      bar.style.width =
        `${currentProgress}%`

    }
  )


  // ====================================================
  // FINALIZAR CARGA
  // ====================================================

  loadingManager.onReady(
    () => {

      percentage.textContent =
        '100%'


      bar.style.width =
        '100%'


      setTimeout(
        () => {

          loadingScreen.classList.add(
            'loading-screen--hidden'
          )


          document.documentElement.classList.remove(
            'portfolio-loading'
          )


          document.body.classList.remove(
            'portfolio-loading'
          )


          setTimeout(
            () => {

              loadingScreen.remove()

            },
            900
          )

        },
        350
      )

    }
  )


  return loadingScreen

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupLoadingScreen
}