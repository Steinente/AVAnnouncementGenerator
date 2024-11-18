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
  const [day, month, year] = dateString.split('.').map(part => part.padStart(2, '0'))

  if (toNumber) {
    const dateFormats = {
      default: `${year}-${month}-${day}`,
      de: `${day}.${month}.${year}`,
      fr: `${day}.${month}.${year}`,
      en: `${month}/${day}/${year}`,
      es: `${day}/${month}/${year}`,
      it: `${day}/${month}/${year}`,
      pt: `${day}/${month}/${year}`,
      nl: `${day}-${month}-${year}`,
    }

    return dateFormats[lang] || dateFormats.default
  } else {
    const months = translations[lang]?.months
    if (!months) return `${year}-${month}-${day}`

    const monthNames = {
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

    const textualFormats = {
      default: `${year}-${month}-${day}`,
      de: `${parseInt(day)}. ${monthNames[month]} ${year}`,
      en: `${monthNames[month]} ${parseInt(day)}, ${year}`,
      fr: `${day === '01' ? '1er' : parseInt(day)} ${monthNames[month]} ${year}`,
      es: `${parseInt(day)} de ${monthNames[month]} de ${year}`,
      it: `${parseInt(day)} ${monthNames[month]} ${year}`,
      pt: `${parseInt(day)} de ${monthNames[month]} de ${year}`,
      nl: `${parseInt(day)} ${monthNames[month]} ${year}`,
    }

    return textualFormats[lang] || textualFormats.default
  }
}
