import * as THREE from 'three'


// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================

const FAR_COUNT = 30
const MID_COUNT = 10
const NEAR_COUNT = 2

const BOUNDS = {
  x: 8.8,
  y: 5.4,
  zMin: -6.0,
  zMax: 3.5
}


// ======================================================
// PALETA
// ======================================================

const SHELL_COLORS = [
  0xbfd6e8,
  0xc9def0,
  0xd6e4f2
]

const EDGE_COLORS = [
  0xdce9f5,
  0xe7f0f8,
  0xd8e6f3
]

const CORE_COLORS = [
  0x152436,
  0x132132,
  0x17283a
]


// ======================================================
// UTILIDADES
// ======================================================

function randomBetween(
  min,
  max
) {
  return (
    min +
    Math.random() *
    (max - min)
  )
}


function randomFrom(
  values
) {
  return values[
    Math.floor(
      Math.random() *
      values.length
    )
  ]
}


function randomDirection() {

  const direction =
    new THREE.Vector3(
      randomBetween(-1, 1),
      randomBetween(-1, 1),
      randomBetween(-0.35, 0.35)
    )

  direction.normalize()

  return direction

}


function wrapValue(
  value,
  min,
  max
) {

  if (value > max) {
    return min
  }

  if (value < min) {
    return max
  }

  return value

}


// ======================================================
// GEOMETRÍAS COMPARTIDAS
// ======================================================

function createSharedAssets() {

  const farShellGeometry =
    new THREE.IcosahedronGeometry(1, 0)

  const midShellGeometry =
    new THREE.IcosahedronGeometry(1, 0)

  const nearShellGeometry =
    new THREE.IcosahedronGeometry(1, 1)

  const farEdgesGeometry =
    new THREE.EdgesGeometry(
      farShellGeometry
    )

  const midEdgesGeometry =
    new THREE.EdgesGeometry(
      midShellGeometry
    )

  const nearEdgesGeometry =
    new THREE.EdgesGeometry(
      nearShellGeometry
    )

  const coreGeometry =
    new THREE.IcosahedronGeometry(
      0.82,
      0
    )

  return {
    farShellGeometry,
    midShellGeometry,
    nearShellGeometry,
    farEdgesGeometry,
    midEdgesGeometry,
    nearEdgesGeometry,
    coreGeometry
  }

}


// ======================================================
// CREAR CÁPSIDE / PARTÍCULA
// ======================================================

function createVirion({
  layer,
  sharedAssets
}) {

  const isFar =
    layer === 'far'

  const isNear =
    layer === 'near'


  const shellGeometry =
    isFar
      ? sharedAssets.farShellGeometry
      : isNear
        ? sharedAssets.nearShellGeometry
        : sharedAssets.midShellGeometry

  const edgesGeometry =
    isFar
      ? sharedAssets.farEdgesGeometry
      : isNear
        ? sharedAssets.nearEdgesGeometry
        : sharedAssets.midEdgesGeometry


  const shellOpacity =
    isFar
      ? randomBetween(0.10, 0.16)
      : isNear
        ? randomBetween(0.16, 0.24)
        : randomBetween(0.12, 0.20)

  const edgeOpacity =
    isFar
      ? randomBetween(0.26, 0.38)
      : isNear
        ? randomBetween(0.34, 0.48)
        : randomBetween(0.28, 0.42)

  const coreOpacity =
    isFar
      ? randomBetween(0.03, 0.06)
      : isNear
        ? randomBetween(0.05, 0.08)
        : randomBetween(0.04, 0.07)


  // ====================================================
  // GRUPO
  // ====================================================

  const group =
    new THREE.Group()


  // ====================================================
  // CÁPSIDE EXTERNA
  // ====================================================

  const shellMaterial =
    new THREE.MeshBasicMaterial({

      color:
        randomFrom(
          SHELL_COLORS
        ),

      transparent:
        true,

      opacity:
        shellOpacity,

      depthWrite:
        false,

      side:
        THREE.DoubleSide,

      flatShading:
        true

    })

  const shell =
    new THREE.Mesh(
      shellGeometry,
      shellMaterial
    )

  group.add(shell)


  // ====================================================
  // NÚCLEO INTERNO
  // ====================================================

  const coreMaterial =
    new THREE.MeshBasicMaterial({

      color:
        randomFrom(
          CORE_COLORS
        ),

      transparent:
        true,

      opacity:
        coreOpacity,

      depthWrite:
        false,

      side:
        THREE.DoubleSide

    })

  const core =
    new THREE.Mesh(
      sharedAssets.coreGeometry,
      coreMaterial
    )

  group.add(core)


  // ====================================================
  // ARISTAS
  // ====================================================

  const edgeMaterial =
    new THREE.LineBasicMaterial({

      color:
        randomFrom(
          EDGE_COLORS
        ),

      transparent:
        true,

      opacity:
        edgeOpacity,

      depthWrite:
        false

    })

  const edges =
    new THREE.LineSegments(
      edgesGeometry,
      edgeMaterial
    )

  group.add(edges)


  // ====================================================
  // POSICIÓN
  // ====================================================

  group.position.set(

    randomBetween(
      -BOUNDS.x,
      BOUNDS.x
    ),

    randomBetween(
      -BOUNDS.y,
      BOUNDS.y
    ),

    isFar
      ? randomBetween(
          -5.8,
          -2.2
        )
      : isNear
        ? randomBetween(
            1.2,
            2.6
          )
        : randomBetween(
            -2.0,
            1.0
          )

  )


  // ====================================================
  // ESCALA
  // UNIFORME: elimina el efecto ovalado
  // ====================================================

  const size =
    isFar
      ? randomBetween(
          0.020,
          0.060
        )
      : isNear
        ? randomBetween(
            0.085,
            0.140
          )
        : randomBetween(
            0.045,
            0.095
          )

  group.scale.setScalar(
    size
  )


  // ====================================================
  // ROTACIÓN INICIAL
  // ====================================================

  group.rotation.set(

    randomBetween(
      0,
      Math.PI
    ),

    randomBetween(
      0,
      Math.PI
    ),

    randomBetween(
      0,
      Math.PI
    )

  )


  // ====================================================
  // MOVIMIENTO
  // ====================================================

  const velocity =
    randomDirection()
      .multiplyScalar(

        isFar
          ? randomBetween(
              0.010,
              0.020
            )
          : isNear
            ? randomBetween(
                0.014,
                0.028
              )
            : randomBetween(
                0.012,
                0.024
              )

      )

  const rotationVelocity =
    new THREE.Vector3(

      randomBetween(
        -0.08,
        0.08
      ),

      randomBetween(
        -0.08,
        0.08
      ),

      randomBetween(
        -0.05,
        0.05
      )

    )


  return {

    group,

    velocity,

    rotationVelocity,

    phase:
      randomBetween(
        0,
        Math.PI * 2
      ),

    drift:
      randomBetween(
        0.010,
        0.030
      ),

    disposables: [
      shellMaterial,
      coreMaterial,
      edgeMaterial
    ]

  }

}


// ======================================================
// ACTUALIZAR PARTÍCULA
// ======================================================

function updateVirion(
  virion,
  delta,
  elapsed
) {

  const group =
    virion.group


  // ====================================================
  // MOVIMIENTO BASE
  // ====================================================

  group.position.addScaledVector(
    virion.velocity,
    delta
  )


  // ====================================================
  // DERIVA SUAVE
  // ====================================================

  group.position.x +=
    Math.sin(
      elapsed * 0.22 +
      virion.phase
    ) *
    virion.drift *
    delta

  group.position.y +=
    Math.cos(
      elapsed * 0.18 +
      virion.phase * 1.31
    ) *
    virion.drift *
    delta

  group.position.z +=
    Math.sin(
      elapsed * 0.14 +
      virion.phase * 0.73
    ) *
    virion.drift *
    0.25 *
    delta


  // ====================================================
  // ROTACIÓN
  // ====================================================

  group.rotation.x +=
    virion.rotationVelocity.x *
    delta

  group.rotation.y +=
    virion.rotationVelocity.y *
    delta

  group.rotation.z +=
    virion.rotationVelocity.z *
    delta


  // ====================================================
  // WRAP
  // ====================================================

  group.position.x =
    wrapValue(
      group.position.x,
      -BOUNDS.x,
      BOUNDS.x
    )

  group.position.y =
    wrapValue(
      group.position.y,
      -BOUNDS.y,
      BOUNDS.y
    )

  group.position.z =
    wrapValue(
      group.position.z,
      BOUNDS.zMin,
      BOUNDS.zMax
    )

}


// ======================================================
// SISTEMA AMBIENTAL
// ======================================================

function createAmbientSystem(
  scene
) {

  const particleGroup =
    new THREE.Group()

  particleGroup.name =
    'VirionFieldFar'

  const moleculeGroup =
    new THREE.Group()

  moleculeGroup.name =
    'VirionFieldMidNear'

  scene.add(
    particleGroup
  )

  scene.add(
    moleculeGroup
  )


  const sharedAssets =
    createSharedAssets()

  const particles = []
  const molecules = []


  // ====================================================
  // CAPA LEJANA
  // ====================================================

  for (
    let i = 0;
    i < FAR_COUNT;
    i += 1
  ) {

    const virion =
      createVirion({

        layer:
          'far',

        sharedAssets

      })

    particleGroup.add(
      virion.group
    )

    particles.push(
      virion
    )

  }


  // ====================================================
  // CAPA MEDIA
  // ====================================================

  for (
    let i = 0;
    i < MID_COUNT;
    i += 1
  ) {

    const virion =
      createVirion({

        layer:
          'mid',

        sharedAssets

      })

    moleculeGroup.add(
      virion.group
    )

    molecules.push(
      virion
    )

  }


  // ====================================================
  // CAPA CERCANA
  // ====================================================

  for (
    let i = 0;
    i < NEAR_COUNT;
    i += 1
  ) {

    const virion =
      createVirion({

        layer:
          'near',

        sharedAssets

      })

    moleculeGroup.add(
      virion.group
    )

    molecules.push(
      virion
    )

  }


  // ====================================================
  // UPDATE
  // ====================================================

  function update(
    delta,
    elapsed
  ) {

    for (
      const virion
      of particles
    ) {
      updateVirion(
        virion,
        delta,
        elapsed
      )
    }

    for (
      const virion
      of molecules
    ) {
      updateVirion(
        virion,
        delta,
        elapsed
      )
    }

  }


  // ====================================================
  // DISPOSE
  // ====================================================

  function dispose() {

    for (
      const virion
      of [
        ...particles,
        ...molecules
      ]
    ) {

      for (
        const disposable
        of virion.disposables
      ) {
        disposable.dispose()
      }

    }

    sharedAssets.farShellGeometry.dispose()
    sharedAssets.midShellGeometry.dispose()
    sharedAssets.nearShellGeometry.dispose()

    sharedAssets.farEdgesGeometry.dispose()
    sharedAssets.midEdgesGeometry.dispose()
    sharedAssets.nearEdgesGeometry.dispose()

    sharedAssets.coreGeometry.dispose()

    scene.remove(
      particleGroup
    )

    scene.remove(
      moleculeGroup
    )

  }


  // ====================================================
  // RETORNO
  // ====================================================

  return {

    particleGroup,
    moleculeGroup,

    particles,
    molecules,

    update,
    dispose

  }

}


// ======================================================
// EXPORT
// ======================================================

export {
  createAmbientSystem
}