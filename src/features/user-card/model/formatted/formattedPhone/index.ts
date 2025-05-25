export const formatPhoneNumber = (value: string) => {
  const cleaned = ('' + value).replace(/[^+\d]/g, '')
  const length = cleaned.length

  if (length === 0) {
    return ''
  } else if (length === 11) {
    return `8 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`
  } else {
    return value
  }
}
