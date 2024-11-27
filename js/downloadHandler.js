downloadBtn.addEventListener('click', () => {
  const chapterValue = (chapter.value || getLocalStorage('chapter')).toLowerCase()
  const dateValue = (date.value || getLocalStorage('date')).toLowerCase()
  const sanitizedChapter = chapterValue ? chapterValue.replace(/\s+/g, '-') : ''

  let fileName = 'announcement'
  if (sanitizedChapter) {
    fileName += `_${sanitizedChapter}`
  }
  if (dateValue) {
    fileName += `_${dateValue.replace(/\s+/g, '')}`
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
