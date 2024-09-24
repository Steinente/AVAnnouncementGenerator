document.querySelector('#errorMessage .close').addEventListener('click', () => {
  errorMessage.style.display = 'none'
})

function showError(message) {
  errorText.textContent = message
  errorMessage.style.display = 'block'

  setTimeout(() => {
    errorMessage.style.display = 'none'
  }, 5000)
}