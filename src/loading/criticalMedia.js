import {
  loadingManager
} from './loadingManager.js'


// ======================================================
// RECURSOS PROFESIONALES PRIORITARIOS
// ======================================================

const CRITICAL_MEDIA = [

  {
    url:
      '/media/hvac/integridad_filtro_cabina.mp4',

    type:
      'video'
  },

  {
    url:
      '/media/aseptic/areas_asepticas.webp',

    type:
      'image'
  },

  {
    url:
      '/media/thermal/perfil_termico.png',

    type:
      'image'
  },

  {
    url:
      '/media/digital/powerbi1.mp4',

    type:
      'video'
  }

]


// ======================================================
// MANTENER REFERENCIAS
//
// Esto permite que los videos sigan almacenándose
// en buffer después de que el loader desaparezca.
// ======================================================

const preloadReferences =
  []


// ======================================================
// PRECARGAR IMAGEN
// ======================================================

function preloadImage(
  url
) {

  const image =
    new Image()


  preloadReferences.push(
    image
  )


  image.onload =
    () => {

      console.log(
        `Imagen prioritaria cargada: ${url}`
      )


      loadingManager.complete(
        url
      )

    }


  image.onerror =
    (error) => {

      console.error(
        `Error cargando imagen prioritaria ${url}:`,
        error
      )


      loadingManager.fail(
        url,
        error
      )

    }


  image.src =
    url

}


// ======================================================
// PRECARGAR VIDEO
// ======================================================

function preloadVideo(
  url
) {

  const video =
    document.createElement(
      'video'
    )


  preloadReferences.push(
    video
  )


  video.preload =
    'auto'

  video.muted =
    true

  video.playsInline =
    true


  let resolved =
    false


  // ----------------------------------------------------
  // VIDEO LISTO PARA COMENZAR A REPRODUCIR
  // ----------------------------------------------------

  const handleCanPlay =
    () => {

      if (
        resolved
      ) {
        return
      }


      resolved =
        true


      console.log(
        `Video prioritario listo: ${url}`
      )


      loadingManager.complete(
        url
      )

    }


  // ----------------------------------------------------
  // ERROR
  // ----------------------------------------------------

  const handleError =
    (error) => {

      if (
        resolved
      ) {
        return
      }


      resolved =
        true


      console.error(
        `Error cargando video prioritario ${url}:`,
        error
      )


      loadingManager.fail(
        url,
        error
      )

    }


  video.addEventListener(
    'canplay',
    handleCanPlay,
    {
      once: true
    }
  )


  video.addEventListener(
    'error',
    handleError,
    {
      once: true
    }
  )


  video.src =
    url


  video.load()

}


// ======================================================
// INICIAR PRECARGA
// ======================================================

function preloadCriticalMedia() {

  CRITICAL_MEDIA.forEach(
    (resource) => {

      if (
        resource.type ===
        'video'
      ) {

        preloadVideo(
          resource.url
        )

        return
      }


      preloadImage(
        resource.url
      )

    }
  )

}


// ======================================================
// EXPORT
// ======================================================

export {
  CRITICAL_MEDIA,
  preloadCriticalMedia
}