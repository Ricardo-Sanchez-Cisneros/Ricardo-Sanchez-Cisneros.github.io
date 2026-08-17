import * as THREE from 'three'

import {
  HDRLoader
} from 'three/addons/loaders/HDRLoader.js'

import {
  loadingManager
} from '../loading/loadingManager.js'


// ======================================================
// CONFIGURAR ENTORNO HDR + ILUMINACIÓN
// ======================================================

function setupEnvironment(scene) {

  // ====================================================
  // ENTORNO HDR
  // ====================================================

  const hdrLoader =
    new HDRLoader()


  hdrLoader.load(

    '/hdr/studio_small_08_1k.hdr',

    // ==================================================
    // CARGA CORRECTA
    // ==================================================

    (environmentMap) => {

      environmentMap.mapping =
        THREE.EquirectangularReflectionMapping


      // El HDR ilumina y se refleja
      // en los materiales PBR.

      scene.environment =
        environmentMap


      scene.environmentRotation.y =
        THREE.MathUtils.degToRad(
          35
        )


      // Intensidad actual que ya dejamos estable.

      scene.environmentIntensity =
        0.28


      console.log(
        'HDR environment cargado'
      )


      // Informamos al sistema de carga
      // que el HDR está listo.

      loadingManager.complete(
        '/hdr/studio_small_08_1k.hdr'
      )

    },


    // ==================================================
    // PROGRESO
    // ==================================================

    undefined,


    // ==================================================
    // ERROR
    // ==================================================

    (error) => {

      console.error(
        'Error cargando HDR:',
        error
      )


      loadingManager.fail(
        '/hdr/studio_small_08_1k.hdr',
        error
      )

    }

  )


  // ====================================================
  // ILUMINACIÓN PBR / ESTUDIO
  // ====================================================


  // ----------------------------------------------------
  // AMBIENTE MÍNIMO
  // ----------------------------------------------------

  const ambientLight =
    new THREE.HemisphereLight(
      0xa6bac8,
      0x080b12,
      0.22
    )


  scene.add(
    ambientLight
  )


  // ----------------------------------------------------
  // KEY LIGHT
  // Luz frontal-lateral principal.
  // ----------------------------------------------------

  const keyLight =
    new THREE.RectAreaLight(
      0xe5efff,
      2.4,
      5,
      5
    )


  keyLight.position.set(
    3.5,
    3,
    5
  )


  keyLight.lookAt(
    0,
    0,
    0
  )


  scene.add(
    keyLight
  )


  // ----------------------------------------------------
  // FILL LIGHT
  // Recupera suavemente sombras del lado izquierdo.
  // ----------------------------------------------------

  const fillLight =
    new THREE.RectAreaLight(
      0xaac8e8,
      1.5,
      4,
      4
    )


  fillLight.position.set(
    -4,
    0,
    3
  )


  fillLight.lookAt(
    0,
    0,
    0
  )


  scene.add(
    fillLight
  )


  // ----------------------------------------------------
  // RIM AZUL
  // ----------------------------------------------------

  const rimBlue =
    new THREE.RectAreaLight(
      0x6caeff,
      1.2,
      3,
      4
    )


  rimBlue.position.set(
    -3,
    3,
    -3
  )


  rimBlue.lookAt(
    0,
    0,
    0
  )


  scene.add(
    rimBlue
  )


  // ----------------------------------------------------
  // RIM LAVANDA
  // ----------------------------------------------------

  const rimLavender =
    new THREE.RectAreaLight(
      0xa88cff,
      1.0,
      3,
      3
    )


  rimLavender.position.set(
    3,
    -1,
    -3
  )


  rimLavender.lookAt(
    0,
    0,
    0
  )


  scene.add(
    rimLavender
  )


  // ====================================================
  // RETORNO
  // ====================================================

  return {

    ambientLight,

    keyLight,

    fillLight,

    rimBlue,

    rimLavender

  }

}


// ======================================================
// EXPORT
// ======================================================

export {
  setupEnvironment
}