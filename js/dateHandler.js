datePickerIcon.addEventListener('click', () => {
  hiddenDatePicker.click()
})

hiddenDatePicker.addEventListener('change', () => {
  if (hiddenDatePicker.value) {
    const dateObj = new Date(hiddenDatePicker.value)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const monthNumber = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()

    date.value = convertMonth(`${day}.${monthNumber}.${year}`, getCurrentLanguage(), false)
  }
})

saveDate.addEventListener('click', () => {
  updateDateLocalStorage()
})

function formatDate(dateString) {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/
  if (regex.test(dateString)) {
    return convertMonth(dateString, getCurrentLanguage(), false)
  }
  return dateString
}

function convertMonth(dateString, lang, toNumber = true) {
  const dateParts = dateString.split('.')
  const day = dateParts[0]
  const month = dateParts[1]
  const year = dateParts[2]

  if (toNumber) {
    if (lang === 'de' || lang === 'fr') {
      return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`
    } else if (lang === 'en') {
      return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
    }
  } else {
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

    if (lang === 'de') {
      return `${day}. ${monthNumbers[month]} ${year}`
    } else if (lang === 'en') {
      return `${monthNumbers[month]} ${parseInt(day)}, ${year}`
    } else if (lang === 'fr') {
      const formattedDay = day === '01' ? '1er' : parseInt(day)
      return `${formattedDay} ${monthNumbers[month]} ${year}`
    }
  }

  return dateString
}
