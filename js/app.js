document.getElementById('updateBtn').addEventListener('click', () => {
  generateImage(() => {})
})

document.getElementById('downloadBtn').addEventListener('click', () => {
  const chapterInput = document.getElementById('chapter').value.trim().toLowerCase()
  const dateInput = document.getElementById('date').value.trim().toLowerCase()

  const chapter = chapterInput || getLocalStorage('chapter').toLowerCase()
  const date = dateInput || getLocalStorage('date').toLowerCase()

  const currentLang = localStorage.getItem('selectedLanguage') || 'de'
  const formattedDate = date ? convertMonth(date, currentLang).replace(/\s+/g, '') : ''
  const sanitizedChapter = chapter ? chapter.replace(/\s+/g, '-') : ''

  let fileName = 'announcement'
  if (sanitizedChapter) {
    fileName += `_${sanitizedChapter}`
  }
  if (formattedDate) {
    fileName += `_${formattedDate}`
  }
  fileName += '.png'

  generateImage(canvas => {
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, 1)
})

const contextMenu = document.getElementById('contextMenu')
const templateModal = document.getElementById('templateModal')

document.getElementById('canvas').addEventListener('contextmenu', function (e) {
  e.preventDefault()

  const contextMenu = document.getElementById('contextMenu')

  contextMenu.style.display = 'block'

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const menuWidth = contextMenu.offsetWidth
  const menuHeight = contextMenu.offsetHeight

  let posX = e.clientX || e.touches?.[0]?.clientX
  let posY = e.clientY || e.touches?.[0]?.clientY

  if (posX + menuWidth > screenWidth) {
    posX = screenWidth - menuWidth
  }

  if (posY + menuHeight > screenHeight) {
    posY = screenHeight - menuHeight
  }

  contextMenu.style.top = `${posY}px`
  contextMenu.style.left = `${posX}px`

  document.addEventListener('click', function closeMenu() {
    contextMenu.style.display = 'none'
    document.removeEventListener('click', closeMenu)
  })
})

let pressTimer

canvas.addEventListener(
  'touchstart',
  function (e) {
    pressTimer = setTimeout(function () {
      contextMenu.style.display = 'block'
      contextMenu.style.top = `${e.touches[0].clientY}px`
      contextMenu.style.left = `${e.touches[0].clientX}px`

      document.addEventListener('click', function closeMenu() {
        contextMenu.style.display = 'none'
        document.removeEventListener('click', closeMenu)
      })
    }, 500)
  },
  false
)

canvas.addEventListener(
  'touchend',
  function () {
    clearTimeout(pressTimer)
  },
  false
)

document.getElementById('changeTemplateOption').addEventListener('click', function () {
  templateModal.style.display = 'block'
  contextMenu.style.display = 'none'
})

document.querySelector('#templateModal .close').addEventListener('click', function () {
  templateModal.style.display = 'none'
})

document.getElementById('setTemplateBtn').addEventListener('click', function () {
  const templateLink = document.getElementById('templateLink').value.trim()

  if (templateLink) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = templateLink

    img.onload = function () {
      if (img.width >= 1665 && img.height >= 1665) {
        setLocalStorage('templateLink', templateLink)
        templateModal.style.display = 'none'
        generateImage(() => {})
        document.getElementById('templateLink').value = ''
      } else {
        showError(getTranslation('error.image.size'))
      }
    }

    img.onerror = function () {
      showError(getTranslation('error.image.load'))
    }
  } else {
    showError(getTranslation('error.noUrl'))
  }
})

document.getElementById('resetTemplateOption').addEventListener('click', function () {
  resetCanvasTemplate()
  contextMenu.style.display = 'none'
})

function resetCanvasTemplate() {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)

  localStorage.removeItem('templateLink')

  const img = new Image()
  if (window.location.protocol === 'file:') {
    img.crossOrigin = 'anonymous'
    img.src = 'https://i.imgur.com/noMa6R2.jpeg'
  } else {
    img.src = 'img/template.jpeg'
  }

  generateImage(() => {})
}

document.getElementById('helpIcon').addEventListener('click', () => {
  const tooltip = document.getElementById('tooltip')
  tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block'
})

document.getElementById('arcFillBtn').addEventListener('click', () => {
  let arcLink = document.getElementById('arcLink').value.trim()

  if (!arcLink) {
    showError(getTranslation('error.noUrl'))
    return
  }

  const validUrlPattern = /^https:\/\/animalrightscalendar\.org\/(events|api\/events)\/[a-zA-Z0-9]{24}$/
  if (!validUrlPattern.test(arcLink)) {
    showError(getTranslation('error.arc.url'))
    return
  }

  const eventId = arcLink.split('/').pop()
  const apiLink = `https://animalrightscalendar.org/api/events/${eventId}`

  let proxiedApiLink = apiLink

  const proxyUrl = 'https://api.allorigins.win/get?url='
  proxiedApiLink = proxyUrl + encodeURIComponent(apiLink)

  resetFields()

  document.getElementById('arcFillBtn').disabled = true

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
      if (error.message === 'Failed to fetch') {
        showError(getTranslation('error.arc.cors'))
      } else {
        showError(getTranslation('error.arc.unknown'))
      }
      resetFields()
      console.error('Fehler beim Abrufen der API:', error)
    })
    .finally(() => {
      document.getElementById('arcFillBtn').disabled = false
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
  } else if (event.target === templateModal) {
    templateModal.style.display = 'none'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  updatePlaceholders()
  generateTimeOptions()
  loadTimeSettings()
  generateImage(() => {})
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
    const monthNumber = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()

    const currentLang = localStorage.getItem('selectedLanguage') || 'de'
    const formattedDate = convertMonth(`${day}.${monthNumber}.${year}`, currentLang, false)

    dateInput.value = formattedDate
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

  const currentLang = localStorage.getItem('selectedLanguage') || 'de'

  if (startTime && endTime) {
    if (currentLang === 'de') {
      timeInput.value = `${startTime} - ${endTime} Uhr`
    } else if (currentLang === 'en') {
      const start12h = convertTo12HourFormat(startTime)
      const end12h = convertTo12HourFormat(endTime)
      timeInput.value = `${start12h} - ${end12h}`
    } else if (currentLang === 'fr') {
      const startFrench = startTime.replace(':', ' h ')
      const endFrench = endTime.replace(':', ' h ')
      timeInput.value = `${startFrench} - ${endFrench}`
    }
  }

  document.getElementById('timePickerPopup').style.display = 'none'
})

function convertTo12HourFormat(time) {
  const [hour, minute] = time.split(':')
  const hour12 = hour % 12 || 12
  const period = hour >= 12 ? 'PM' : 'AM'
  return `${hour12}:${minute} ${period}`
}

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

      const img = new Image()
      const storedTemplateLink =
        getLocalStorage('templateLink') ||
        (window.location.protocol === 'file:' ? 'https://i.imgur.com/noMa6R2.jpeg' : 'img/template.jpeg')
      img.crossOrigin = 'anonymous'
      img.src = storedTemplateLink

      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')

      img.onload = function () {
        canvas.width = img.width
        canvas.height = img.height

        context.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Chapter
        context.textBaseline = 'alphabetic'
        context.textAlign = 'left'
        context.fillStyle = 'rgb(230, 0, 0)'
        const chapterPadding = 235
        let maxTextWidth = canvas.width - 2 * chapterPadding
        let font = 'SourceSansProSemiBold'
        let chapterYPosition = 1030
        if (twoLines) {
          const chapterParts = splitTextInTwoLines(chapter)
          drawTwoLineChapter(context, chapterParts, chapterPadding, maxTextWidth, maxFontSize, font, chapterYPosition)
        } else {
          if (hasDiacriticAbove(chapter)) {
            chapterYPosition += 25
          }
          const chapterAdjustment = adjustFontSize(context, chapter, maxTextWidth, maxFontSize, font, chapterYPosition)
          drawTextWithSpacing(
            context,
            chapter,
            chapterPadding,
            chapterAdjustment.yOffset,
            maxTextWidth,
            chapterAdjustment.fontSize,
            font
          )
        }

        // Date
        context.fillStyle = 'white'
        font = 'SourceSansPro'
        const datePadding = 405
        maxTextWidth = canvas.width - 2 * datePadding
        const dateAdjustment = adjustFontSizeWithShift(context, date, maxTextWidth, maxFontSize - 80, font)
        const dateYPosition = 1300 + dateAdjustment.yOffset
        drawTextWithSpacing(context, date, datePadding, dateYPosition, maxTextWidth, dateAdjustment.fontSize, font)

        // Time
        const timePadding = 320
        maxTextWidth = canvas.width - 2 * timePadding
        const timeAdjustment = adjustFontSizeWithShift(context, time, maxTextWidth, maxFontSize - 80, font)
        const timeYPosition = 1400 + timeAdjustment.yOffset
        drawTextWithSpacing(context, time, timePadding, timeYPosition, maxTextWidth, timeAdjustment.fontSize, font)

        // Place
        context.textAlign = 'left'
        font = 'SourceSansProSemiBold'
        const placePadding = 235
        maxTextWidth = canvas.width - 2 * placePadding
        const placeAdjustment = adjustFontSize(context, place, maxTextWidth, maxFontSize - 40, font, 1520)
        drawTextWithSpacing(
          context,
          place,
          placePadding,
          placeAdjustment.yOffset,
          maxTextWidth,
          placeAdjustment.fontSize,
          font
        )

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
  chapterYPosition = chapterYPosition - 30
  maxFontSize = maxFontSize - 50

  const widthLine1 = context.measureText(chapterParts[0]).width
  const widthLine2 = context.measureText(chapterParts[1]).width

  const longerPart = widthLine1 > widthLine2 ? chapterParts[0] : chapterParts[1]
  const finalFontSize = adjustFontSize(context, longerPart, maxTextWidth, maxFontSize, font, chapterYPosition)
  context.font = `${finalFontSize}px "${font}"`

  const targetWidth = maxTextWidth
  const metricsLine1 = context.measureText(chapterParts[0])
  const line1Height = metricsLine1.actualBoundingBoxAscent + metricsLine1.actualBoundingBoxDescent

  let adjustedYPositionLine1 = chapterYPosition
  let adjustedYPositionLine2 = chapterYPosition + line1Height + 10

  if (hasDiacriticAbove(chapterParts[0])) {
    adjustedYPositionLine1 += 20
  }

  if (hasDiacriticAbove(chapterParts[1])) {
    adjustedYPositionLine2 += 20
  }

  drawTextWithSpacing(
    context,
    chapterParts[0],
    chapterPadding,
    adjustedYPositionLine1,
    targetWidth,
    finalFontSize,
    font
  )
  drawTextWithSpacing(
    context,
    chapterParts[1],
    chapterPadding,
    adjustedYPositionLine2,
    targetWidth,
    finalFontSize,
    font
  )
}

function adjustFontSize(context, text, maxWidth, maxFontSize, font, initialY) {
  let fontSize = maxFontSize
  let yOffset = 0
  const originalFontSize = fontSize

  context.font = `${fontSize}px "${font}"`
  let textWidth = context.measureText(text).width

  while (textWidth > maxWidth) {
    fontSize--
    context.font = `${fontSize}px "${font}"`
    textWidth = context.measureText(text).width
  }

  const sizeDifference = originalFontSize - fontSize
  yOffset = sizeDifference / 2

  return { fontSize, yOffset: initialY - yOffset }
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

function convertMonth(dateString, lang, toNumber = true) {
  const months = translations[lang].months

  const monthNumbers = {
    '01': months.january,
    '02': months.february,
    '03': months.march,
    '04': months.april,
    '05': months.may,
    '06': months.june,
    '07': months.july,
    '08': months.august,
    '09': months.september,
    10: months.october,
    11: months.november,
    12: months.december,
  }

  if (toNumber) {
    for (const [monthName, monthNumber] of Object.entries(months)) {
      if (dateString.toLowerCase().includes(monthName)) {
        return dateString.toLowerCase().replace(monthName, monthNumber)
      }
    }
  } else {
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
    const currentLang = localStorage.getItem('selectedLanguage') || 'de'
    return convertMonth(dateString, currentLang, false)
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

function hasDiacriticAbove(text) {
  const diacriticAboveRegex = /[\u0300-\u034F]/
  return diacriticAboveRegex.test(text.normalize('NFD'))
}
