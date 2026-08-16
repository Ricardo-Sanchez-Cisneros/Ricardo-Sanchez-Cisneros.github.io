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

  if (explicitType) {
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
    videoExtensions.includes(extension)
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

  if (type === 'video') {

    const video =
      document.createElement('video')

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
    document.createElement('img')

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

  if (!container) {
    return []
  }

  container.replaceChildren()

  return items.map(
    (_, index) => {

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


    pause()


    activeIndex =
      index


    const item =
      items[activeIndex]


    activeMedia =
      createMediaElement(
        item
      )


    stage.replaceChildren(
      activeMedia
    )


    // ==================================================
    // TEXTO
    // ==================================================

    if (title) {

      title.textContent =
        item.dataset.mediaTitle ||
        ''

    }


    if (description) {

      description.textContent =
        item.dataset.mediaDescription ||
        ''

    }


    // ==================================================
    // CONTADOR
    // ==================================================

    if (counter) {

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
    // AUTOPLAY
    // ==================================================

    if (autoplay) {

      play()

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
    .filter(Boolean)

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