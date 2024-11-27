let pressTimer

canvas.addEventListener('contextmenu', e => {
  e.preventDefault()

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

  document.addEventListener('click', closeContextMenu)
})

canvas.addEventListener('touchstart', e => {
  pressTimer = setTimeout(() => {
    contextMenu.style.display = 'block'
    contextMenu.style.top = `${e.touches[0].clientY}px`
    contextMenu.style.left = `${e.touches[0].clientX}px`

    document.addEventListener('click', closeContextMenu)
  }, 500)
})

canvas.addEventListener('touchend', () => {
  clearTimeout(pressTimer)
})

function generateImage(onComplete) {
  const maxFontSize = 200

  loadFonts(maxFontSize)
    .then(() => {
      const chapterValue = (chapter.value ? chapter.value : getLocalStorage('chapter')).toUpperCase() || ''
      const twoLinesValue = twoLines.checked ? twoLines.checked : getLocalStorage('twoLines') === 'true'
      const dateValue = (formatDate(date.value) || getLocalStorage('date')).toUpperCase() || ''
      const timeValue = (time.value ? time.value : getLocalStorage('time')).toUpperCase() || ''
      const placeValue = (place.value ? place.value : getLocalStorage('place')).toUpperCase() || ''

      const context = canvas.getContext('2d')

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = getLocalStorage('templateLink') || getTranslation('defaultTemplateUrl')
      img.onload = () => {
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
        if (twoLinesValue) {
          const chapterParts = splitTextInTwoLines(chapterValue)
          drawTwoLineChapter(context, chapterParts, chapterPadding, maxTextWidth, maxFontSize, font, chapterYPosition)
        } else {
          if (hasDiacriticAbove(chapterValue)) {
            chapterYPosition += 25
          }
          if (isAllChinese(chapterValue)) {
            context.textAlign = 'center'
            context.font = `${maxFontSize}px "${font}"`
            context.fillText(chapterValue, canvas.width / 2, chapterYPosition)
          } else {
            const chapterAdjustment = adjustFontSize(
              context,
              chapterValue,
              maxTextWidth,
              maxFontSize,
              font,
              chapterYPosition
            )
            drawTextWithSpacing(
              context,
              chapterValue,
              chapterPadding,
              chapterAdjustment.yOffset,
              maxTextWidth,
              chapterAdjustment.fontSize,
              font
            )
          }
        }

        // Date
        context.textAlign = 'left'
        context.fillStyle = 'white'
        font = 'SourceSansPro'
        const datePadding = 405
        maxTextWidth = canvas.width - 2 * datePadding
        const dateAdjustment = adjustFontSizeWithShift(context, dateValue, maxTextWidth, maxFontSize - 80, font)
        const dateYPosition = 1300 + dateAdjustment.yOffset
        drawTextWithSpacing(context, dateValue, datePadding, dateYPosition, maxTextWidth, dateAdjustment.fontSize, font)

        // Time
        const timePadding = 320
        maxTextWidth = canvas.width - 2 * timePadding
        const timeAdjustment = adjustFontSizeWithShift(context, timeValue, maxTextWidth, maxFontSize - 80, font)
        const timeYPosition = 1400 + timeAdjustment.yOffset
        drawTextWithSpacing(context, timeValue, timePadding, timeYPosition, maxTextWidth, timeAdjustment.fontSize, font)

        // Place
        context.textAlign = 'left'
        font = 'SourceSansProSemiBold'
        const placePadding = 235
        maxTextWidth = canvas.width - 2 * placePadding
        const placeAdjustment = adjustFontSize(context, placeValue, maxTextWidth, maxFontSize - 40, font, 1520)
        drawTextWithSpacing(
          context,
          placeValue,
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
      console.error(`${getTranslation('error.image.font')}:`, err)
    })
}

function splitTextInTwoLines(text) {
  if (text.includes('//')) {
    return text.split('//').map(part => part.trim())
  } else {
    const words = text.split(/[\s-]+/)
    const middle = Math.ceil(words.length / 2)
    return [words.slice(0, middle).join(' ').trim(), words.slice(middle).join(' ').trim()]
  }
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

  let currentX = x + 4 // +4px because its not centered
  for (let i = 0; i < text.length; i++) {
    context.fillText(text[i], currentX, y)
    currentX += charWidths[i] + spacing
  }
}

function closeContextMenu() {
  contextMenu.style.display = 'none'
  document.removeEventListener('click', closeContextMenu)
}

function hasDiacriticAbove(text) {
  const diacriticAboveRegex = /[\u0300-\u0315\u0363-\u036F\u1E00-\u1EFF\u4E00-\u9FFF]/
  return diacriticAboveRegex.test(text.normalize('NFD'))
}

function isAllChinese(text) {
  const chineseCharRegex = /^[\u4E00-\u9FFF]+$/
  return chineseCharRegex.test(text)
}
