document.getElementById('previewBtn').addEventListener('click', () => {
  generateImage(() => {})
})

document.getElementById('downloadBtn').addEventListener('click', () => {
  const chapterInput = document.getElementById('chapter').value.trim().toLowerCase()
  const dateInput = document.getElementById('date').value.trim().toLowerCase()
  const formattedDate = convertMonth(dateInput).replace(/\s+/g, '')
  const sanitizedChapter = chapterInput.replace(/\s+/g, '-')
  const fileName = `announcement_${sanitizedChapter}_${formattedDate}.png`

  generateImage(canvas => {
    const imageUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, 1)
})

document.getElementById('helpIcon').addEventListener('click', () => {
  const tooltip = document.getElementById('tooltip')
  tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block'
})

document.getElementById('modalFillBtn').addEventListener('click', () => {
  let arcLink = document.getElementById('arcLink').value.trim()

  if (!arcLink) {
    showError('Bitte gib eine gültige URL ein.')
    return
  }

  const eventId = arcLink.split('/').pop()
  const apiLink = `https://animalrightscalendar.org/api/events/${eventId}`

  const proxyUrl = 'https://api.allorigins.win/get?url='
  const proxiedApiLink = proxyUrl + encodeURIComponent(apiLink)

  resetFields()

  document.getElementById('modalFillBtn').disabled = true

  fetch(proxiedApiLink)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Fehlerstatus: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      const parsedData = JSON.parse(data.contents)

      if (parsedData && parsedData.title && parsedData.start && parsedData.end && parsedData.location) {
        let title = parsedData.title || ''
        title = title.replace(/^[^:]*:\s*/, '').trim()
        title = title.split(',')[0].trim()
        document.getElementById('chapter').value = title

        const titleWords = title.split(/[\s-]+/)
        document.getElementById('twoLines').checked = titleWords.length === 2

        const startDate = new Date(parsedData.start)
        document.getElementById('date').value = startDate.toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        const endTime = new Date(parsedData.end)
        document.getElementById('time').value = `${startDate.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${endTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`

        let location = parsedData.location || ''
        location = location.split(',')[0]
        document.getElementById('place').value = location
      } else {
        throw new Error('Ungültige oder unvollständige Daten von der API erhalten.')
      }

      document.getElementById('arcLink').value = ''
      document.getElementById('arcModal').style.display = 'none'
    })
    .catch(error => {
      if (
        error.message === 'Failed to fetch' ||
        error.message.includes('NetworkError') ||
        error.message.includes('CORS')
      ) {
        showError(
          'CORS-Fehler: Bitte aktiviere temporären Zugriff unter <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">cors-anywhere.herokuapp.com</a>.'
        )
      } else {
        showError('Fehler beim Abrufen der API. Bitte überprüfe den Link.')
      }
      resetFields()
      console.error('Fehler beim Abrufen der API:', error)
    })
    .finally(() => {
      document.getElementById('modalFillBtn').disabled = false
    })
})

const arcModal = document.getElementById('arcModal')

document.getElementsByClassName('close')[0].addEventListener('click', () => {
  arcModal.style.display = 'none'
})

document.getElementById('arcBtn').addEventListener('click', () => {
  document.getElementById('arcModal').style.display = 'block'
  document.getElementById('arcLink').focus()
})

window.addEventListener('click', event => {
  if (event.target === arcModal) {
    arcModal.style.display = 'none'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  updateHints()
  updatePlaceholders()
  generateTimeOptions()
  loadTimeSettings()
})

document.getElementById('datePickerIcon').addEventListener('click', () => {
  document.getElementById('hiddenDatePicker').click()
})

document.getElementById('hiddenDatePicker').addEventListener('change', () => {
  const selectedDate = document.getElementById('hiddenDatePicker').value
  const dateInput = document.getElementById('date')

  if (selectedDate) {
    const dateObj = new Date(selectedDate)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = dateObj.toLocaleString('de-DE', { month: 'long' })
    const year = dateObj.getFullYear()

    dateInput.value = `${day}. ${month} ${year}`
  }
})

document.getElementById('timePickerIcon').addEventListener('click', event => {
  const icon = event.target
  const popup = document.getElementById('timePickerPopup')
  const iconRect = icon.getBoundingClientRect()

  popup.style.display = 'block'
  popup.style.top = `${iconRect.bottom + window.scrollY}px`
  popup.style.left = `${iconRect.right + window.scrollX - popup.offsetWidth}px`
})

document.getElementById('setTimeBtn').addEventListener('click', () => {
  const startTime = document.getElementById('startTimePopup').value
  const endTime = document.getElementById('endTimePopup').value
  const timeInput = document.getElementById('time')

  if (startTime && endTime) {
    timeInput.value = `${startTime} - ${endTime} Uhr`
  }

  document.getElementById('timePickerPopup').style.display = 'none'
})

document.addEventListener('click', event => {
  const popup = document.getElementById('timePickerPopup')
  const icon = document.getElementById('timePickerIcon')

  if (!popup.contains(event.target) && !icon.contains(event.target)) {
    popup.style.display = 'none'
  }
})

document.querySelector('.close-error').addEventListener('click', () => {
  document.getElementById('errorMessage').style.display = 'none'
})

document.getElementById('saveChapter').addEventListener('click', () => {
  const chapterValue = document.getElementById('chapter').value
  setLocalStorage('chapter', chapterValue)
})

document.getElementById('saveTwoLines').addEventListener('click', () => {
  const twoLinesValue = document.getElementById('twoLines').checked
  setLocalStorage('twoLines', twoLinesValue)
})

document.getElementById('saveDate').addEventListener('click', () => {
  const dateValue = document.getElementById('date').value
  setLocalStorage('date', dateValue)
})

document.getElementById('saveTime').addEventListener('click', () => {
  const timeValue = document.getElementById('time').value
  const startTimeValue = document.getElementById('startTimePopup').value
  const endTimeValue = document.getElementById('endTimePopup').value

  setLocalStorage('time', timeValue)
  setLocalStorage('startTime', startTimeValue)
  setLocalStorage('endTime', endTimeValue)
})

document.getElementById('savePlace').addEventListener('click', () => {
  const placeValue = document.getElementById('place').value
  setLocalStorage('place', placeValue)
})

function generateImage(onComplete) {
  const maxFontSize = 200

  loadFonts(maxFontSize)
    .then(() => {
      const chapterInput = document.getElementById('chapter').value
      const twoLinesInput = document.getElementById('twoLines').checked
      const dateInput = document.getElementById('date').value
      const timeInput = document.getElementById('time').value
      const placeInput = document.getElementById('place').value

      const chapter = chapterInput.trim()
        ? chapterInput.toUpperCase().trim()
        : getLocalStorage('chapter').toUpperCase() || ''
      const twoLines = chapterInput.trim() ? twoLinesInput : getLocalStorage('twoLines') === 'true'
      const date = formatDate(dateInput.trim()).toUpperCase() || getLocalStorage('date').toUpperCase() || ''
      const time = timeInput.trim() ? timeInput.toUpperCase().trim() : getLocalStorage('time').toUpperCase() || ''
      const place = placeInput.trim() ? placeInput.toUpperCase().trim() : getLocalStorage('place').toUpperCase() || ''

      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = 'https://i.imgur.com/noMa6R2.jpeg'

      img.onload = function () {
        canvas.width = img.width
        canvas.height = img.height

        context.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Chapter
        context.textBaseline = 'top'
        context.textAlign = 'left'
        context.fillStyle = 'rgb(230, 0, 0)'
        const chapterPadding = 235
        let maxTextWidth = canvas.width - 2 * chapterPadding
        let font = 'SourceSansProSemiBold'
        let chapterYPosition = 885
        if (twoLines) {
          const chapterParts = splitTextInTwoLines(chapter)
          drawTwoLineChapter(context, chapterParts, chapterPadding, maxTextWidth, maxFontSize, font, chapterYPosition)
        } else {
          if (hasUmlaut(chapter)) {
            chapterYPosition += 20
          }
          const chapterFontSize = adjustFontSize(context, chapter, maxTextWidth, maxFontSize, font)
          drawTextWithSpacing(context, chapter, chapterPadding, chapterYPosition, maxTextWidth, chapterFontSize, font)
        }

        // Date
        context.fillStyle = 'white'
        font = 'SourceSansPro'
        const datePadding = 405
        maxTextWidth = canvas.width - 2 * datePadding
        const dateAdjustment = adjustFontSizeWithShift(context, date, maxTextWidth, maxFontSize - 80, font)
        const dateYPosition = 1220 + dateAdjustment.yOffset
        drawTextWithSpacing(context, date, datePadding, dateYPosition, maxTextWidth, dateAdjustment.fontSize, font)

        // Time
        const timePadding = 320
        maxTextWidth = canvas.width - 2 * timePadding
        const timeAdjustment = adjustFontSizeWithShift(context, time, maxTextWidth, maxFontSize - 80, font)
        const timeYPosition = 1315 + timeAdjustment.yOffset
        drawTextWithSpacing(context, time, timePadding, timeYPosition, maxTextWidth, timeAdjustment.fontSize, font)

        // Place
        context.textAlign = 'left'
        font = 'SourceSansProSemiBold'
        const placePadding = 235
        maxTextWidth = canvas.width - 2 * placePadding
        const placeAdjustment = adjustFontSizeWithShift(context, place, maxTextWidth, maxFontSize - 40, font)
        const placeYPosition = 1405 + placeAdjustment.yOffset
        drawTextWithSpacing(context, place, placePadding, placeYPosition, maxTextWidth, placeAdjustment.fontSize, font)

        onComplete(canvas)
      }
    })
    .catch(err => {
      console.error('Fehler beim Laden der Schriftart:', err)
    })
}

function loadFonts(maxFontSize) {
  const fonts = [`SourceSansPro`, `SourceSansProSemiBold`]
  return Promise.all(fonts.map(font => document.fonts.load(`${maxFontSize}px ${font}`)))
}

function splitTextInTwoLines(text) {
  const words = text.split(/[\s-]+/)
  const middle = Math.ceil(words.length / 2)
  return [words.slice(0, middle).join(' '), words.slice(middle).join(' ')]
}

function drawTwoLineChapter(context, chapterParts, chapterPadding, maxTextWidth, maxFontSize, font, chapterYPosition) {
  const widthLine1 = context.measureText(chapterParts[0]).width
  const widthLine2 = context.measureText(chapterParts[1]).width

  const longerPart = widthLine1 > widthLine2 ? chapterParts[0] : chapterParts[1]
  const finalFontSize = adjustFontSize(context, longerPart, maxTextWidth, maxFontSize - 50, font)
  context.font = `${finalFontSize}px "${font}"`

  const targetWidth = maxTextWidth
  const metricsLine1 = context.measureText(chapterParts[0])
  const line1Height = metricsLine1.actualBoundingBoxAscent + metricsLine1.actualBoundingBoxDescent

  if (hasUmlaut(chapterParts[0].split(' ')[0])) {
    chapterYPosition += 20
  }

  drawTextWithSpacing(context, chapterParts[0], chapterPadding, chapterYPosition, targetWidth, finalFontSize, font)
  drawTextWithSpacing(
    context,
    chapterParts[1],
    chapterPadding,
    chapterYPosition + line1Height + 20,
    targetWidth,
    finalFontSize,
    font
  )
}

function adjustFontSize(context, text, maxWidth, maxFontSize, font) {
  let fontSize = maxFontSize
  context.font = `${fontSize}px "${font}"`
  let textWidth = context.measureText(text).width

  while (textWidth > maxWidth) {
    fontSize--
    context.font = `${fontSize}px "${font}"`
    textWidth = context.measureText(text).width
  }

  return fontSize
}

function adjustFontSizeWithShift(context, text, maxWidth, maxFontSize, font) {
  let fontSize = maxFontSize
  let yOffset = 0
  let reductionCount = 0
  context.font = `${fontSize}px "${font}"`
  let textWidth = context.measureText(text).width

  while (textWidth > maxWidth) {
    fontSize--
    reductionCount++
    if (reductionCount % 3 === 0) {
      yOffset++
    }
    context.font = `${fontSize}px "${font}"`
    textWidth = context.measureText(text).width
  }

  return { fontSize, yOffset }
}

function drawTextWithSpacing(context, text, x, y, maxWidth, fontSize, font) {
  context.font = `${fontSize}px "${font}"`

  let charWidths = []
  let totalCharsWidth = 0

  for (let i = 0; i < text.length; i++) {
    const charWidth = context.measureText(text[i]).width
    charWidths.push(charWidth)
    totalCharsWidth += charWidth
  }

  let spacing = 0
  if (text.length > 1) {
    spacing = (maxWidth - totalCharsWidth) / (text.length - 1)
  }

  let currentX = x + 4 // +4px because the template is not centered
  for (let i = 0; i < text.length; i++) {
    context.fillText(text[i], currentX, y)
    currentX += charWidths[i] + spacing
  }
}

function convertMonth(dateString, toNumber = true) {
  const months = {
    januar: '01',
    februar: '02',
    märz: '03',
    april: '04',
    mai: '05',
    juni: '06',
    juli: '07',
    august: '08',
    september: '09',
    oktober: '10',
    november: '11',
    dezember: '12',
  }

  const monthNumbers = {
    '01': 'JANUAR',
    '02': 'FEBRUAR',
    '03': 'MÄRZ',
    '04': 'APRIL',
    '05': 'MAI',
    '06': 'JUNI',
    '07': 'JULI',
    '08': 'AUGUST',
    '09': 'SEPTEMBER',
    10: 'OKTOBER',
    11: 'NOVEMBER',
    12: 'DEZEMBER',
  }

  if (toNumber) {
    // Konvertiere Monatsnamen zu Zahl
    for (const [monthName, monthNumber] of Object.entries(months)) {
      if (dateString.toLowerCase().includes(monthName)) {
        return dateString.toLowerCase().replace(monthName, monthNumber)
      }
    }
  } else {
    // Konvertiere Monatszahl zu ausgeschriebenem Monat
    const dateParts = dateString.split('.')
    const day = dateParts[0]
    const month = dateParts[1]
    const year = dateParts[2]

    return `${day}. ${monthNumbers[month]} ${year}`
  }

  return dateString
}

function formatDate(dateString) {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/
  if (regex.test(dateString)) {
    return convertMonth(dateString, false)
  }
  return dateString
}

function showError(message) {
  const errorMessage = document.getElementById('errorMessage')
  const errorText = document.getElementById('errorText')

  errorText.textContent = message
  errorMessage.style.display = 'block'

  setTimeout(() => {
    errorMessage.style.display = 'none'
  }, 5000)
}

function resetFields() {
  document.getElementById('chapter').value = ''
  document.getElementById('date').value = ''
  document.getElementById('time').value = ''
  document.getElementById('place').value = ''
  document.getElementById('twoLines').checked = false
}

function updateHints() {
  const chapterHint = `Default-Settings: ${getLocalStorage('chapter') || 'leer'} wird mit dem Feldwert überschrieben.`
  const twoLinesHint = `Default-Settings: ${getLocalStorage('twoLines') || 'leer'} wird mit dem Feldwert überschrieben.`
  const dateHint = `Default-Settings: ${getLocalStorage('date') || 'leer'} wird mit dem Feldwert überschrieben.`
  const timeHint = `Default-Settings: ${getLocalStorage('time') || 'leer'} wird mit dem Feldwert überschrieben.`
  const placeHint = `Default-Settings: ${getLocalStorage('place') || 'leer'} wird mit dem Feldwert überschrieben.`

  document.getElementById('saveChapter').setAttribute('data-hint', chapterHint)
  document.getElementById('saveTwoLines').setAttribute('data-hint', twoLinesHint)
  document.getElementById('saveDate').setAttribute('data-hint', dateHint)
  document.getElementById('saveTime').setAttribute('data-hint', timeHint)
  document.getElementById('savePlace').setAttribute('data-hint', placeHint)
}

function updatePlaceholders() {
  const chapterInput = document.getElementById('chapter')
  const twoLinesInput = document.getElementById('twoLines')
  const dateInput = document.getElementById('date')
  const timeInput = document.getElementById('time')
  const placeInput = document.getElementById('place')

  chapterInput.placeholder = getLocalStorage('chapter') || ''
  twoLinesInput.checked = getLocalStorage('twoLines') === 'true'
  dateInput.placeholder = getLocalStorage('date') || ''
  timeInput.placeholder = getLocalStorage('time') || ''
  placeInput.placeholder = getLocalStorage('place') || ''
}

function setLocalStorage(name, value) {
  localStorage.setItem(name, value)
  updateHints()
  updatePlaceholders()
}

function getLocalStorage(name) {
  return localStorage.getItem(name) || ''
}

function generateTimeOptions() {
  const selectStart = document.getElementById('startTimePopup')
  const selectEnd = document.getElementById('endTimePopup')

  for (let hour = 0; hour < 24; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      const optionStart = document.createElement('option')
      optionStart.value = timeString
      optionStart.textContent = timeString
      if (timeString === '14:00') optionStart.selected = true
      selectStart.appendChild(optionStart)

      const optionEnd = document.createElement('option')
      optionEnd.value = timeString
      optionEnd.textContent = timeString
      if (timeString === '18:00') optionEnd.selected = true
      selectEnd.appendChild(optionEnd)
    }
  }
}

function loadTimeSettings() {
  const savedTime = getLocalStorage('time')
  const savedStartTime = getLocalStorage('startTime') || '14:00'
  const savedEndTime = getLocalStorage('endTime') || '18:00'

  document.getElementById('time').placeholder = savedTime
  document.getElementById('startTimePopup').value = savedStartTime
  document.getElementById('endTimePopup').value = savedEndTime
}

function hasUmlaut(text) {
  const umlautRegex = /[äöüÄÖÜ]/
  return umlautRegex.test(text)
}
