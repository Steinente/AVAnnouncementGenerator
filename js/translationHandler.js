translateIcon.addEventListener('click', e => {
  e.stopPropagation()
  languageMenu.style.display = languageMenu.style.display === 'block' ? 'none' : 'block'
})

languageMenu.querySelectorAll('a').forEach(langLink => {
  langLink.addEventListener('click', function (e) {
    e.preventDefault()

    const selectedLang = this.getAttribute('data-lang')
    setLocalStorage('selectedLanguage', selectedLang, false)
    applyTranslation(selectedLang)

    generateImage(() => {})

    languageMenu.style.display = 'none'

    e.stopPropagation()
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const savedLanguage = getLocalStorage('selectedLanguage') || 'de'

  if (savedLanguage) {
    applyTranslation(savedLanguage)
  }
})

document.addEventListener('click', event => {
  if (!translateIcon.contains(event.target) && !languageMenu.contains(event.target)) {
    languageMenu.style.display = 'none'
  }
})

function getCurrentLanguage() {
  return localStorage.getItem('selectedLanguage') || 'de'
}

function applyTranslation(lang) {
  const translation = translations[lang]

  document.querySelector('.title').firstChild.textContent = translation.title

  document.querySelector('#templateModal .infoIcon').setAttribute('data-tooltip', translation.error.image.size)

  document.querySelector('label[for="chapter"]').textContent = translation.chapter
  document.querySelector('label[for="twoLines"]').textContent = translation.twoLines
  document.querySelector('label[for="date"]').textContent = translation.date
  document.querySelector('label[for="time"]').textContent = translation.time
  document.querySelector('label[for="startTimePopup"]').textContent = translation.from
  document.querySelector('label[for="endTimePopup"]').textContent = translation.to
  document.querySelector('label[for="place"]').textContent = translation.place
  document.querySelector('label[for="arcLink"]').textContent = translation.arcLink
  document.querySelector('label[for="templateLink"]').textContent = translation.templateLink

  changeTemplateOption.textContent = translation.changeTemplate
  resetTemplateOption.textContent = translation.resetTemplate

  arcBtn.textContent = translation.fillArc
  arcFillBtn.textContent = translation.fill
  updateBtn.textContent = translation.updatePreview
  downloadBtn.textContent = translation.download
  setTemplateBtn.textContent = translation.set
  setTimeBtn.textContent = translation.set

  saveChapter.setAttribute('data-hint', translation.save)
  saveTwoLines.setAttribute('data-hint', translation.save)
  saveDate.setAttribute('data-hint', translation.save)
  saveTime.setAttribute('data-hint', translation.save)
  savePlace.setAttribute('data-hint', translation.save)

  tooltip.querySelector('p strong').textContent = translation.contact
}

function getTranslation(keyString) {
  let translation = translations[getCurrentLanguage()]

  for (const key of keyString.split('.')) {
    if (translation[key] === undefined) {
      return undefined
    }
    translation = translation[key]
  }

  return translation
}
