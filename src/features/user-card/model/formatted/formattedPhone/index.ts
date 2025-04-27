export const formatPhoneNumber = (value: string) => {
  const cleaned = ('' + value).replace(/[^+\d]/g, '')
  const length = cleaned.length

  if (length === 0) {
    return ''
  } else if (length === 11) {
    // Если номер из 11 цифр, форматируем как 8 XXX XXX XX XX
    return `8 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`
  } else {
    // Возвращаем исходное значение для номеров другой длины
    return value
  }
}
