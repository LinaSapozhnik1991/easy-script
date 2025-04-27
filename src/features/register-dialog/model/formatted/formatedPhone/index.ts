export const formatPhoneNumber = (value: string) => {
  const cleaned = ('' + value).replace(/[^+\d]/g, '')

  const length = cleaned.length

  if (length === 0) {
    return ''
  } else if (length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  } else if (length > 11 && length <= 15) {
    return cleaned
  } else {
    return value
  }
}
