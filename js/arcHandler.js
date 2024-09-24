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

  const validUrlPattern = /^https:\/\/animalrightscalendar\.org\/(events|api\/events)\/[a-zA-Z0-9]{24}$/
  if (!validUrlPattern.test(arcLink.value)) {
    showError(getTranslation('error.arc.url'))
    return
  }

  const eventId = arcLink.value.split('/').pop()
  const apiLink = `https://animalrightscalendar.org/api/events/${eventId}`
  const proxyUrl = 'https://api.allorigins.win/get?url='
  const proxiedApiLink = proxyUrl + encodeURIComponent(apiLink)

  resetFields()
  arcFillBtn.disabled = true

  fetch(proxiedApiLink)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${getTranslation('error.status')}: ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      const parsedData = JSON.parse(data.contents)

      if (parsedData && parsedData.title && parsedData.start && parsedData.end && parsedData.location) {
        let title = parsedData.title || ''
        title = title.replace(/^[^:]*:\s*/, '').trim()
        title = title.split(',')[0].trim()
        chapter.value = title

        const titleWords = title.split(/[\s-]+/)
        twoLines.checked = titleWords.length === 2

        const parsedStart = new Date(parsedData.start)
        const parsedEnd = new Date(parsedData.end)

        const startDate = parsedStart.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        const startTime = parsedStart.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
        const endTime = parsedEnd.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

        date.value = formatDate(startDate)
        time.value = formatTime(startTime, endTime)

        let location = parsedData.location || ''
        location = location.split(',')[0]
        place.value = location
      } else {
        throw new Error(getTranslation('error.arc.data'))
      }

      arcLink.value = ''
      arcModal.style.display = 'none'
    })
    .catch(error => {
      if (error.message === 'Failed to fetch') {
        showError(getTranslation('error.arc.cors'))
      } else {
        showError(getTranslation('error.arc.unknown'))
      }
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
