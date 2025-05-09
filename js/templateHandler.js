window.addEventListener('click', event => {
  if (event.target === templateModal) {
    templateModal.style.display = 'none'
  }
})

setTemplateBtn.addEventListener('click', () => {
  if (templateLink.value) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = templateLink.value

    img.onload = () => {
      if (img.width === 1660 && img.height === 2075) {
        updateTemplateLinkLocalStorage()
        templateModal.style.display = 'none'
        generateImage(() => {})
        templateLink.value = ''
      } else {
        showError(getTranslation('error.image.size'))
      }
    }

    img.onerror = () => {
      showError(getTranslation('error.image.load'))
    }
  } else {
    showError(getTranslation('error.noUrl'))
  }
})

changeTemplateOption.addEventListener('click', () => {
  templateModal.style.display = 'block'
  contextMenu.style.display = 'none'
})

resetTemplateOption.addEventListener('click', () => {
  resetCanvasTemplate()
  contextMenu.style.display = 'none'
})

document.querySelector('#templateModal .close').addEventListener('click', () => {
  templateModal.style.display = 'none'
})

function resetCanvasTemplate() {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)

  localStorage.removeItem('templateLink')

  generateImage(() => {})
}
