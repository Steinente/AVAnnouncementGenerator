document.addEventListener('DOMContentLoaded', () => {
  updatePlaceholders()
  generateTimeOptions()
  generateImage(() => {})
})

document.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('blur', function () {
    this.value = this.value.trim()
  })

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      this.value = this.value.trim()
    }
  })
})

function loadFonts(maxFontSize) {
  const fonts = [`SourceSansPro`, `SourceSansProSemiBold`]
  return Promise.all(fonts.map(font => document.fonts.load(`${maxFontSize}px ${font}`)))
}

function resetFields() {
  chapter.value = ''
  twoLines.checked = false
  date.value = ''
  time.value = ''
  place.value = ''
}

function updatePlaceholders() {
  chapter.placeholder = getLocalStorage('chapter') || ''
  twoLines.checked = getLocalStorage('twoLines') === 'true'
  date.placeholder = getLocalStorage('date') || ''
  time.placeholder = getLocalStorage('time') || ''
  place.placeholder = getLocalStorage('place') || ''

  startTimePopup.value = getLocalStorage('startTime') || '14:00'
  endTimePopup.value = getLocalStorage('endTime') || '18:00'
}
