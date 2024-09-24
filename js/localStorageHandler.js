function setLocalStorage(name, value, update = true) {
  if (!value) {
    localStorage.removeItem(name)
  } else {
    localStorage.setItem(name, value.trim())
  }
  if (update) {
    updatePlaceholders()
  }
}

function getLocalStorage(name) {
  return localStorage.getItem(name) || ''
}

function updateChapterLocalStorage() {
  setLocalStorage('chapter', chapter.value)
}

function updateTwoLinesLocalStorage() {
  setLocalStorage('twoLines', twoLines.checked)
}

function updateDateLocalStorage() {
  setLocalStorage('date', date.value)
}

function updateTimeLocalStorage(update = true) {
  setLocalStorage('time', time.value, update)
}

function updateStartTimeLocalStorage(update = true) {
  setLocalStorage('startTime', startTimePopup.value !== '14:00' ? startTimePopup.value : '', update)
}

function updateEndTimeLocalStorage() {
  setLocalStorage('endTime', endTimePopup.value !== '18:00' ? endTimePopup.value : '')
}

function updatePlaceLocalStorage() {
  setLocalStorage('place', place.value)
}

function updateTemplateLinkLocalStorage() {
  setLocalStorage('templateLink', templateLink.value)
}
