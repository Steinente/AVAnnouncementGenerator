document.querySelector('.translate-icon').addEventListener('click', function (event) {
  const menu = document.getElementById('languageMenu')
  event.stopPropagation()
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
})

document.querySelectorAll('.dropdown-content a').forEach(langLink => {
  langLink.addEventListener('click', function (e) {
    e.preventDefault()

    const selectedLang = this.getAttribute('data-lang')

    localStorage.setItem('selectedLanguage', selectedLang)

    applyTranslation(selectedLang)

    const menu = document.getElementById('languageMenu')
    menu.style.display = 'none'

    e.stopPropagation()
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const savedLanguage = localStorage.getItem('selectedLanguage')

  if (savedLanguage) {
    applyTranslation(savedLanguage)
  }
})

document.addEventListener('click', function (event) {
  const menu = document.getElementById('languageMenu')
  const translateIcon = document.querySelector('.translate-icon')

  if (!translateIcon.contains(event.target) && !menu.contains(event.target)) {
    menu.style.display = 'none'
  }
})

function applyTranslation(lang) {
  const translation = translations[lang]

  document.querySelector('.title').firstChild.textContent = translation.title

  document.querySelector('label[for="chapter"]').textContent = translation.chapter
  document.querySelector('label[for="twoLines"]').textContent = translation.twoLines
  document.querySelector('label[for="date"]').textContent = translation.date
  document.querySelector('label[for="time"]').textContent = translation.time
  document.querySelector('label[for="startTimePopup"]').textContent = translation.from
  document.querySelector('label[for="endTimePopup"]').textContent = translation.to
  document.querySelector('label[for="place"]').textContent = translation.place
  document.querySelector('label[for="arcLink"]').textContent = translation.arcLink
  document.querySelector('label[for="templateLink"]').textContent = translation.templateLink

  document.getElementById('changeTemplateOption').textContent = translation.changeTemplate
  document.getElementById('resetTemplateOption').textContent = translation.resetTemplate

  document.getElementById('arcBtn').textContent = translation.fillArc
  document.getElementById('arcFillBtn').textContent = translation.fill
  document.getElementById('updateBtn').textContent = translation.updatePreview
  document.getElementById('downloadBtn').textContent = translation.download
  document.getElementById('setTemplateBtn').textContent = translation.set

  document.getElementById('saveChapter').setAttribute('data-hint', translation.save)
  document.getElementById('saveTwoLines').setAttribute('data-hint', translation.save)
  document.getElementById('saveDate').setAttribute('data-hint', translation.save)
  document.getElementById('saveTime').setAttribute('data-hint', translation.save)
  document.getElementById('savePlace').setAttribute('data-hint', translation.save)

  document.querySelector('#tooltip p strong').textContent = translation.contact
}

function getTranslation(keyString) {
  const lang = localStorage.getItem('selectedLanguage') || 'de'

  const keys = keyString.split('.')

  let translation = translations[lang]

  for (const key of keys) {
    if (translation[key] === undefined) {
      return undefined
    }
    translation = translation[key]
  }

  return translation
}
