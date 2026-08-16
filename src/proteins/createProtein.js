import * as THREE from 'three'

import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'

import {
  DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js'

import {
  applyProteinMaterial
} from './materials.js'


// ======================================================
// DRACO
// ======================================================

const dracoLoader =
  new DRACOLoader()

dracoLoader.setDecoderPath(
  `${import.meta.env.BASE_URL}draco/`
)


// ======================================================
// LOADER COMPARTIDO
// ======================================================

const loader =
  new GLTFLoader()

loader.setDRACOLoader(
  dracoLoader
)


// ======================================================
// CREAR PROTEÍNA
// ======================================================

function createProtein({
  scene,
  url,
  desiredSize = 4,
  initialY = -6,
  rotationSpeed = 0.3
}) {

  // ====================================================
  // GRUPOS DE TRANSFORMACIÓN
  // ====================================================

  // Grupo exclusivo para posición.
  const positionGroup =
    new THREE.Group()

  // Grupo exclusivo para rotación.
  const rotationGroup =
    new THREE.Group()

  // Grupo exclusivo para escala.
  const scaleGroup =
    new THREE.Group()


  // ====================================================
  // JERARQUÍA
  // ====================================================

  scene.add(
    positionGroup
  )

  positionGroup.add(
    rotationGroup
  )

  rotationGroup.add(
    scaleGroup
  )


  // ====================================================
  // POSICIÓN INICIAL
  // ====================================================

  positionGroup.position.set(
    0,
    initialY,
    0
  )


  // ====================================================
  // OBJETO PÚBLICO DE LA PROTEÍNA
  // ====================================================

  const protein = {

    url,

    positionGroup,

    rotationGroup,

    scaleGroup,

    rotationSpeed,

    loaded:
      false,

    surfaces:
      [],

    model:
      null

  }


  // ====================================================
  // CARGAR MODELO
  // ====================================================

  loader.load(

    url,

    (gltf) => {

      const model =
        gltf.scene

      protein.model =
        model


      // ==================================================
      // MATERIALES
      // ==================================================

      model.traverse(
        (child) => {

          applyProteinMaterial(
            child,
            protein
          )

        }
      )


      // ==================================================
      // AÑADIR MODELO AL GRUPO DE ESCALA
      // ==================================================

      scaleGroup.add(
        model
      )


      // ==================================================
      // ACTUALIZAR MATRICES
      // ==================================================

      model.updateMatrixWorld(
        true
      )


      // ==================================================
      // BOUNDING BOX
      // ==================================================

      const box =
        new THREE.Box3()
          .setFromObject(
            model
          )

      const center =
        box.getCenter(
          new THREE.Vector3()
        )

      const size =
        box.getSize(
          new THREE.Vector3()
        )


      // ==================================================
      // CENTRAR MODELO
      // ==================================================

      model.position.set(
        -center.x,
        -center.y,
        -center.z
      )

      model.updateMatrixWorld(
        true
      )


      // ==================================================
      // NORMALIZAR ESCALA
      // ==================================================

      const maxDimension =
        Math.max(
          size.x,
          size.y,
          size.z
        )

      const scale =
        desiredSize /
        maxDimension

      scaleGroup.scale.setScalar(
        scale
      )


      // ==================================================
      // ESTADO FINAL
      // ==================================================

      protein.loaded =
        true

      console.log(
        `Modelo cargado: ${url}`
      )

    },


    // ====================================================
    // PROGRESO
    // ====================================================

    undefined,


    // ====================================================
    // ERROR
    // ====================================================

    (error) => {

      console.error(
        `Error cargando ${url}:`,
        error
      )

    }

  )


  // ====================================================
  // RETORNO
  // ====================================================

  return protein
}


// ======================================================
// EXPORT
// ======================================================

export {
  createProtein
}