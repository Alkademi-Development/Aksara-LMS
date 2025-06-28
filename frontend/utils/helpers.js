export function isStrJSON(str) {
  try {
    const parsed = JSON.parse(str)
    return typeof parsed === 'object'
  } catch {
    return false
  }
}