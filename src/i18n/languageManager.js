import {
  translations
} from './translations.js'


// ======================================================
// CONFIGURACIÓN
// ======================================================

const SUPPORTED_LANGUAGES = [
  'es',
  'en'
]

const DEFAULT_LANGUAGE =
  'es'

const STORAGE_KEY =
  'portfolio-language'


// ======================================================
// ESTADO ACTUAL
// ======================================================

let currentLanguage =
  DEFAULT_LANGUAGE


// ======================================================
// VALIDAR IDIOMA
// ======================================================

function isValidLanguage(
  language
) {

  return SUPPORTED_LANGUAGES.includes(
    language
  )

}


// ======================================================
// LEER IDIOMA GUARDADO
// ======================================================

function getStoredLanguage() {

  try {

    const storedLanguage =
      localStorage.getItem(
        STORAGE_KEY
      )


    if (
      isValidLanguage(
        storedLanguage
      )
    ) {

      return storedLanguage

    }

  } catch (
    error
  ) {

    console.warn(
      'No se pudo leer el idioma guardado:',
      error
    )

  }


  return null

}


// ======================================================
// GUARDAR IDIOMA
// ======================================================

function storeLanguage(
  language
) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      language
    )

  } catch (
    error
  ) {

    console.warn(
      'No se pudo guardar el idioma:',
      error
    )

  }

}


// ======================================================
// OBTENER TRADUCCIÓN
// ======================================================

function t(
  key,
  language = currentLanguage
) {

  const languageDictionary =
    translations[
      language
    ]


  if (
    !languageDictionary
  ) {

    return key

  }


  const value =
    languageDictionary[
      key
    ]


  if (
    value === undefined
  ) {

    console.warn(
      `Traducción no encontrada: ${language}.${key}`
    )


    return (
      translations[
        DEFAULT_LANGUAGE
      ]?.[
        key
      ] ||
      key
    )

  }


  return value

}


// ======================================================
// TRADUCIR TEXTO NORMAL
// ======================================================

function translateTextNodes(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset.i18n


      if (
        !key
      ) {
        return
      }


      element.textContent =
        t(
          key
        )

    }
  )

}


// ======================================================
// TRADUCIR ARIA-LABEL
// ======================================================

function translateAriaLabels(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-aria-label]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset
          .i18nAriaLabel


      if (
        !key
      ) {
        return
      }


      element.setAttribute(
        'aria-label',
        t(
          key
        )
      )

    }
  )

}


// ======================================================
// TRADUCIR ALT
// ======================================================

function translateAltAttributes(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-alt]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset.i18nAlt


      if (
        !key
      ) {
        return
      }


      element.setAttribute(
        'alt',
        t(
          key
        )
      )

    }
  )

}


// ======================================================
// TRADUCIR TITLE
// ======================================================

function translateTitleAttributes(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-title]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset.i18nTitle


      if (
        !key
      ) {
        return
      }


      element.setAttribute(
        'title',
        t(
          key
        )
      )

    }
  )

}


// ======================================================
// TRADUCIR PLACEHOLDER
// ======================================================

function translatePlaceholders(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-placeholder]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset
          .i18nPlaceholder


      if (
        !key
      ) {
        return
      }


      element.setAttribute(
        'placeholder',
        t(
          key
        )
      )

    }
  )

}


// ======================================================
// TRADUCIR DATA-MEDIA-TITLE
// ======================================================

function translateMediaTitles(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-media-title]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset
          .i18nMediaTitle


      if (
        !key
      ) {
        return
      }


      element.dataset.mediaTitle =
        t(
          key
        )

    }
  )

}


// ======================================================
// TRADUCIR DATA-MEDIA-DESCRIPTION
// ======================================================

function translateMediaDescriptions(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-media-description]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset
          .i18nMediaDescription


      if (
        !key
      ) {
        return
      }


      element.dataset.mediaDescription =
        t(
          key
        )

    }
  )

}


// ======================================================
// TRADUCIR DATA-MEDIA-ALT
// ======================================================

function translateMediaAlt(
  root
) {

  const elements = [
    ...root.querySelectorAll(
      '[data-i18n-media-alt]'
    )
  ]


  elements.forEach(
    (element) => {

      const key =
        element.dataset
          .i18nMediaAlt


      if (
        !key
      ) {
        return
      }


      element.dataset.mediaAlt =
        t(
          key
        )

    }
  )

}


// ======================================================
// METADATOS DEL DOCUMENTO
// ======================================================

function translateMetadata() {

  document.title =
    t(
      'meta.title'
    )


  const description =
    document.querySelector(
      'meta[name="description"]'
    )


  if (
    description
  ) {

    description.setAttribute(
      'content',
      t(
        'meta.description'
      )
    )

  }

}


// ======================================================
// IDIOMA DEL DOCUMENTO HTML
// ======================================================

function updateDocumentLanguage() {

  document.documentElement.lang =
    currentLanguage

}


// ======================================================
// APLICAR TODAS LAS TRADUCCIONES
// ======================================================

function applyTranslations(
  root = document
) {

  translateTextNodes(
    root
  )


  translateAriaLabels(
    root
  )


  translateAltAttributes(
    root
  )


  translateTitleAttributes(
    root
  )


  translatePlaceholders(
    root
  )


  translateMediaTitles(
    root
  )


  translateMediaDescriptions(
    root
  )


  translateMediaAlt(
    root
  )


  translateMetadata()


  updateDocumentLanguage()

}


// ======================================================
// EVENTO DE CAMBIO DE IDIOMA
// ======================================================

function emitLanguageChange() {

  window.dispatchEvent(
    new CustomEvent(
      'portfolio:languagechange',
      {
        detail: {
          language:
            currentLanguage
        }
      }
    )
  )

}


// ======================================================
// ESTABLECER IDIOMA
// ======================================================

function setLanguage(
  language,
  {
    persist = true,
    emit = true
  } = {}
) {

  if (
    !isValidLanguage(
      language
    )
  ) {

    console.warn(
      `Idioma no soportado: ${language}`
    )


    return false

  }


  currentLanguage =
    language


  if (
    persist
  ) {

    storeLanguage(
      language
    )

  }


  applyTranslations()


  if (
    emit
  ) {

    emitLanguageChange()

  }


  return true

}


// ======================================================
// ALTERNAR ES / EN
// ======================================================

function toggleLanguage() {

  const nextLanguage =
    currentLanguage ===
      'es'
      ? 'en'
      : 'es'


  setLanguage(
    nextLanguage
  )


  return nextLanguage

}


// ======================================================
// OBTENER IDIOMA ACTUAL
// ======================================================

function getCurrentLanguage() {

  return currentLanguage

}


// ======================================================
// INICIALIZAR
// ======================================================

function setupLanguageManager() {

  const storedLanguage =
    getStoredLanguage()


  currentLanguage =
    storedLanguage ||
    DEFAULT_LANGUAGE


  applyTranslations()


  return {

    language:
      currentLanguage,

    setLanguage,

    toggleLanguage,

    getCurrentLanguage,

    t

  }

}


// ======================================================
// EXPORT
// ======================================================

export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  setupLanguageManager,
  setLanguage,
  toggleLanguage,
  getCurrentLanguage,
  applyTranslations,
  t
}