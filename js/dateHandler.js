datePickerIcon.addEventListener('click', () => {
  hiddenDatePicker.click()
})

hiddenDatePicker.addEventListener('change', () => {
  if (hiddenDatePicker.value) {
    const [year, month, day] = hiddenDatePicker.value.split('-')
    const formattedDate = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`

    date.value = convertMonth(formattedDate, getCurrentLanguage())
  }
})

saveDate.addEventListener('click', () => {
  updateDateLocalStorage()
})

function formatDate(dateString) {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/
  if (regex.test(dateString)) {
    return convertMonth(dateString, getCurrentLanguage())
  }
  return dateString
}

function convertMonth(dateString, lang) {
  const [day, month, year] = dateString.split('.').map(part => part.padStart(2, '0'))
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
    default: `${day} ${monthNames[month]} ${year}`,
    cs: `${day}. ${monthNames[month]} ${year}`,
    de: `${day}. ${monthNames[month]} ${year}`,
    en: `${monthNames[month]} ${day}, ${year}`,
    es: `${day} de ${monthNames[month]} de ${year}`,
    fr: `${day === '01' ? '1er' : day} ${monthNames[month]} ${year}`,
    fr_o: `${day === '01' ? '1er' : day} ${monthNames[month]} ${year}`,
    pt: `${day} de ${monthNames[month]} de ${year}`,
    zh_hant: `${year}年${monthNames[month]}${day}日`,
  }

  return textualFormats[lang] || textualFormats.default
}
