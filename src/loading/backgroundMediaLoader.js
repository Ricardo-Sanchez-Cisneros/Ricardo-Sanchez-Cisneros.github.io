import {
  preloadMedia
} from './progressiveMedia.js'

import {
  CRITICAL_MEDIA
} from './criticalMedia.js'


// ======================================================
// PRECARGA GLOBAL DE EVIDENCIAS EN SEGUNDO PLANO
// ======================================================
//
// OBJETIVO
//
// 1. El loader inicial espera únicamente recursos críticos.
// 2. Cuando el sitio queda disponible, comienza la descarga
//    automática del resto de las evidencias.
// 3. No depende del scroll.
// 4. No depende de clicks.
// 5. Se utilizan como máximo 2 descargas simultáneas.
// 6. Los videos se descargan completamente mediante fetch.
// 7. Las imágenes críticas ya cargadas no se repiten.
// 8. Los videos críticos se terminan de descargar al final.
// ======================================================


// ======================================================
// CONFIGURACIÓN
// ======================================================

const DEFAULT_CONCURRENCY =
  2

const MEDIA_SELECTOR =
  '[data-media-item]'

const VIDEO_PATTERN =
  /\.(mp4|webm|mov)$/i


// ======================================================
// RECURSOS CRÍTICOS
// ======================================================
//
// Las imágenes críticas ya están completamente cargadas
// cuando ocurre image.onload.
//
// Los videos críticos solamente alcanzaron "canplay"
// durante el loader inicial, por lo que todavía queremos
// garantizar posteriormente su descarga completa.
// ======================================================

const CRITICAL_IMAGE_URLS =
  new Set(
    CRITICAL_MEDIA
      .filter(
        (resource) =>
          resource.type ===
          'image'
      )
      .map(
        (resource) =>
          resource.url
      )
  )


const CRITICAL_VIDEO_URLS =
  new Set(
    CRITICAL_MEDIA
      .filter(
        (resource) =>
          resource.type ===
          'video'
      )
      .map(
        (resource) =>
          resource.url
      )
  )


// ======================================================
// ESTADO
// ======================================================

const jobs =
  new Map()


let queue =
  []


let activeCount =
  0


let completedCount =
  0


let failedCount =
  0


let started =
  false


let completionPromise =
  Promise.resolve()


let resolveCompletion =
  null


// ======================================================
// DETECTAR TIPO DE MEDIO
// ======================================================

function getMediaType(
  item,
  src
) {

  const explicitType =
    item.dataset.mediaType


  if (
    explicitType === 'video' ||
    explicitType === 'image'
  ) {

    return explicitType

  }


  return VIDEO_PATTERN.test(
    src
  )
    ? 'video'
    : 'image'

}


// ======================================================
// RECOPILAR TODAS LAS EVIDENCIAS
// ======================================================

function collectMediaJobs(
  root = document
) {

  const elements = [
    ...root.querySelectorAll(
      MEDIA_SELECTOR
    )
  ]


  const normalJobs =
    []


  const criticalVideoJobs =
    []


  const seenSources =
    new Set()


  elements.forEach(
    (item) => {

      const src =
        item.dataset.mediaSrc


      if (
        !src ||
        seenSources.has(
          src
        )
      ) {

        return

      }


      seenSources.add(
        src
      )


      // ================================================
      // IMAGEN CRÍTICA YA CARGADA
      // ================================================

      if (
        CRITICAL_IMAGE_URLS.has(
          src
        )
      ) {

        console.log(
          `[BackgroundLoader] Ya cargada durante loader inicial: ${src}`
        )


        return

      }


      const type =
        getMediaType(
          item,
          src
        )


      const job = {

        src,

        type,

        status:
          'pending',

        loadedBytes:
          0,

        totalBytes:
          0,

        isCriticalVideo:
          CRITICAL_VIDEO_URLS.has(
            src
          )

      }


      // ================================================
      // VIDEO CRÍTICO
      // ================================================
      //
      // Ya puede reproducirse, así que no necesitamos
      // gastar inmediatamente uno de los dos canales.
      //
      // Se añade al final para completar su descarga
      // después de preparar las evidencias pendientes.
      // ================================================

      if (
        job.isCriticalVideo
      ) {

        criticalVideoJobs.push(
          job
        )


        return

      }


      normalJobs.push(
        job
      )

    }
  )


  return [
    ...normalJobs,
    ...criticalVideoJobs
  ]

}


// ======================================================
// EVENTO DE PROGRESO
// ======================================================

function emitProgress() {

  const total =
    jobs.size


  const resolved =
    completedCount +
    failedCount


  const progress =
    total > 0
      ? resolved / total
      : 1


  window.dispatchEvent(
    new CustomEvent(
      'portfolio:backgroundmedia-progress',
      {
        detail: {

          total,

          completed:
            completedCount,

          failed:
            failedCount,

          resolved,

          active:
            activeCount,

          pending:
            queue.length,

          progress

        }
      }
    )
  )

}


// ======================================================
// EVENTO FINAL
// ======================================================

function emitComplete() {

  window.dispatchEvent(
    new CustomEvent(
      'portfolio:backgroundmedia-complete',
      {
        detail:
          getBackgroundMediaStatus()
      }
    )
  )

}


// ======================================================
// CONSUMIR RESPUESTA COMPLETA
// ======================================================
//
// fetch() puede resolver cuando llegan los headers.
//
// Para considerar un video realmente descargado,
// consumimos completamente el body de la respuesta.
// ======================================================

async function consumeResponse(
  response,
  job
) {

  const contentLength =
    Number(
      response.headers.get(
        'content-length'
      )
    )


  if (
    Number.isFinite(
      contentLength
    ) &&
    contentLength > 0
  ) {

    job.totalBytes =
      contentLength

  }


  if (
    !response.body
  ) {

    await response.blob()


    return

  }


  const reader =
    response.body.getReader()


  while (
    true
  ) {

    const {
      done,
      value
    } =
      await reader.read()


    if (
      done
    ) {

      break

    }


    if (
      value
    ) {

      job.loadedBytes +=
        value.byteLength

    }

  }

}


// ======================================================
// DESCARGAR RECURSO
// ======================================================

async function downloadResource(
  job
) {

  const {
    src,
    type
  } =
    job


  job.status =
    'loading'


  console.log(
    `[BackgroundLoader] Descargando: ${src}`
  )


  // ====================================================
  // IMAGEN
  // ====================================================

  if (
    type === 'image'
  ) {

    await preloadMedia(
      src,
      'image'
    )


    return

  }


  // ====================================================
  // VIDEO
  // ====================================================
  //
  // No usamos "canplay" como criterio de finalización.
  //
  // Realizamos un GET y consumimos todo el stream para
  // dejar el recurso completo disponible en caché.
  // ====================================================

  const response =
    await fetch(
      src,
      {
        method:
          'GET',

        cache:
          'force-cache',

        credentials:
          'same-origin'
      }
    )


  if (
    !response.ok
  ) {

    throw new Error(
      `HTTP ${response.status} cargando ${src}`
    )

  }


  await consumeResponse(
    response,
    job
  )

}


// ======================================================
// EJECUTAR TRABAJO
// ======================================================

async function runJob(
  job
) {

  activeCount +=
    1


  emitProgress()


  try {

    await downloadResource(
      job
    )


    job.status =
      'complete'


    completedCount +=
      1


    console.log(
      `[BackgroundLoader] Lista: ${job.src}`
    )

  } catch (
    error
  ) {

    job.status =
      'failed'


    job.error =
      error


    failedCount +=
      1


    console.warn(
      `[BackgroundLoader] No se pudo cargar ${job.src}:`,
      error
    )

  } finally {

    activeCount -=
      1


    emitProgress()


    pumpQueue()

  }

}


// ======================================================
// PROCESAR COLA
// ======================================================

function pumpQueue() {

  while (
    activeCount <
      DEFAULT_CONCURRENCY &&
    queue.length >
      0
  ) {

    const job =
      queue.shift()


    if (
      !job ||
      job.status !==
        'pending'
    ) {

      continue

    }


    runJob(
      job
    )

  }


  // ====================================================
  // TODO TERMINÓ
  // ====================================================

  if (
    started &&
    activeCount === 0 &&
    queue.length === 0
  ) {

    console.log(
      '[BackgroundLoader] Todas las evidencias fueron procesadas.'
    )


    emitComplete()


    if (
      resolveCompletion
    ) {

      resolveCompletion(
        getBackgroundMediaStatus()
      )


      resolveCompletion =
        null

    }

  }

}


// ======================================================
// PRIORIZAR UNA EVIDENCIA
// ======================================================
//
// Si posteriormente conectamos esto con mediaPanels.js,
// un click podrá mover una evidencia pendiente al inicio
// de la cola sin detener las demás descargas.
// ======================================================

function prioritizeBackgroundMedia(
  src
) {

  if (
    !src
  ) {

    return

  }


  const job =
    jobs.get(
      src
    )


  if (
    !job ||
    job.status !==
      'pending'
  ) {

    return

  }


  const index =
    queue.indexOf(
      job
    )


  if (
    index === -1
  ) {

    return

  }


  queue.splice(
    index,
    1
  )


  queue.unshift(
    job
  )


  console.log(
    `[BackgroundLoader] Prioridad: ${src}`
  )


  pumpQueue()

}


// ======================================================
// OBTENER ESTADO
// ======================================================

function getBackgroundMediaStatus() {

  const total =
    jobs.size


  const resolved =
    completedCount +
    failedCount


  return {

    started,

    total,

    completed:
      completedCount,

    failed:
      failedCount,

    resolved,

    active:
      activeCount,

    pending:
      queue.length,

    progress:
      total > 0
        ? resolved / total
        : 1

  }

}


// ======================================================
// INICIAR PRECARGA GLOBAL
// ======================================================

function startBackgroundMediaLoader(
  {
    root = document
  } = {}
) {

  if (
    started
  ) {

    return completionPromise

  }


  started =
    true


  const collectedJobs =
    collectMediaJobs(
      root
    )


  collectedJobs.forEach(
    (job) => {

      jobs.set(
        job.src,
        job
      )

    }
  )


  queue = [
    ...collectedJobs
  ]


  completionPromise =
    new Promise(
      (resolve) => {

        resolveCompletion =
          resolve

      }
    )


  console.log(
    `[BackgroundLoader] Iniciando precarga de ${jobs.size} evidencias.`
  )


  emitProgress()


  // ====================================================
  // NO HAY NADA PENDIENTE
  // ====================================================

  if (
    queue.length === 0
  ) {

    console.log(
      '[BackgroundLoader] No hay evidencias pendientes.'
    )


    emitComplete()


    resolveCompletion(
      getBackgroundMediaStatus()
    )


    resolveCompletion =
      null


    return completionPromise

  }


  pumpQueue()


  return completionPromise

}


// ======================================================
// EXPORT
// ======================================================

export {
  startBackgroundMediaLoader,
  prioritizeBackgroundMedia,
  getBackgroundMediaStatus
}