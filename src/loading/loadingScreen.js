import {
  loadingManager
} from './loadingManager.js'


// ======================================================
// PANTALLA DE CARGA
// ======================================================

function setupLoadingScreen() {

  const loadingScreen =
    document.createElement('div')

  loadingScreen.className =
    'loading-screen'

  loadingScreen.innerHTML = `
    <div class="loading-screen__content">

      <p class="loading-screen__eyebrow">
        Q.B.P. RICARDO SÁNCHEZ CISNEROS
      </p>

      <h1 class="loading-screen__title">
        Preparando portafolio
      </h1>

      <p class="loading-screen__description">
        Cargando contenido y visualización 3D
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


  // Bloqueamos scroll mientras carga.
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

      // Evita que visualmente el porcentaje retroceda.
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