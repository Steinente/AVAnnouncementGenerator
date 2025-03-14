window.addEventListener('click', event => {
  if (event.target === arcModal) {
    arcModal.style.display = 'none'
  }
})

arcFillBtn.addEventListener('click', () => {
  if (!arcLink.value) {
    showError(getTranslation('error.noUrl'))
    return
  }

  const validUrlPattern = /^https:\/\/animalrightscalendar\.org\/(?:api|admin\/collections)?\/?events\/[a-zA-Z0-9]{24}$/
  if (!validUrlPattern.test(arcLink.value)) {
    showError(getTranslation('error.arc.url'))
    return
  }

  const eventId = arcLink.value.split('/').pop()
  const backendUrl = `https://srv03.brrr.at/event?eventId=${eventId}`

  resetFields()
  arcFillBtn.disabled = true

  fetch(backendUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${getTranslation('error.status')}: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      if (data && data.title && data.start && data.end && data.location) {
        let title = data.title || ''
        title = title.replace(/^[^:]*:\s*/, '').trim()
        title = title.split(',')[0].trim()
        chapter.value = title

        const titleWords = title.split(/[\s-]+/)
        twoLines.checked = titleWords.length === 2

        const parsedStart = new Date(data.start)
        const parsedEnd = new Date(data.end)

        const startDate = parsedStart.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        const startTime = parsedStart.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
        const endTime = parsedEnd.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

        date.value = formatDate(startDate)
        time.value = formatTime(startTime, endTime)

        let location = data.location || ''
        location = location.split(',')[0]
        place.value = location
      } else {
        throw new Error(getTranslation('error.arc.data'))
      }

      arcLink.value = ''
      arcModal.style.display = 'none'
    })
    .catch(error => {
      showError(getTranslation('error.arc.unknown'))
      resetFields()
      console.error(`${getTranslation('error.arc.api')}:`, error)
    })
    .finally(() => {
      arcFillBtn.disabled = false
    })
})

arcBtn.addEventListener('click', () => {
  arcModal.style.display = 'block'
  arcLink.focus()
})

document.querySelector('#arcModal .close').addEventListener('click', () => {
  arcModal.style.display = 'none'
})
