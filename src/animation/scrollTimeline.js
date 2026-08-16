import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)


// ======================================================
// CONTROL DE VIDEO DEL PANEL
// ======================================================

function playPanelMedia(
  panelSelector
) {

  const video =
    document.querySelector(
      `${panelSelector} video[data-active-media="true"]`
    )

  if (
    video instanceof HTMLVideoElement
  ) {

    video
      .play()
      .catch(
        () => {}
      )

  }

}


function pausePanelMedia(
  panelSelector
) {

  const video =
    document.querySelector(
      `${panelSelector} video[data-active-media="true"]`
    )

  if (
    video instanceof HTMLVideoElement
  ) {

    video.pause()

  }

}


// ======================================================
// SECUENCIA DE UNA PROTEÍNA
// ======================================================

function addProteinSequence(
  timeline,
  {
    protein,
    textSelector,
    panelSelector = null
  }
) {

  // ====================================================
  // PROTEÍNA ENTRA
  // ====================================================

  timeline.to(

    protein.positionGroup.position,

    {
      y: 0,

      duration: 1.25,

      ease: 'power2.out'
    },

    '-=0.2'

  )


  // ====================================================
  // PROTEÍNA SE DESPLAZA A LA IZQUIERDA
  // ====================================================

  timeline.to(

    protein.positionGroup.position,

    {
      x: -1.6,

      duration: 1.2,

      ease: 'power1.inOut'
    }

  )


  // ====================================================
  // TEXTO ENTRA
  // ====================================================

  timeline.to(

    textSelector,

    {
      opacity: 1,

      x: 0,

      y: 0,

      duration: 0.9,

      ease: 'power2.out'
    },

    '-=0.7'

  )


  // ====================================================
  // PERMANENCIA DEL TEXTO
  // ====================================================

  timeline.to(
    {},
    {
      duration: 1.6
    }
  )


  // ====================================================
  // TEXTO SALE
  // ====================================================

  timeline.to(

    textSelector,

    {
      opacity: 0,

      y: -30,

      duration: 0.7,

      ease: 'power2.in'
    }

  )


  // ====================================================
  // PANEL MULTIMEDIA
  // ====================================================

  if (panelSelector) {

    // Proteína regresa parcialmente hacia el centro
    timeline.to(

      protein.positionGroup.position,

      {
        x: -0.6,

        duration: 0.8,

        ease: 'power1.inOut'
      },

      '-=0.2'

    )


    // Panel aparece
    timeline.to(

      panelSelector,

      {
        autoAlpha: 1,

        duration: 0.8,

        ease: 'power2.out',

        onStart: () => {

          playPanelMedia(
            panelSelector
          )

        }
      }

    )


    // Permanencia del panel
    timeline.to(
      {},
      {
        duration: 2.2
      }
    )


    // Panel desaparece
    timeline.to(

      panelSelector,

      {
        autoAlpha: 0,

        duration: 0.7,

        ease: 'power2.in',

        onComplete: () => {

          pausePanelMedia(
            panelSelector
          )

        }
      }

    )

  }


  // ====================================================
  // PROTEÍNA SALE HACIA ARRIBA
  // ====================================================

  timeline.to(

    protein.positionGroup.position,

    {
      y: 6,

      duration: 1.2,

      ease: 'power2.in'
    },

    '-=0.25'

  )

}


// ======================================================
// CREAR TIMELINE PRINCIPAL
// ======================================================

function createScrollTimeline({
  hemoglobin,
  histone,
  cyc2,
  imipenem
}) {

  // ====================================================
  // PORTADA
  // ====================================================

  gsap.set(
    '.intro-content',
    {
      opacity: 1,

      x: 0,

      y: 0
    }
  )


  // ====================================================
  // TEXTOS
  // ====================================================

  gsap.set(
    [
      '.text-hemoglobin',
      '.text-histone',
      '.text-cyc2',
      '.text-imipenem'
    ],
    {
      opacity: 0,

      x: 80,

      y: 0,

      yPercent: -50
    }
  )


  // ====================================================
  // PANELES MULTIMEDIA
  // ====================================================

  gsap.set(
    '.glass-panel--media',
    {
      autoAlpha: 0
    }
  )


  // ====================================================
  // CONTACTO
  // ====================================================

  gsap.set(
    '.contact-panel',
    {
      opacity: 0,

      y: 60
    }
  )


  // ====================================================
  // TIMELINE MAESTRA
  // ====================================================

  const masterTimeline =
  gsap.timeline({

    scrollTrigger: {

      trigger:
        '.content',

      start:
        'top top',

      endTrigger:
        '.section-cyc2',

      end:
        'bottom bottom',

      scrub:
        1

    }

  })
  // ====================================================
  // 00 — PORTADA SALE
  // ====================================================

  masterTimeline.to(

    '.intro-content',

    {
      opacity: 0,

      y: -50,

      duration: 0.9,

      ease: 'power2.in'
    }

  )


  masterTimeline.to(
    {},
    {
      duration: 0.25
    }
  )


  // ====================================================
  // 01 — HEMOGLOBINA + HVAC
  // ====================================================

  addProteinSequence(
    masterTimeline,
    {
      protein:
        hemoglobin,

      textSelector:
        '.text-hemoglobin',

      panelSelector:
        '.hvac-media-panel'
    }
  )


  // ====================================================
// 02 — HISTONA + ASEPTIC
// ====================================================

addProteinSequence(
  masterTimeline,
  {
    protein:
      histone,

    textSelector:
      '.text-histone',

    panelSelector:
      '.aseptic-media-panel'
  }
)


 // ====================================================
// 03 — CYC2 + THERMAL
// ====================================================

addProteinSequence(
  masterTimeline,
  {
    protein:
      cyc2,

    textSelector:
      '.text-imipenem',

    panelSelector:
      '.thermal-media-panel'
  }
)


// ====================================================
// 04 — IMIPENEM + DIGITAL
// ====================================================

addProteinSequence(
  masterTimeline,
  {
    protein:
      imipenem,

    textSelector:
      '.text-cyc2',

    panelSelector:
      '.digital-media-panel'
  }
)

  // ====================================================
  // 05 — CONTACTO
  // ====================================================

  ScrollTrigger.create({

    trigger:
      '.contact-section',

    start:
      'top 75%',

    onEnter: () => {

      gsap.to(
        '.contact-panel',
        {
          opacity: 1,

          y: 0,

          duration: 0.9,

          ease: 'power2.out'
        }
      )

    },

    onLeaveBack: () => {

      gsap.to(
        '.contact-panel',
        {
          opacity: 0,

          y: 60,

          duration: 0.45,

          ease: 'power2.in'
        }
      )

    }

  })


  return masterTimeline

}


// ======================================================
// EXPORT
// ======================================================

export {
  createScrollTimeline
}