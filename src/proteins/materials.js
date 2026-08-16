import * as THREE from 'three'

// ======================================================
// MATERIAL — SUPERFICIE EXTERNA
// ======================================================

function createSurfaceMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#c7cada'),

    metalness:
      0,

    roughness:
      0.38,

    transmission:
      0.08,

    thickness:
      0.35,

    ior:
      1.38,

    attenuationColor:
      new THREE.Color('#ffd9df'),

    attenuationDistance:
      2.5,

    clearcoat:
      0.65,

    clearcoatRoughness:
      0.18,

    specularIntensity:
      1.4,

    specularColor:
      new THREE.Color('#e8f2ff'),

    transparent:
      false,

    opacity:
      1.0,

    depthWrite:
      true,

    depthTest:
      true

  })
}


// ======================================================
// MATERIAL — HÉLICES / CARTOON
// ======================================================

function createHelixMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#c96f8a'),

    metalness:
      0,

    roughness:
      0.34,

    clearcoat:
      0.30,

    clearcoatRoughness:
      0.22,

    specularIntensity:
      0.65,

    specularColor:
      new THREE.Color('#ffd6df')

  })
}


// ======================================================
// MATERIAL — ESTRUCTURA MOLECULAR INTERNA
// moleculas_Sup1
// moleculas_Sup2
// moleculas_Sup_2
// ======================================================

function createMolecularStructureMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#4a4f5a'),

    metalness:
      0.05,

    roughness:
      0.30,

    clearcoat:
      0.25,

    clearcoatRoughness:
      0.20,

    specularIntensity:
      0.65

  })
}


// ======================================================
// MATERIAL — OXÍGENO
// ======================================================

function createOxygenMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#c94f5d'),

    roughness:
      0.28,

    metalness:
      0,

    clearcoat:
      0.45,

    clearcoatRoughness:
      0.12

  })
}


// ======================================================
// MATERIAL — NITRÓGENO
// ======================================================

function createNitrogenMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#456fc4'),

    roughness:
      0.28,

    metalness:
      0,

    clearcoat:
      0.45,

    clearcoatRoughness:
      0.12

  })
}


// ======================================================
// MATERIAL — HIERRO
// ======================================================

function createIronMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#9b6647'),

    roughness:
      0.32,

    metalness:
      0.35,

    clearcoat:
      0.20

  })
}


// ======================================================
// MATERIAL — ENLACE ORGANOMETÁLICO Fe
// ======================================================

function createIronBondMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#5ea8ff'),

    emissive:
      new THREE.Color('#2f7fff'),

    emissiveIntensity:
      2.2,

    roughness:
      0.18,

    metalness:
      0.15,

    clearcoat:
      0.65,

    clearcoatRoughness:
      0.10

  })
}


// ======================================================
// MATERIAL — CARBONOS DEL GRUPO HEMO
// mesh: hemoglobina
// ======================================================

function createHemeCarbonMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#34343a'),

    roughness:
      0.32,

    metalness:
      0,

    clearcoat:
      0.35,

    clearcoatRoughness:
      0.16

  })
}


// ======================================================
// MATERIAL — PUENTES DE HIDRÓGENO
// ======================================================

function createHydrogenBondMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      new THREE.Color('#6aa8ff'),

    emissive:
      new THREE.Color('#3f7fff'),

    emissiveIntensity:
      1.4,

    roughness:
      0.20,

    metalness:
      0,

    clearcoat:
      0.45,

    clearcoatRoughness:
      0.12

  })
}


// ======================================================
// LUZ LOCAL — ÁTOMO DE HIERRO
// ======================================================

function addIronGlow(
  child
) {

  const hemeGlow =
    new THREE.PointLight(
      0x3f8cff,
      0.7,
      1.8,
      2
    )

  hemeGlow.position.set(
    0,
    0,
    0
  )

  child.add(
    hemeGlow
  )
}

// ======================================================
// LUZ LOCAL — PUENTES DE HIDRÓGENO
// ======================================================

function addHydrogenBondGlow(
  child
) {

  const hydrogenGlow =
    new THREE.PointLight(
      0x4f8dff,
      1.3,
      2.0,
      2
    )

  child.geometry.computeBoundingBox()

  const center =
    child.geometry.boundingBox.getCenter(
      new THREE.Vector3()
    )

  hydrogenGlow.position.copy(
    center
  )

  child.add(
    hydrogenGlow
  )
}


// ======================================================
// APLICAR MATERIAL SEGÚN NOMBRE DEL MESH
// ======================================================

function applyProteinMaterial(
  child,
  protein
) {

  if (!child.isMesh) {
    return
  }

  const name =
    child.name.toLowerCase()


  // ====================================================
  // 1. SUPERFICIE EXTERNA
  // ====================================================

  if (
    name.includes('superficie')
  ) {

    child.material =
      createSurfaceMaterial()

    protein.surfaces.push(
      child
    )

    return
  }


  // ====================================================
  // 2. MOLÉCULAS INTERNAS
  //
  // Soportamos los nombres presentes actualmente
  // tanto en hemoglobina como en histona.
  // ====================================================

  if (
    name.includes('moleculas_sup1') ||
    name.includes('moleculas_sup2') ||
    name.includes('moleculas_sup_2')
  ) {

    child.material =
      createMolecularStructureMaterial()

    return
  }


  // ====================================================
  // 3. HÉLICES / CARTOON
  // ====================================================

  if (
    name.includes('helices')
  ) {

    child.material =
      createHelixMaterial()

    return
  }

  // ====================================================
  // 5. ENLACE ORGANOMETÁLICO
  // ====================================================

  if (
    name.includes('enlace_hierro')
  ) {

    child.material =
      createIronBondMaterial()

    return
  }


  // ====================================================
  // 6. OXÍGENO
  // ====================================================

  if (
    name.includes('oxigeno')
  ) {

    child.material =
      createOxygenMaterial()

    return
  }


  // ====================================================
  // 7. NITRÓGENO
  // ====================================================

  if (
    name.includes('nitrogeno')
  ) {

    child.material =
      createNitrogenMaterial()

    return
  }


  // ====================================================
  // 8. ÁTOMOS DE HIERRO
  // hierro_1 / hierro_2
  // ====================================================

  if (
    name.startsWith('hierro_')
  ) {

    child.material =
      createIronMaterial()

    addIronGlow(
      child
    )

    console.log(
      'Hierro detectado:',
      child.name
    )

    return
  }


  // ====================================================
  // 9. CARBONOS DEL GRUPO HEMO
  // ====================================================

  if (
    name === 'hemoglobina'
  ) {

    child.material =
      createHemeCarbonMaterial()

    return
  }


  // ====================================================
  // RESTO
  // ====================================================

  /*
    Los objetos no identificados conservan
    el material exportado desde Blender.
  */

}


// ======================================================
// EXPORTS
// ======================================================

export {
  applyProteinMaterial,
  createSurfaceMaterial,
  createHelixMaterial,
  createMolecularStructureMaterial,
  createOxygenMaterial,
  createNitrogenMaterial,
  createIronMaterial,
  createIronBondMaterial,
  createHemeCarbonMaterial,
  createHydrogenBondMaterial
}