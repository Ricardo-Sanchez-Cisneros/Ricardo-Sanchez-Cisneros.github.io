// ======================================================
// LOADING MANAGER
// Control central de recursos críticos del portafolio.
// ======================================================

class PortfolioLoadingManager {

  constructor() {

    this.resources =
      new Map()

    this.progressCallbacks =
      new Set()

    this.readyCallbacks =
      new Set()

    this.ready =
      false

  }


  // ====================================================
  // REGISTRAR RECURSO CRÍTICO
  // ====================================================

  register(
    id,
    weight = 1
  ) {

    if (
      this.resources.has(id)
    ) {
      return
    }

    this.resources.set(
      id,
      {
        id,
        weight,
        status: 'loading'
      }
    )

    this.emitProgress()

  }


  // ====================================================
  // RECURSO COMPLETADO
  // ====================================================

  complete(
    id
  ) {

    const resource =
      this.resources.get(id)

    if (
      !resource ||
      resource.status === 'complete'
    ) {
      return
    }

    resource.status =
      'complete'

    this.emitProgress()

    this.checkReady()

  }


  // ====================================================
  // RECURSO CON ERROR
  //
  // No bloqueamos eternamente la página.
  // El recurso se considera resuelto, pero mostramos
  // el error en consola.
  // ====================================================

  fail(
    id,
    error
  ) {

    const resource =
      this.resources.get(id)

    if (
      !resource
    ) {
      return
    }

    resource.status =
      'failed'

    console.error(
      `Error cargando recurso crítico: ${id}`,
      error
    )

    this.emitProgress()

    this.checkReady()

  }


  // ====================================================
  // CALCULAR PROGRESO
  // ====================================================

  getProgress() {

    let totalWeight =
      0

    let completedWeight =
      0


    this.resources.forEach(
      (resource) => {

        totalWeight +=
          resource.weight

        if (
          resource.status === 'complete' ||
          resource.status === 'failed'
        ) {

          completedWeight +=
            resource.weight

        }

      }
    )


    if (
      totalWeight === 0
    ) {
      return 0
    }


    return Math.round(
      (
        completedWeight /
        totalWeight
      ) *
      100
    )

  }


  // ====================================================
  // SABER SI TODO ESTÁ LISTO
  // ====================================================

  isReady() {

    if (
      this.resources.size === 0
    ) {
      return false
    }


    return [
      ...this.resources.values()
    ].every(
      (resource) =>
        resource.status === 'complete' ||
        resource.status === 'failed'
    )

  }


  // ====================================================
  // CALLBACK DE PROGRESO
  // ====================================================

  onProgress(
    callback
  ) {

    this.progressCallbacks.add(
      callback
    )

    callback(
      this.getProgress()
    )


    return () => {

      this.progressCallbacks.delete(
        callback
      )

    }

  }


  // ====================================================
  // CALLBACK AL TERMINAR
  // ====================================================

  onReady(
    callback
  ) {

    if (
      this.ready
    ) {

      callback()

      return () => {}

    }


    this.readyCallbacks.add(
      callback
    )


    return () => {

      this.readyCallbacks.delete(
        callback
      )

    }

  }


  // ====================================================
  // EMITIR PROGRESO
  // ====================================================

  emitProgress() {

    const progress =
      this.getProgress()


    this.progressCallbacks.forEach(
      (callback) => {

        callback(
          progress
        )

      }
    )

  }


  // ====================================================
  // COMPROBAR FINALIZACIÓN
  // ====================================================

  checkReady() {

    if (
      this.ready ||
      !this.isReady()
    ) {
      return
    }


    this.ready =
      true


    this.readyCallbacks.forEach(
      (callback) => {

        callback()

      }
    )


    this.readyCallbacks.clear()

  }

}


// ======================================================
// INSTANCIA ÚNICA PARA TODO EL PORTAFOLIO
// ======================================================

const loadingManager =
  new PortfolioLoadingManager()


// ======================================================
// EXPORT
// ======================================================

export {
  loadingManager
}
