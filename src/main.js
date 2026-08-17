import './style.css'

import {
  setupLoadingScreen
} from './loading/loadingScreen.js'

import {
  loadingManager
} from './loading/loadingManager.js'

import {
  preloadCriticalMedia
} from './loading/criticalMedia.js'

import {
  preloadMedia
} from './loading/progressiveMedia.js'

import {
  setupScrollHint
} from './loading/scrollHint.js'

import {
  setupOrientationGuard
} from './loading/orientationGuard.js'

import {
  setupLanguageManager
} from './i18n/languageManager.js'

import {
  setupLanguageSwitch
} from './i18n/languageSwitch.js'


setupLoadingScreen()
setupOrientationGuard()
setupScrollHint()

const CRITICAL_RESOURCES = [

  '/hdr/studio_small_08_1k.hdr',

  '/models/hemoglobina.glb',
  '/models/histona.glb',
  '/models/cyc2.glb',
  '/models/imipenem.glb',

  '/media/hvac/integridad_filtro_cabina.mp4',

  '/media/aseptic/areas_asepticas.webp',

  '/media/thermal/perfil_termico.png',

  '/media/digital/powerbi1.mp4'

]


CRITICAL_RESOURCES.forEach(
  (resource) => {

    loadingManager.register(
      resource
    )

  }
)


preloadCriticalMedia()


// ======================================================
// PRECARGA POSTERIOR A LA ENTRADA
// ======================================================

loadingManager.onReady(
  () => {

    preloadMedia(
      '/media/hvac/flujo_vertical_cabina.mp4',
      'video'
    )

  }
)
// ======================================================
// CONSTRUCCIÓN DE LA PÁGINA
// ======================================================


import {
  buildPage
} from './page/buildPage.js'

buildPage()


// ======================================================
// IDIOMA
// ======================================================

setupLanguageManager()

setupLanguageSwitch()

// ======================================================
// CORE
// ======================================================

import {
  scene,
  camera,
  renderer,
  resizeScene
} from './core/scene.js'

import {
  setupEnvironment
} from './core/environment.js'

import {
  createBackground
} from './core/background.js'

import {
  setupMediaPanels
} from './media/mediaPanels.js'

// ======================================================
// AMBIENTE
// ======================================================

import {
  createAmbientSystem
} from './ambient/particles.js'


// ======================================================
// CONFIGURACIÓN DE PROTEÍNAS
// ======================================================

import {
  PROTEIN_CONFIGS
} from './config/proteins.js'


// ======================================================
// PROTEÍNAS
// ======================================================

import {
  createProtein
} from './proteins/createProtein.js'


// ======================================================
// INTERACCIONES
// ======================================================

import {
  setupProteinHover
} from './interactions/proteinHover.js'

import {
  setupProteinDrag
} from './interactions/proteinDrag.js'


// ======================================================
// ANIMACIÓN
// ======================================================

import {
  createScrollTimeline
} from './animation/scrollTimeline.js'

import {
  startRenderLoop
} from './animation/renderLoop.js'


// ======================================================
// POSTPROCESADO
// ======================================================

import {
  createPostprocessing
} from './postprocessing/postprocessing.js'


// ======================================================
// ENTORNO HDR + ILUMINACIÓN
// ======================================================

setupEnvironment(
  scene
)


// ======================================================
// FONDO ATMOSFÉRICO
// ======================================================

const background =
  createBackground(
    scene,
    camera
  )


// ======================================================
// AMBIENTE CELULAR
// ======================================================

const ambientSystem =
  createAmbientSystem(
    scene
  )


// ======================================================
// POSTPROCESADO
// ======================================================

const postprocessing =
  createPostprocessing({

    renderer,

    scene,

    camera

  })


// ======================================================
// 01 — HEMOGLOBINA
// ======================================================

const hemoglobin =
  createProtein({

    scene,

    ...PROTEIN_CONFIGS.hemoglobin

  })


// ======================================================
// 02 — HISTONA
// ======================================================

const histone =
  createProtein({

    scene,

    ...PROTEIN_CONFIGS.histone

  })


// ======================================================
// 03 — CYC2
// ======================================================

const cyc2 =
  createProtein({

    scene,

    ...PROTEIN_CONFIGS.cyc2

  })


// ======================================================
// 04 — IMIPENEM
// ======================================================

const imipenem =
  createProtein({

    scene,

    ...PROTEIN_CONFIGS.imipenem

  })


// ======================================================
// REGISTRO GENERAL DE PROTEÍNAS
// ======================================================

const proteins = [

  hemoglobin,

  histone,

  cyc2,

  imipenem

]


// ======================================================
// PANELES MULTIMEDIA
// ======================================================

const mediaPanels =
  setupMediaPanels()

// ======================================================
// INTERACCIÓN — HOVER
// ======================================================

setupProteinHover({

  camera,

  proteins

})


// ======================================================
// INTERACCIÓN — DRAG / ROTACIÓN MANUAL
// ======================================================

setupProteinDrag({

  camera,

  renderer,

  proteins

})

// ======================================================
// TIMELINE PRINCIPAL
// ======================================================

const scrollTimeline =
  createScrollTimeline({

    hemoglobin,

    histone,

    cyc2,

    imipenem

  })


// ======================================================
// RENDER LOOP
// ======================================================

startRenderLoop({

  scene,

  camera,

  renderer,

  proteins,

  ambientSystem,

  postprocessing

})


// ======================================================
// RESPONSIVE
// ======================================================

window.addEventListener(
  'resize',
  () => {

    resizeScene()

    background.resize()

    postprocessing.resize()

    if (
      scrollTimeline.scrollTrigger
    ) {

      scrollTimeline.scrollTrigger.refresh()

    }

  }
)


// ======================================================
// REFRESH INICIAL DE SCROLLTRIGGER
// ======================================================

window.addEventListener(
  'load',
  () => {

    if (
      scrollTimeline.scrollTrigger
    ) {

      scrollTimeline.scrollTrigger.refresh()

    }

  }
)