// ======================================================
// PRECARGA PROGRESIVA DE MULTIMEDIA
// ======================================================

const preloadCache =
  new Map()

const preloadReferences =
  new Map()


// ======================================================
// PRECARGAR UNA FUENTE
// ======================================================

function preloadMedia(
  src,
  type
) {

  if (
    !src ||
    preloadCache.has(src)
  ) {

    return preloadCache.get(src) ||
      Promise.resolve()

  }


  const promise =
    new Promise(
      (resolve) => {

        // ===============================================
        // IMAGEN
        // ===============================================

        if (
          type === 'image'
        ) {

          const image =
            new Image()

          preloadReferences.set(
            src,
            image
          )


          image.onload =
            () => {

              console.log(
                `Precarga lista: ${src}`
              )

              resolve()

            }


          image.onerror =
            () => {

              console.warn(
                `No se pudo precargar: ${src}`
              )

              resolve()

            }


          image.src =
            src

          return

        }


        // ===============================================
        // VIDEO
        // ===============================================

        const video =
          document.createElement(
            'video'
          )


        preloadReferences.set(
          src,
          video
        )


        video.preload =
          'auto'

        video.muted =
          true

        video.defaultMuted =
          true

        video.playsInline =
          true


        let resolved =
          false


        const finish =
          () => {

            if (
              resolved
            ) {
              return
            }


            resolved =
              true


            console.log(
              `Precarga lista: ${src}`
            )


            resolve()

        }


        video.addEventListener(
          'canplay',
          finish,
          {
            once: true
          }
        )


        video.addEventListener(
          'error',
          () => {

            console.warn(
              `No se pudo precargar: ${src}`
            )

            finish()

          },
          {
            once: true
          }
        )


        video.src =
          src

        video.load()


        // La precarga nunca debe bloquear
        // indefinidamente.

        setTimeout(
          finish,
          30000
        )

      }
    )


  preloadCache.set(
    src,
    promise
  )


  return promise

}


// ======================================================
// PRECARGAR SIGUIENTE ELEMENTO DEL PANEL
// ======================================================

function preloadNextMedia(
  items,
  activeIndex
) {

  const nextIndex =
    activeIndex + 1


  if (
    nextIndex >= items.length
  ) {
    return
  }


  const item =
    items[nextIndex]


  const src =
    item.dataset.mediaSrc


  const type =
    item.dataset.mediaType ||
    (
      /\.(mp4|webm|mov)$/i.test(src)
        ? 'video'
        : 'image'
    )


  preloadMedia(
    src,
    type
  )

}


// ======================================================
// EXPORT
// ======================================================

export {
  preloadMedia,
  preloadNextMedia
}