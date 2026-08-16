import './style.css'

// ======================================================
// CONSTRUCCIÓN DE LA PÁGINA
// ======================================================

import {
  buildPage
} from './page/buildPage.js'

buildPage()


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