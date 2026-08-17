import {
  loadingManager
} from './loadingManager.js'


// ======================================================
// INDICADOR DE SCROLL
// ======================================================

function setupScrollHint() {

  const scrollHint =
    document.createElement(
      'div'
    )


  scrollHint.className =
    'scroll-hint'


  scrollHint.innerHTML = `
    <span class="scroll-hint__label">
      SCROLL
    </span>

    <span
      class="scroll-hint__arrow"
      aria-hidden="true"
    >
      ↓
    </span>
  `


  document.body.appendChild(
    scrollHint
  )


  let hidden =
    false


  // ====================================================
  // MOSTRAR CUANDO TERMINE LA CARGA
  // ====================================================

  loadingManager.onReady(
    () => {

      setTimeout(
        () => {

          if (
            hidden
          ) {
            return
          }


          scrollHint.classList.add(
            'scroll-hint--visible'
          )

        },
        900
      )

    }
  )


  // ====================================================
  // OCULTAR
  // ====================================================

  function hideScrollHint() {

    if (
      hidden
    ) {
      return
    }


    hidden =
      true


    scrollHint.classList.remove(
      'scroll-hint--visible'
    )


    scrollHint.classList.add(
      'scroll-hint--hidden'
    )


    setTimeout(
      () => {

        scrollHint.remove()

      },
      700
    )

  }


  // ====================================================
  // PRIMERA INTERACCIÓN
  // ====================================================

  window.addEventListener(
    'scroll',
    hideScrollHint,
    {
      once: true,
      passive: true
    }
  )


  window.addEventListener(
    'wheel',
    hideScrollHint,
    {
      once: true,
      passive: true
    }
  )


  window.addEventListener(
    'touchmove',
    hideScrollHint,
    {
      once: true,
      passive: true
    }
  )


  window.addEventListener(
    'keydown',
    (event) => {

      const navigationKeys = [
        'ArrowDown',
        'PageDown',
        ' ',
        'Spacebar'
      ]


      if (
        navigationKeys.includes(
          event.key
        )
      ) {

        hideScrollHint()

      }

    },
    {
      once: true
    }
  )


  return scrollHint

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupScrollHint
}