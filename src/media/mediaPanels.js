import {
  prioritizeBackgroundMedia
} from '../loading/backgroundMediaLoader.js'

import {
  t
} from '../i18n/languageManager.js'


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


    // El BackgroundLoader prepara los archivos en paralelo.
    // Si el usuario llega antes, el navegador debe solicitar
    // todo lo posible y no limitarse únicamente a metadata.

    video.preload =
      'auto'


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


  let activeLoadingIndicator =
    null


  let dots =
    []


  // Identificador de activación.
  // Evita que una carga anterior interfiera
  // si se cambia rápidamente de evidencia.

  let activationId =
    0


  // ====================================================
  // OBTENER ELEMENTO ACTIVO
  // ====================================================

  function getActiveItem() {

    return items[
      activeIndex
    ] || null

  }


  // ====================================================
  // ACTUALIZAR INFORMACIÓN DE LA EVIDENCIA
  // ====================================================

  function updateActiveMediaInfo() {

    const item =
      getActiveItem()


    if (
      !item
    ) {

      return

    }


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


    // Actualizar ALT si el medio activo es una imagen.

    if (
      activeMedia instanceof
      HTMLImageElement
    ) {

      activeMedia.alt =
        item.dataset.mediaAlt ||
        item.dataset.mediaTitle ||
        ''

    }

  }


  // ====================================================
  // ACTUALIZAR TEXTO DE CARGA
  // ====================================================

  function updateLoadingText() {

    if (
      !activeLoadingIndicator
    ) {

      return

    }


    const loadingText =
      activeLoadingIndicator.querySelector(
        '.media-stage-loading__text'
      )


    if (
      !loadingText
    ) {

      return

    }


    const isError =
      activeLoadingIndicator.classList.contains(
        'media-stage-loading--error'
      )


    loadingText.textContent =
      isError
        ? t(
            'media.error'
          )
        : t(
            'media.loading'
          )

  }


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
      getActiveItem()


    if (
      !item
    ) {

      return

    }


    // ==================================================
    // PRIORIZAR EN BACKGROUND LOADER
    // ==================================================
    //
    // Si el archivo todavía está esperando en la cola,
    // se mueve al frente.
    //
    // Si ya se descargó o está siendo descargado,
    // BackgroundLoader simplemente no hace nada.
    // ==================================================

    prioritizeBackgroundMedia(
      item.dataset.mediaSrc
    )


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


    activeLoadingIndicator =
      loadingIndicator


    loadingIndicator.className =
      'media-stage-loading'


    loadingIndicator.innerHTML = `
      <span
        class="media-stage-loading__spinner"
      ></span>

      <span
        class="media-stage-loading__text"
      >
        ${t('media.loading')}
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


      if (
        activeLoadingIndicator ===
        loadingIndicator
      ) {

        activeLoadingIndicator =
          null

      }


      // Si fue seleccionado manualmente,
      // reproducimos cuando esté realmente listo.

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


      updateLoadingText()

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


        // Forzar la solicitud con preload="auto".

        media.load()

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

    updateActiveMediaInfo()


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
  // CAMBIO DE IDIOMA
  // ====================================================
  //
  // languageManager actualiza primero los data-* de
  // cada selector y posteriormente emite este evento.
  //
  // Aquí refrescamos la evidencia que ya está visible,
  // sin recrear imágenes ni videos.
  // ====================================================

  function handleLanguageChange() {

    updateActiveMediaInfo()

    updateLoadingText()

  }


  window.addEventListener(
    'portfolio:languagechange',
    handleLanguageChange
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

    },


    getActiveMedia() {

      return activeMedia

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