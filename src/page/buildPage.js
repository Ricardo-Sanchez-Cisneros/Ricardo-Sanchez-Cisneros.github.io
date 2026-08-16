// ======================================================
// SECCIONES HTML
// ======================================================

import intro from '../html/intro.html?raw'
import hvac from '../html/hvac.html?raw'
import aseptic from '../html/aseptic.html?raw'
import thermal from '../html/thermal.html?raw'
import digital from '../html/digital.html?raw'
import contact from '../html/contact.html?raw'


// ======================================================
// CONSTRUIR PÁGINA
// ======================================================

function buildPage() {

  const app =
    document.querySelector('#app')


  if (!app) {

    throw new Error(
      'No se encontró el contenedor #app'
    )

  }


  app.innerHTML = `
    ${intro}
    ${hvac}
    ${aseptic}
    ${thermal}
    ${digital}
    ${contact}
  `

}


// ======================================================
// EXPORT
// ======================================================

export {
  buildPage
}