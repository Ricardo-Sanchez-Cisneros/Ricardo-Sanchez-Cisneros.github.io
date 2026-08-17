import {
  preloadNextMedia
} from '../loading/progressiveMedia.js'


// ======================================================
// CONTROL DE PANELES MULTIMEDIA
// ======================================================

const panelControllers =
  new WeakMap()


// ======================================================
// DETECTAR TIPO DE MEDIO
// ======================================================

function getMediaType(
  src,
  explicitType
) {

  if (
    explicitType
  ) {

    return explicitType

  }


  const extension =
    src
      .split('.')
      .pop()
      ?.toLowerCase()


  const videoExtensions = [
    'mp4',
    'webm',
    'mov'
  ]


  if (
    videoExtensions.includes(
      extension
    )
  ) {

    return 'video'

  }


  return 'image'

}


// ======================================================
// CREAR ELEMENTO MULTIMEDIA
// ======================================================

function createMediaElement(
  item
) {

  const src =
    item.dataset.mediaSrc


  const type =
    getMediaType(
      src,
      item.dataset.mediaType
    )


  // ====================================================
  // VIDEO
  // ====================================================

  if (
    type === 'video'
  ) {

    const video =
      document.createElement(
        'video'
      )


    video.className =
      'media-stage-media'


    video.src =
      src


    video.muted =
      true


    video.defaultMuted =
      true


    video.loop =
      true


    video.playsInline =
      true


    video.preload =
      'metadata'


    video.dataset.activeMedia =
      'true'


    return video

  }


  // ====================================================
  // IMAGEN
  // ====================================================

  const image =
    document.createElement(
      'img'
    )


  image.className =
    'media-stage-media'


  image.src =
    src


  image.alt =
    item.dataset.mediaAlt ||
    item.dataset.mediaTitle ||
    ''


  image.draggable =
    false


  image.dataset.activeMedia =
    'true'


  return image

}


// ======================================================
// CREAR INDICADORES
// ======================================================

function createDots(
  container,
  items,
  activateItem
) {

  if (
    !container
  ) {

    return []

  }


  container.replaceChildren()


  return items.map(
    (
      _,
      index
    ) => {

      const button =
        document.createElement(
          'button'
        )


      button.type =
        'button'


      button.className =
        'media-dot'


      button.setAttribute(
        'aria-label',
        `Mostrar elemento ${index + 1}`
      )


      button.addEventListener(
        'click',
        () => {

          activateItem(
            index,
            true
          )

        }
      )


      container.appendChild(
        button
      )


      return button

    }
  )

}


// ======================================================
// INICIALIZAR UN PANEL
// ======================================================

function createMediaPanel(
  panel
) {

  const stage =
    panel.querySelector(
      '[data-media-stage]'
    )


  const title =
    panel.querySelector(
      '[data-media-title]'
    )


  const description =
    panel.querySelector(
      '[data-media-description]'
    )


  const counter =
    panel.querySelector(
      '[data-media-counter]'
    )


  const dotsContainer =
    panel.querySelector(
      '[data-media-dots]'
    )


  const items = [
    ...panel.querySelectorAll(
      '[data-media-item]'
    )
  ]


  if (
    !stage ||
    items.length === 0
  ) {

    return null

  }


  let activeIndex =
    0


  let activeMedia =
    null


  let dots =
    []


  // Identificador de activación.
  // Evita que una carga anterior interfiera
  // si el usuario cambia rápidamente de evidencia.

  let activationId =
    0


  // ====================================================
  // PAUSAR MEDIO ACTUAL
  // ====================================================

  function pause() {

    if (
      activeMedia instanceof
      HTMLVideoElement
    ) {

      activeMedia.pause()

    }

  }


  // ====================================================
  // REPRODUCIR MEDIO ACTUAL
  // ====================================================

  function play() {

    if (
      activeMedia instanceof
      HTMLVideoElement
    ) {

      activeMedia
        .play()
        .catch(
          () => {}
        )

    }

  }


  // ====================================================
  // ACTIVAR ELEMENTO
  // ====================================================

  function activateItem(
    index,
    autoplay = false
  ) {

    if (
      index < 0 ||
      index >= items.length
    ) {

      return

    }


    // ==================================================
    // NUEVA ACTIVACIÓN
    // ==================================================

    activationId +=
      1


    const currentActivationId =
      activationId


    // ==================================================
    // PAUSAR MEDIO ANTERIOR
    // ==================================================

    pause()


    // ==================================================
    // ÍNDICE ACTIVO
    // ==================================================

    activeIndex =
      index


    const item =
      items[
        activeIndex
      ]


    // ==================================================
    // CREAR MEDIO
    // ==================================================

    const media =
      createMediaElement(
        item
      )


    activeMedia =
      media


    // ==================================================
    // ESTADO LOCAL DE CARGA
    // ==================================================

    const loadingIndicator =
      document.createElement(
        'div'
      )


    loadingIndicator.className =
      'media-stage-loading'


    loadingIndicator.innerHTML = `
      <span
        class="media-stage-loading__spinner"
      ></span>

      <span
        class="media-stage-loading__text"
      >
        Cargando evidencia...
      </span>
    `


    media.classList.add(
      'media-stage-media--loading'
    )


    stage.replaceChildren(
      media,
      loadingIndicator
    )


    // ==================================================
    // MEDIO LISTO
    // ==================================================

    function handleMediaReady() {

      // Ignorar eventos pertenecientes
      // a una evidencia anterior.

      if (
        currentActivationId !==
        activationId
      ) {

        return

      }


      media.classList.remove(
        'media-stage-media--loading'
      )


      media.classList.add(
        'media-stage-media--ready'
      )


      loadingIndicator.remove()


      // Si fue seleccionado manualmente,
      // reproducimos cuando realmente esté listo.

      if (
        autoplay &&
        media instanceof
        HTMLVideoElement
      ) {

        media
          .play()
          .catch(
            () => {}
          )

      }

    }


    // ==================================================
    // ERROR DEL MEDIO
    // ==================================================

    function handleMediaError() {

      if (
        currentActivationId !==
        activationId
      ) {

        return

      }


      loadingIndicator.classList.add(
        'media-stage-loading--error'
      )


      const loadingText =
        loadingIndicator.querySelector(
          '.media-stage-loading__text'
        )


      if (
        loadingText
      ) {

        loadingText.textContent =
          'No se pudo cargar la evidencia.'

      }

    }


    // ==================================================
    // COMPROBAR ESTADO DEL MEDIO
    // ==================================================

    if (
      media instanceof
      HTMLVideoElement
    ) {

      if (
        media.readyState >= 3
      ) {

        handleMediaReady()

      } else {

        media.addEventListener(
          'canplay',
          handleMediaReady,
          {
            once: true
          }
        )


        media.addEventListener(
          'error',
          handleMediaError,
          {
            once: true
          }
        )

      }

    } else {

      if (
        media.complete &&
        media.naturalWidth > 0
      ) {

        handleMediaReady()

      } else {

        media.addEventListener(
          'load',
          handleMediaReady,
          {
            once: true
          }
        )


        media.addEventListener(
          'error',
          handleMediaError,
          {
            once: true
          }
        )

      }

    }


    // ==================================================
    // TEXTO
    // ==================================================

    if (
      title
    ) {

      title.textContent =
        item.dataset.mediaTitle ||
        ''

    }


    if (
      description
    ) {

      description.textContent =
        item.dataset.mediaDescription ||
        ''

    }


    // ==================================================
    // CONTADOR
    // ==================================================

    if (
      counter
    ) {

      counter.textContent =
        `${String(
          activeIndex + 1
        ).padStart(
          2,
          '0'
        )} / ${String(
          items.length
        ).padStart(
          2,
          '0'
        )}`

    }


    // ==================================================
    // SELECTOR LATERAL
    // ==================================================

    items.forEach(
      (
        button,
        buttonIndex
      ) => {

        const isActive =
          buttonIndex ===
          activeIndex


        button.classList.toggle(
          'is-active',
          isActive
        )


        button.setAttribute(
          'aria-selected',
          String(
            isActive
          )
        )

      }
    )


    // ==================================================
    // INDICADORES
    // ==================================================

    dots.forEach(
      (
        dot,
        dotIndex
      ) => {

        dot.classList.toggle(
          'is-active',
          dotIndex ===
            activeIndex
        )

      }
    )


    // ==================================================
    // PRECARGA PROGRESIVA
    // ==================================================

    if (
      autoplay
    ) {

      preloadNextMedia(
        items,
        activeIndex
      )

    }

  }


  // ====================================================
  // EVENTOS DE SELECTORES
  // ====================================================

  items.forEach(
    (
      item,
      index
    ) => {

      item.addEventListener(
        'click',
        () => {

          activateItem(
            index,
            true
          )

        }
      )

    }
  )


  // ====================================================
  // CREAR PUNTOS
  // ====================================================

  dots =
    createDots(
      dotsContainer,
      items,
      activateItem
    )


  // ====================================================
  // ESTADO INICIAL
  // ====================================================

  activateItem(
    0,
    false
  )


  // ====================================================
  // API DEL PANEL
  // ====================================================

  const controller = {

    panel,

    play,

    pause,

    activateItem,


    getActiveIndex() {

      return activeIndex

    }

  }


  panelControllers.set(
    panel,
    controller
  )


  return controller

}


// ======================================================
// INICIALIZAR TODOS LOS PANELES
// ======================================================

function setupMediaPanels() {

  const panels = [
    ...document.querySelectorAll(
      '[data-media-panel]'
    )
  ]


  return panels
    .map(
      createMediaPanel
    )
    .filter(
      Boolean
    )

}


// ======================================================
// OBTENER CONTROLADOR
// ======================================================

function getMediaPanelController(
  panel
) {

  return panelControllers.get(
    panel
  )

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupMediaPanels,
  getMediaPanelController
}